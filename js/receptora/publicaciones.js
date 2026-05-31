import { api } from '../../utils/api-client.js';
import { protegerPagina } from '../../utils/roles.js';

document.addEventListener('DOMContentLoaded', () => {
  protegerPagina(['receptora']);

  const gridContainer = document.getElementById('lista-publicaciones');
  const emptyState = document.getElementById('estado-vacio');
  const searchInput = document.getElementById('filtro-busqueda');
  const categorySelect = document.getElementById('filtro-categoria');
  const btnBuscar = document.getElementById('btn-buscar');

  // Elementos del Modal
  const modal = document.getElementById('modal-solicitud');
  const modalTitle = document.getElementById('modal-titulo-alimento');
  const modalPubId = document.getElementById('modal-publicacion-id');
  const modalForm = document.getElementById('form-solicitud');
  const modalMessage = document.getElementById('mensaje-solicitud');
  const btnCerrarModal = document.getElementById('btn-cerrar-modal');
  const btnCancelarModal = document.getElementById('btn-cancelar-solicitud');

  if (!gridContainer) return;

  async function cargarPublicaciones() {
    gridContainer.innerHTML = `
      <div class="col-span-full flex flex-col items-center justify-center py-20 text-slate-400">
        <svg class="animate-spin h-10 w-10 text-primary mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span class="text-sm font-semibold tracking-wide">Buscando alimentos disponibles...</span>
      </div>
    `;
    emptyState.classList.add('hidden');

    const busqueda = searchInput.value.trim();
    const categoria = categorySelect.value;

    let url = '/publicaciones';
    const params = [];
    if (busqueda) params.push(`busqueda=${encodeURIComponent(busqueda)}`);
    if (categoria) params.push(`categoria=${encodeURIComponent(categoria)}`);
    if (params.length > 0) {
      url += '?' + params.join('&');
    }

    try {
      const publicaciones = await api.get(url);

      if (!publicaciones || publicaciones.length === 0) {
        gridContainer.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
      }

      emptyState.classList.add('hidden');
      gridContainer.innerHTML = '';

      publicaciones.forEach(pub => {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-3xl shadow-md shadow-slate-100/50 border border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-primary-100/40 hover:-translate-y-1.5 hover:border-primary-100 transition-all duration-300 flex flex-col justify-between';

        // Categorías temáticas con estilos vibrantes
        let bgGradient = 'from-primary-50/70 to-primary-100/50';
        let emoji = '🍲';
        let categoryName = 'Comida Preparada';
        let categoryColor = 'bg-primary-50 border-primary-100 text-primary-700';

        if (pub.categoria === 'perecedero') {
          bgGradient = 'from-emerald-50/80 to-emerald-100/40';
          emoji = '🥕';
          categoryName = 'Perecedero';
          categoryColor = 'bg-emerald-50 border-emerald-100 text-emerald-700';
        } else if (pub.categoria === 'no_perecedero') {
          bgGradient = 'from-amber-50/80 to-amber-100/40';
          emoji = '🥫';
          categoryName = 'No Perecedero';
          categoryColor = 'bg-amber-50 border-amber-100 text-amber-700';
        }

        const limiteObj = new Date(pub.fechaLimite);
        const limiteFormateado = limiteObj.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
        const nombreDonante = pub.donante ? pub.donante.nombre : 'Donante anónimo';

        // Alerta de expiración
        const diasRestantes = Math.ceil((limiteObj - new Date()) / (1000 * 60 * 60 * 24));
        let urgencyBadge = '';
        if (diasRestantes <= 2) {
          urgencyBadge = `
            <span class="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md shadow-md animate-pulse">
              ⚠️ Consumir Rápido
            </span>
          `;
        }

        card.innerHTML = `
          <div>
            <div class="h-44 bg-gradient-to-br ${bgGradient} flex items-center justify-center relative">
              <span class="text-6xl filter drop-shadow-md select-none transform hover:scale-110 duration-200 transition-transform">${emoji}</span>
              ${urgencyBadge}
              <span class="absolute top-3 right-3 ${categoryColor} border text-[11px] font-bold px-3 py-1 rounded-full shadow-sm">${categoryName}</span>
            </div>
            
            <div class="p-6">
              <h3 class="text-xl font-bold text-slate-800 mb-2 leading-tight group-hover:text-primary transition-colors">${pub.titulo}</h3>
              <p class="text-slate-500 text-xs leading-relaxed mb-5 line-clamp-3">${pub.descripcion}</p>
              
              <div class="space-y-2.5 border-t border-slate-50 pt-4 text-xs text-slate-600">
                <div class="flex items-center gap-2">
                  <span class="text-slate-400 text-sm">📦</span> 
                  <span><strong>Cantidad:</strong> ${pub.cantidad}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-slate-400 text-sm">📅</span> 
                  <span><strong>Fecha límite:</strong> ${limiteFormateado}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-slate-400 text-sm">👤</span> 
                  <span><strong>Donado por:</strong> <span class="text-slate-700 font-medium">${nombreDonante}</span></span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-slate-400 text-sm">📍</span> 
                  <span><strong>Ubicación:</strong> ${pub.ubicacion}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="p-6 pt-0">
            <button class="btn-solicitar w-full bg-primary text-white py-3 px-4 rounded-xl font-bold hover:bg-primary-dark transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 shadow-md shadow-primary-500/10 text-sm"
              data-id="${pub._id}" data-titulo="${pub.titulo}">
              <span>Solicitar Alimento</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </button>
          </div>
        `;

        gridContainer.appendChild(card);
      });

      // Registrar botones de solicitar
      gridContainer.querySelectorAll('.btn-solicitar').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const button = e.currentTarget;
          const pubId = button.dataset.id;
          const pubTitulo = button.dataset.titulo;

          modalPubId.value = pubId;
          modalTitle.textContent = `Solicitar: ${pubTitulo}`;
          modalMessage.value = '';

          modal.classList.remove('hidden');
          setTimeout(() => {
            modal.firstElementChild.classList.remove('scale-95');
            modal.firstElementChild.classList.add('scale-100');
          }, 10);
        });
      });

    } catch (error) {
      console.error('Error al cargar publicaciones:', error);
      gridContainer.innerHTML = `
        <div class="col-span-full text-center text-red-500 font-semibold py-12">
          Ocurrió un error al obtener las publicaciones de alimentos. Por favor, refresca la página.
        </div>
      `;
    }
  }

  function cerrarModal() {
    modal.firstElementChild.classList.remove('scale-100');
    modal.firstElementChild.classList.add('scale-95');
    setTimeout(() => {
      modal.classList.add('hidden');
    }, 150);
  }

  btnCerrarModal.addEventListener('click', cerrarModal);
  btnCancelarModal.addEventListener('click', cerrarModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) cerrarModal();
  });

  modalForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const publicacionId = modalPubId.value;
    const mensaje = modalMessage.value.trim();

    if (!mensaje) {
      alert('Por favor escribe un mensaje para el donante.');
      return;
    }

    const btnEnviar = document.getElementById('btn-confirmar-envio');
    const originalText = btnEnviar.textContent;
    btnEnviar.disabled = true;
    btnEnviar.textContent = 'Enviando solicitud...';

    try {
      await api.post('/solicitudes', { publicacionId, mensaje });
      alert('¡Solicitud enviada con éxito! Revisa la respuesta del donante en "Mis Solicitudes".');
      cerrarModal();
      cargarPublicaciones();
    } catch (err) {
      console.error('Error al solicitar:', err);
      alert(err.message || 'No se pudo enviar la solicitud. Inténtalo de nuevo.');
    } finally {
      btnEnviar.disabled = false;
      btnEnviar.textContent = originalText;
    }
  });

  btnBuscar.addEventListener('click', cargarPublicaciones);
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') cargarPublicaciones();
  });

  cargarPublicaciones();
});
