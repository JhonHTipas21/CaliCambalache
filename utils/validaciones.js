// utils/validaciones.js

export function validarEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return { valido: false, mensaje: 'El correo electrónico es obligatorio' };
  if (!re.test(String(email).toLowerCase())) return { valido: false, mensaje: 'El correo electrónico debe tener el formato usuario@dominio.com' };
  return { valido: true, mensaje: '' };
}

export function validarPassword(password) {
  if (!password) return { valido: false, mensaje: 'La contraseña es obligatoria' };
  if (password.length < 8) return { valido: false, mensaje: 'La contraseña debe tener al menos 8 caracteres' };
  if (!/(?=.*[A-Z])/.test(password)) return { valido: false, mensaje: 'La contraseña debe tener al menos una letra mayúscula' };
  if (!/(?=.*\d)/.test(password)) return { valido: false, mensaje: 'La contraseña debe tener al menos un número' };
  return { valido: true, mensaje: '' };
}

export function validarNombre(nombre) {
  if (!nombre || nombre.trim().length === 0) return { valido: false, mensaje: 'El nombre es obligatorio' };
  if (nombre.trim().length < 2) return { valido: false, mensaje: 'El nombre debe tener al menos 2 caracteres' };
  return { valido: true, mensaje: '' };
}

export function validarTelefono(tel) {
  if (!tel || tel.trim().length === 0) return { valido: true, mensaje: '' };
  const re = /^\+?[\d\s-]{7,15}$/;
  if (!re.test(tel)) return { valido: false, mensaje: 'El teléfono debe ser válido (ej. +57 300 000 0000)' };
  return { valido: true, mensaje: '' };
}

export function passwordsCoinciden(p1, p2) {
  return p1 === p2;
}

export function calcularFortalezaPassword(password) {
  let fortaleza = 0;
  if (password.length >= 8) fortaleza++;
  if (/(?=.*[A-Z])/.test(password)) fortaleza++;
  if (/(?=.*\d)/.test(password)) fortaleza++;

  if (fortaleza === 0) return 'debil';
  if (fortaleza === 1) return 'debil';
  if (fortaleza === 2) return 'media';
  return 'fuerte';
}
