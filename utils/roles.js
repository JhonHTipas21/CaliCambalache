// utils/roles.js
import { authStore } from './auth-store.js';

export function redirigirPorRol(rol) {
  switch (rol) {
    case 'donante':
      window.location.href = '/pages/donante/dashboard.html';
      break;
    case 'receptora':
      window.location.href = '/pages/receptora/dashboard.html';
      break;
    case 'admin':
      window.location.href = '/pages/admin/dashboard.html';
      break;
    default:
      window.location.href = '/pages/login.html';
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
