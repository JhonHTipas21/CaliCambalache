import { api } from '../../utils/api-client.js';
import { protegerPagina } from '../../utils/roles.js';

document.addEventListener('DOMContentLoaded', () => {
  protegerPagina(['receptora']);

  const listContainer = document.getElementById('lista-solicitudes');
  const emptyState = document.getElementById('estado-vacio');
  const tabs = document.querySelectorAll('.tab-btn');

  let todasLasSolicitudes = [];
  let estadoFiltroActivo = 'all';

  if (!listContainer) return;

  async function cargarSolicitudes() {
    listContainer.innerHTML = `
      <div class="col-span-full flex flex-col items-center justify-center py-20 text-slate-400">
        <svg class="animate-spin h-10 w-10 text-primary mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span class="text-sm font-semibold tracking-wide">Cargando tus solicitudes...</span>
      </div>
    `;
    emptyState.classList.add('hidden');

    try {
      todasLasSolicitudes = await api.get('/solicitudes/mis-solicitudes') || [];
      renderizarListado();
    } catch (error) {
      console.error('Error al cargar solicitudes:', error);
      listContainer.innerHTML = `
        <div class="col-span-full text-center text-red-500 font-semibold py-12">
          Ocurrió un error al obtener tus solicitudes. Por favor verifica tu conexión.
        </div>
      `;
    }
  }

  function renderizarListado() {
    // Filtrar localmente según la pestaña
    let filtradas = [];
    if (estadoFiltroActivo === 'all') {
      filtradas = todasLasSolicitudes;
    } else if (estadoFiltroActivo === 'historial') {
      filtradas = todasLasSolicitudes.filter(s => s.estado === 'entregada' || s.estado === 'rechazada');
    } else {
      filtradas = todasLasSolicitudes.filter(s => s.estado === estadoFiltroActivo);
    }

    if (filtradas.length === 0) {
      listContainer.innerHTML = '';
      emptyState.classList.remove('hidden');
      return;
    }

    emptyState.classList.add('hidden');
    listContainer.innerHTML = '';

    filtradas.forEach(solicitud => {
      const pub = solicitud.publicacion || { titulo: 'Alimento Donado', descripcion: 'Esta donación ya no está disponible.', cantidad: 'N/A', ubicacion: 'N/A' };
      const donante = solicitud.donante || { nombre: 'Donante', telefono: 'No disponible' };

      const card = document.createElement('div');
      card.className = 'bg-white rounded-3xl shadow-md shadow-slate-100/50 border border-slate-100 overflow-hidden hover:shadow-lg transition-all duration-300 p-6 flex flex-col justify-between';

      // Badges y bordes de estado
      let badgeHTML = '';
      let borderClass = 'border-slate-150';
      let contactHTML = '';
      let actionsHTML = '';

      if (solicitud.estado === 'pendiente') {
        badgeHTML = `<span class="bg-amber-50 border border-amber-100 text-amber-700 text-[11px] font-bold px-3 py-1 rounded-full">Pendiente</span>`;
        borderClass = 'border-amber-100 shadow-amber-50/50';
        actionsHTML = `
          <div class="flex flex-col gap-2 mt-4">
            <a href="/pages/chat.html?solicitudId=${solicitud._id}" class="w-full flex items-center justify-center gap-1.5 bg-primary text-white hover:bg-primary-dark transition-all font-bold py-3 rounded-xl text-xs text-center shadow-md shadow-primary-500/10">
              💬 Chatear con Donante
            </a>
            <button class="btn-cancelar w-full bg-slate-50 border border-slate-200 text-slate-500 hover:text-red-600 hover:border-red-150 hover:bg-red-50/30 transition-all font-bold py-3 rounded-xl text-xs"
              data-id="${solicitud._id}">
              Cancelar Solicitud
            </button>
          </div>
        `;
      } else if (solicitud.estado === 'aprobada') {
        badgeHTML = `<span class="bg-emerald-50 border border-emerald-100 text-emerald-700 text-[11px] font-bold px-3 py-1 rounded-full animate-bounce">Aprobada</span>`;
        borderClass = 'border-emerald-100 shadow-emerald-50/50';
        card.classList.add('ring-2', 'ring-emerald-500/20');
        
        contactHTML = `
          <div class="mt-4 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100 text-xs">
            <div class="font-bold text-emerald-950 flex items-center gap-1.5 mb-2">
              <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
              <span>¡Coordinar Recogida!</span>
            </div>
            <div class="text-emerald-900 space-y-1">
              <div><strong>Contacto:</strong> ${donante.nombre}</div>
              <div><strong>Teléfono:</strong> <span class="font-bold text-emerald-700 text-sm select-all">${donante.telefono}</span></div>
              ${donante.email ? `<div><strong>Email:</strong> ${donante.email}</div>` : ''}
            </div>
          </div>
        `;
        actionsHTML = `
          <a href="/pages/chat.html?solicitudId=${solicitud._id}" class="w-full mt-4 flex items-center justify-center gap-1.5 bg-primary text-white hover:bg-primary-dark transition-all font-bold py-3 rounded-xl text-xs text-center shadow-md shadow-primary-500/10">
            💬 Chatear con Donante
          </a>
        `;
      } else if (solicitud.estado === 'rechazada') {
        badgeHTML = `<span class="bg-rose-50 border border-rose-100 text-rose-700 text-[11px] font-bold px-3 py-1 rounded-full">Rechazada</span>`;
        borderClass = 'border-rose-100 shadow-rose-50/50';
        card.classList.add('opacity-85');
      } else if (solicitud.estado === 'entregada') {
        badgeHTML = `<span class="bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-bold px-3 py-1 rounded-full">Entregado</span>`;
        borderClass = 'border-slate-200';
        card.classList.add('opacity-75');
        actionsHTML = `
          <a href="/pages/chat.html?solicitudId=${solicitud._id}" class="w-full mt-4 flex items-center justify-center gap-1.5 bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-800 transition-all font-bold py-3 rounded-xl text-xs text-center">
            💬 Ver Historial de Chat
          </a>
        `;
      }

      const dateReq = new Date(solicitud.createdAt);
      const dateReqFormatted = dateReq.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

      card.innerHTML = `
        <div>
          <div class="flex justify-between items-start gap-4 mb-4">
            <div>
              <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Solicitado: ${dateReqFormatted}</span>
              <h3 class="text-lg font-bold text-slate-800 mt-1 leading-tight group-hover:text-primary transition-colors">${pub.titulo}</h3>
            </div>
            ${badgeHTML}
          </div>

          <div class="space-y-2 border-t border-slate-50 pt-3 text-xs text-slate-500">
            <div class="flex items-center gap-1.5">
              <span>📦</span> <span><strong>Cantidad:</strong> ${pub.cantidad}</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span>📍</span> <span><strong>Punto Recogida:</strong> ${pub.ubicacion}</span>
            </div>
          </div>

          <div class="mt-4 bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs text-slate-650 leading-relaxed italic">
            <strong class="text-slate-800 block not-italic font-bold text-[10px] uppercase tracking-wider mb-1">Tu mensaje:</strong>
            "${solicitud.mensaje}"
          </div>

          ${contactHTML}
        </div>

        ${actionsHTML}
      `;

      listContainer.appendChild(card);
    });

    // Registrar cancelaciones
    listContainer.querySelectorAll('.btn-cancelar').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const solId = e.currentTarget.dataset.id;
        if (confirm('¿Estás seguro de que deseas cancelar esta solicitud?')) {
          try {
            await api.delete(`/solicitudes/${solId}`);
            alert('Solicitud cancelada correctamente.');
            cargarSolicitudes();
          } catch (err) {
            console.error('Error al cancelar:', err);
            alert(err.message || 'No se pudo cancelar la solicitud.');
          }
        }
      });
    });
  }

  // Event listener para las pestañas
  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      tabs.forEach(t => {
        t.classList.remove('border-primary', 'text-primary');
        t.classList.add('border-transparent', 'text-slate-400', 'hover:text-slate-700', 'hover:border-slate-200');
      });

      e.currentTarget.classList.remove('border-transparent', 'text-slate-400', 'hover:text-slate-700', 'hover:border-slate-200');
      e.currentTarget.classList.add('border-primary', 'text-primary');

      estadoFiltroActivo = e.currentTarget.dataset.status;
      renderizarListado();
    });
  });

  cargarSolicitudes();
});
