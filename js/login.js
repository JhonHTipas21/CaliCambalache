import { api } from '../utils/api-client.js';
import { authStore } from '../utils/auth-store.js';
import { redirigirPorRol } from '../utils/roles.js';

document.addEventListener('DOMContentLoaded', () => {
  if (authStore.isAuthenticated()) {
    redirigirPorRol(authStore.getRol());
    return;
  }

  const formLogin = document.getElementById('loginForm') || document.querySelector('form');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password') || document.getElementById('pass');
  const btnLogin = document.getElementById('btnSubmit') || formLogin.querySelector('button[type="submit"]') || formLogin.querySelector('.btn');

  if (!formLogin) return;

  formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;

    if (!email || !password) {
      alert("Por favor llena todos los campos");
      return;
    }

    if (btnLogin) {
      btnLogin.disabled = true;
      btnLogin.textContent = 'Ingresando...';
    }

    try {
      const data = await api.post('/auth/login', { email, password }, false);
      authStore.setSession(data.access_token, data.refresh_token, data.usuario);
      redirigirPorRol(data.usuario.rol);
    } catch (error) {
      const msg = error.message || '';
      if (msg.includes('Failed to fetch')) {
        alert('Error de conexión: Verifica que el backend (NestJS) esté corriendo en el puerto 3000.');
      } else {
        alert('Error: Correo o contraseña incorrectos');
      }
    } finally {
      if (btnLogin) {
        btnLogin.disabled = false;
        btnLogin.textContent = 'Iniciar Sesión';
      }
    }
  });
});
