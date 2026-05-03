// utils/notificaciones-helper.js

export function mostrarToast(mensaje, tipo, duracion = 3000) {
  const toast = document.createElement('div');
  
  let bgClass = 'bg-gray-800';
  let icon = '';
  
  if (tipo === 'exito') {
    bgClass = 'bg-emerald-500';
    icon = '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>';
  } else if (tipo === 'error') {
    bgClass = 'bg-red-500';
    icon = '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>';
  } else if (tipo === 'advertencia') {
    bgClass = 'bg-amber-500';
    icon = '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>';
  } else if (tipo === 'info') {
    bgClass = 'bg-indigo-600';
    icon = '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';
  }

  toast.className = `fixed bottom-4 right-4 ${bgClass} text-white px-6 py-3 rounded shadow-lg flex items-center space-x-2 z-50 transition-opacity duration-300`;
  toast.setAttribute('role', tipo === 'error' ? 'alert' : 'status');
  toast.setAttribute('aria-live', tipo === 'error' ? 'assertive' : 'polite');
  toast.innerHTML = `${icon} <span>${mensaje}</span>`;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, duracion);
}

export function mostrarErrorCampo(inputEl, mensaje) {
  inputEl.classList.add('border-red-500', 'focus:ring-red-500', 'focus:border-red-500');
  inputEl.setAttribute('aria-invalid', 'true');
  
  const spanError = document.getElementById(`${inputEl.id}-error`);
  if (spanError) {
    spanError.textContent = mensaje;
    spanError.classList.remove('hidden');
  }
}

export function limpiarErrorCampo(inputEl) {
  inputEl.classList.remove('border-red-500', 'focus:ring-red-500', 'focus:border-red-500');
  inputEl.setAttribute('aria-invalid', 'false');
  
  const spanError = document.getElementById(`${inputEl.id}-error`);
  if (spanError) {
    spanError.textContent = '';
    spanError.classList.add('hidden');
  }
}

export function mostrarErrorGlobal(contenedorId, mensaje) {
  const contenedor = document.getElementById(contenedorId);
  if (contenedor) {
    contenedor.textContent = mensaje;
    contenedor.classList.remove('hidden');
    contenedor.setAttribute('aria-hidden', 'false');
  }
}

export function limpiarErrorGlobal(contenedorId) {
  const contenedor = document.getElementById(contenedorId);
  if (contenedor) {
    contenedor.textContent = '';
    contenedor.classList.add('hidden');
    contenedor.setAttribute('aria-hidden', 'true');
  }
}
