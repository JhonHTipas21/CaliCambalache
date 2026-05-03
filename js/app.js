// js/app.js
import { api } from '../utils/api-client.js';
import { authStore } from '../utils/auth-store.js';

export async function logout() {
  try {
    if (authStore.isAuthenticated()) {
      await api.post('/auth/logout', {}, true);
    }
  } catch (error) {
    console.error('Error en logout:', error);
  } finally {
    authStore.clear();
    window.location.href = '/docs/login.html';
  }
}

export function renderizarNavbar() {
  const userMenu = document.getElementById('user-menu');
  const navProfile = document.querySelector('.navbar-profile');

  if (userMenu) {
    if (authStore.isAuthenticated()) {
      const nombre = authStore.getNombre();
      const rol = authStore.getRol();
      userMenu.innerHTML = `
        <div class="flex items-center space-x-4">
          <div class="text-right">
            <p class="text-sm font-semibold text-gray-900">${nombre}</p>
            <p class="text-xs text-gray-500 capitalize">${rol}</p>
          </div>
          <button id="btn-logout" class="text-sm text-red-600 hover:text-red-800 font-medium" style="background:none; border:none; cursor:pointer;">Cerrar sesión</button>
        </div>
      `;

      document.getElementById('btn-logout').addEventListener('click', logout);
    } else {
      userMenu.innerHTML = `
        <a href="/docs/login.html" class="text-indigo-600 font-medium hover:text-indigo-800">Iniciar sesión</a>
        <a href="/docs/registro.html" class="ml-4 bg-indigo-600 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700">Registrarse</a>
      `;
    }
  }

  if (navProfile) {
    if (authStore.isAuthenticated()) {
      const nombre = authStore.getNombre();
      const inicial = nombre ? nombre.charAt(0).toUpperCase() : 'U';
      navProfile.innerHTML = `
        <span class="profile-icon">${inicial}</span>
        <span style="font-weight:bold; margin-left:8px; cursor:pointer;" id="btn-logout-nav">Cerrar sesión</span>
      `;
      if (navProfile.tagName === 'A') navProfile.removeAttribute('href'); // Quitar el href por completo para evitar recargas
      
      navProfile.style.cursor = 'pointer';
      navProfile.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        logout();
      });
    } else {
      navProfile.innerHTML = `
        <span class="profile-icon">👤</span>
        Iniciar sesión
      `;
      if (navProfile.tagName === 'A') navProfile.href = "/docs/login.html";
    }
  }

  // Ocultar links protegidos si no está autenticado
  const navLinks = document.querySelector('.navbar-links');
  if (navLinks) {
    if (!authStore.isAuthenticated()) {
      Array.from(navLinks.querySelectorAll('a')).forEach(link => {
        if (link.href.includes('donar') || link.href.includes('crear-publicacion') || link.href.includes('mensajes')) {
          link.style.display = 'none';
        }
      });
    }
  }
}

export function poblarPerfil() {
  if (!authStore.isAuthenticated()) return;
  const nombreInput = document.getElementById('nombre');
  const emailInput = document.getElementById('email');
  
  if (nombreInput || emailInput) {
    const usuario = authStore.getUsuario();
    const nombreCompleto = authStore.getNombre() || '';
    const email = usuario ? usuario.email : '';
    const rol = authStore.getRol();
    const inicial = nombreCompleto ? nombreCompleto.charAt(0).toUpperCase() : (email ? email.charAt(0).toUpperCase() : 'U');

    if (nombreInput) {
      const parts = nombreCompleto.split(' ');
      nombreInput.value = parts[0] || '';
      const apellidoInput = document.getElementById('apellido');
      if (apellidoInput) {
        apellidoInput.value = parts.slice(1).join(' ') || '';
      }
    }
    if (emailInput) {
      emailInput.value = email;
    }

    const sidebarName = document.querySelector('.profile-sidebar h3');
    if (sidebarName) sidebarName.textContent = nombreCompleto || email;
    
    const sidebarRole = document.querySelector('.profile-sidebar .role');
    if (sidebarRole) sidebarRole.textContent = rol;
    
    const sidebarAvatar = document.querySelector('.profile-sidebar .profile-avatar');
    if (sidebarAvatar) sidebarAvatar.textContent = inicial;
  }
}

export function iniciarVerificacionSesion() {
  setInterval(async () => {
    if (authStore.isAuthenticated()) {
      const token = authStore.getAccessToken();
      if (!token) return;

      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expiracion = payload.exp * 1000;
        const ahora = Date.now();
        
        if (expiracion - ahora < 10 * 60 * 1000) {
          const refreshToken = authStore.getRefreshToken();
          if (refreshToken) {
            const refreshRes = await fetch('http://localhost:3000/auth/refresh', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
              body: JSON.stringify({ refreshToken })
            });
            if (refreshRes.ok) {
              const data = await refreshRes.json();
              authStore.setSession(data.access_token, data.refresh_token, authStore.getUsuario());
            } else {
              mostrarAvisoExpiracion();
            }
          } else {
            mostrarAvisoExpiracion();
          }
        }
      } catch (e) {
        console.error('Error verificando sesión', e);
      }
    }
  }, 5 * 60 * 1000); // Cada 5 min
}

export function mostrarAvisoExpiracion() {
  // Banner de sesión a punto de expirar
  const banner = document.createElement('div');
  banner.className = 'fixed top-0 left-0 w-full bg-amber-500 text-white text-center py-2 z-50 shadow-md';
  banner.innerHTML = `
    <p class="text-sm font-medium inline-block mr-4">Tu sesión está a punto de expirar.</p>
    <button id="btn-renovar-banner" class="bg-white text-amber-600 px-3 py-1 rounded text-xs font-bold hover:bg-gray-100">Renovar sesión</button>
  `;
  document.body.prepend(banner);

  document.getElementById('btn-renovar-banner').addEventListener('click', () => {
    // Redirigir a login para refrescar sesión
    authStore.clear();
    window.location.href = '/pages/login.html';
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderizarNavbar();
  iniciarVerificacionSesion();
  poblarPerfil();
});
