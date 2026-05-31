import { api } from '../../utils/api-client.js';
import { protegerPagina } from '../../utils/roles.js';

document.addEventListener('DOMContentLoaded', () => {
  // Proteger la página para que solo ingresen donantes
  protegerPagina(['donante']);

  const form = document.getElementById('form-donacion');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btnSubmit = document.getElementById('btn-publicar');
    const originalText = btnSubmit.textContent;

    // Obtener los datos del formulario
    const titulo = document.getElementById('titulo').value.trim();
    const descripcion = document.getElementById('descripcion').value.trim();
    const categoria = document.getElementById('categoria').value;
    const cantidad = document.getElementById('cantidad').value.trim();
    const fechaLimiteVal = document.getElementById('fechaLimite').value;
    const ubicacion = document.getElementById('ubicacion').value.trim();

    if (!titulo || !descripcion || !categoria || !cantidad || !fechaLimiteVal || !ubicacion) {
      alert('Por favor complete todos los campos obligatorios (*)');
      return;
    }

    const fechaLimite = new Date(fechaLimiteVal);

    btnSubmit.disabled = true;
    btnSubmit.textContent = 'Publicando...';

    try {
      await api.post('/publicaciones', {
        titulo,
        descripcion,
        categoria,
        cantidad,
        fechaLimite,
        ubicacion
      });

      alert('¡Donación publicada con éxito!');
      window.location.href = '/pages/donante/mis-publicaciones.html';
    } catch (error) {
      console.error('Error al publicar:', error);
      alert(error.message || 'Error al guardar la donación. Inténtalo de nuevo.');
    } finally {
      btnSubmit.disabled = false;
      btnSubmit.textContent = originalText;
    }
  });
});
