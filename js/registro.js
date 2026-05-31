import { api } from '../utils/api-client.js';
import { authStore } from '../utils/auth-store.js';
import { redirigirPorRol } from '../utils/roles.js';
import { calcularFortalezaPassword } from '../utils/validaciones.js';

document.addEventListener('DOMContentLoaded', () => {
  if (authStore.isAuthenticated()) {
    redirigirPorRol(authStore.getRol());
    return;
  }

  const formRegistro = document.getElementById('registroForm') || document.querySelector('form');
  const nombreInput = document.getElementById('nombreCompleto') || document.getElementById('nombre');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password') || document.getElementById('pass');
  const passwordConfirmInput = document.getElementById('confirmarPassword') || document.getElementById('password-confirm');
  const telefonoInput = document.getElementById('tel') || document.getElementById('telefono');
  const barraFortaleza = document.getElementById('password-strength-bar');
  const btnRegistro = document.getElementById('btnSubmit') || formRegistro.querySelector('button[type="submit"]') || formRegistro.querySelector('.btn');

  // Elementos de selección de Rol
  const cardDonante = document.getElementById('card-donante');
  const cardReceptora = document.getElementById('card-receptora');
  const rolInput = document.getElementById('rol');

  if (!formRegistro) return;

  // Lógica de Selección Visual de Rol
  function seleccionarRol(rol) {
    if (rol === 'donante') {
      if (rolInput) rolInput.value = 'donante';
      if (cardDonante) {
        cardDonante.setAttribute('aria-pressed', 'true');
        cardDonante.classList.add('border-primary', 'bg-primary-50', 'ring-2', 'ring-primary-500');
        cardDonante.classList.remove('border-gray-250', 'bg-white');
      }
      if (cardReceptora) {
        cardReceptora.setAttribute('aria-pressed', 'false');
        cardReceptora.classList.remove('border-secondary', 'bg-secondary-50', 'ring-2', 'ring-secondary');
        cardReceptora.classList.add('border-gray-250', 'bg-white');
      }
    } else if (rol === 'receptora') {
      if (rolInput) rolInput.value = 'receptora';
      if (cardReceptora) {
        cardReceptora.setAttribute('aria-pressed', 'true');
        cardReceptora.classList.add('border-secondary', 'bg-secondary-50', 'ring-2', 'ring-secondary');
        cardReceptora.classList.remove('border-gray-250', 'bg-white');
      }
      if (cardDonante) {
        cardDonante.setAttribute('aria-pressed', 'false');
        cardDonante.classList.remove('border-primary', 'bg-primary-50', 'ring-2', 'ring-primary-500');
        cardDonante.classList.add('border-gray-250', 'bg-white');
      }
    }
  }

  if (cardDonante) {
    cardDonante.addEventListener('click', () => seleccionarRol('donante'));
  }
  if (cardReceptora) {
    cardReceptora.addEventListener('click', () => seleccionarRol('receptora'));
  }

  // Pre-seleccionar según query param, por defecto 'donante'
  const urlParams = new URLSearchParams(window.location.search);
  const roleParam = urlParams.get('rol') || urlParams.get('role');
  if (roleParam === 'receptora' || roleParam === 'receptor') {
    seleccionarRol('receptora');
  } else {
    seleccionarRol('donante');
  }

  if (passwordInput && barraFortaleza) {
    passwordInput.addEventListener('input', () => {
      const fortaleza = calcularFortalezaPassword(passwordInput.value);
      if (fortaleza === 'debil') {
        barraFortaleza.style.width = '33%'; barraFortaleza.style.backgroundColor = 'red';
      } else if (fortaleza === 'media') {
        barraFortaleza.style.width = '66%'; barraFortaleza.style.backgroundColor = 'orange';
      } else if (fortaleza === 'fuerte') {
        barraFortaleza.style.width = '100%'; barraFortaleza.style.backgroundColor = 'green';
      } else {
        barraFortaleza.style.width = '0%';
      }
    });
  }

  formRegistro.addEventListener('submit', async (e) => {
    e.preventDefault();

    const rol = rolInput ? rolInput.value : 'donante';

    if (!rol) {
      alert('Por favor selecciona el tipo de cuenta (Donante u Organización)');
      return;
    }

    if (passwordConfirmInput && passwordInput.value !== passwordConfirmInput.value) {
      alert('Las contraseñas no coinciden');
      return;
    }

    if (btnRegistro) {
      btnRegistro.disabled = true;
      btnRegistro.textContent = 'Creando cuenta...';
    }

    try {
      const datos = {
        nombre: nombreInput ? nombreInput.value.trim() : '',
        email: emailInput ? emailInput.value.trim().toLowerCase() : '',
        password: passwordInput ? passwordInput.value : '',
        passwordConfirm: passwordConfirmInput ? passwordConfirmInput.value : (passwordInput ? passwordInput.value : ''),
        rol: rol,
        telefono: telefonoInput ? telefonoInput.value.trim() : ''
      };

      const data = await api.post('/auth/registro', datos, false);
      authStore.setSession(data.access_token, data.refresh_token, data.usuario);
      
      alert('¡Cuenta creada con éxito!');
      redirigirPorRol(data.usuario.rol);
    } catch (error) {
      alert(error.message || 'Ocurrió un error al registrar. Intenta de nuevo.');
    } finally {
      if (btnRegistro) {
        btnRegistro.disabled = false;
        btnRegistro.textContent = 'Crear cuenta';
      }
    }
  });
});

