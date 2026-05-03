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
  const passwordConfirmInput = document.getElementById('confirmarPassword');
  const telefonoInput = document.getElementById('tel') || document.getElementById('telefono');
  const barraFortaleza = document.getElementById('password-strength-bar');
  const btnRegistro = document.getElementById('btnSubmit') || formRegistro.querySelector('button[type="submit"]') || formRegistro.querySelector('.btn');

  if (!formRegistro) return;

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

    let rol = 'donante';
    const rolRadio = document.querySelector('input[name="rol"]:checked');
    if (rolRadio) {
      rol = rolRadio.value;
    } else {
      const rolSelect = document.getElementById('rol');
      if (rolSelect) rol = rolSelect.value;
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
