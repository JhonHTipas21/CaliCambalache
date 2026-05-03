// utils/roles.js
import { authStore } from './auth-store.js';

export function redirigirPorRol(rol) {
  switch (rol) {
    case 'donante':
      window.location.href = '/docs/donante/dashboard.html';
      break;
    case 'receptora':
      window.location.href = '/docs/index.html'; // Redirigimos a inicio temporalmente si no existe la carpeta receptora
      break;
    case 'admin':
      window.location.href = '/docs/index.html';
      break;
    default:
      window.location.href = '/docs/login.html';
  }
}

let rutaAnterior = null;

export function protegerPagina(rolesPermitidos = []) {
  if (!authStore.isAuthenticated()) {
    rutaAnterior = window.location.pathname;
    window.location.href = '/pages/login.html';
    return;
  }

  if (rolesPermitidos.length > 0) {
    const userRole = authStore.getRol();
    if (!rolesPermitidos.includes(userRole)) {
      redirigirPorRol(userRole);
    }
  }
}

export function getRutaAnterior() {
  return rutaAnterior;
}
