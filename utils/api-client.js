// utils/api-client.js
import { authStore } from './auth-store.js';

const BASE_URL = 'http://localhost:3000';

async function request(method, endpoint, body = null, requiresAuth = true) {
  const headers = {
    'Content-Type': 'application/json'
  };

  if (requiresAuth) {
    const token = authStore.getAccessToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  const options = {
    method,
    headers,
    signal: controller.signal
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    let response = await fetch(`${BASE_URL}${endpoint}`, options);
    clearTimeout(timeoutId);

    if (response.status === 401 && requiresAuth) {
      const refreshToken = authStore.getRefreshToken();
      if (refreshToken) {
        try {
          const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authStore.getAccessToken()}` },
            body: JSON.stringify({ refreshToken })
          });
          
          if (refreshRes.ok) {
            const data = await refreshRes.json();
            authStore.setSession(data.access_token, data.refresh_token, authStore.getUsuario());
            
            headers['Authorization'] = `Bearer ${data.access_token}`;
            options.headers = headers;
            response = await fetch(`${BASE_URL}${endpoint}`, options);
          } else {
            throw new Error('Refresh token inválido');
          }
        } catch (err) {
          authStore.clear();
          window.location.href = '/docs/login.html';
          return null;
        }
      } else {
        authStore.clear();
          window.location.href = '/docs/login.html';
        return null;
      }
    }

    if (response.status === 403) {
      window.location.href = '/docs/index.html';
      return null;
    }

    if (response.status === 204) {
      return null;
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || `Error ${response.status}`);
    }

    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Timeout: El servidor tardó mucho en responder');
    }
    throw error;
  }
}

export const api = {
  get: (endpoint, auth = true) => request('GET', endpoint, null, auth),
  post: (endpoint, body, auth = true) => request('POST', endpoint, body, auth),
  patch: (endpoint, body, auth = true) => request('PATCH', endpoint, body, auth),
  delete: (endpoint, auth = true) => request('DELETE', endpoint, null, auth)
};
