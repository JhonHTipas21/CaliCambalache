import { api } from '../../utils/api-client.js';
import { protegerPagina } from '../../utils/roles.js';

document.addEventListener('DOMContentLoaded', async () => {
  protegerPagina(['donante']);

  const listContainer = document.getElementById('lista-donaciones');
  const emptyState = document.getElementById('estado-vacio');

  if (!listContainer) return;

  async function cargarDonaciones() {
    listContainer.innerHTML = `
      <div class="col-span-full flex justify-center py-10">
        <svg class="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    `;

    try {
      const donaciones = await api.get('/publicaciones/mis-donaciones');
      const solicitudes = await api.get('/solicitudes/recibidas') || [];

      if (!donaciones || donaciones.length === 0) {
        listContainer.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
      }

      emptyState.classList.add('hidden');
      listContainer.innerHTML = '';

      const solicitudesPorPublicacion = {};
      solicitudes.forEach(s => {
        const pubId = typeof s.publicacion === 'object' ? s.publicacion._id : s.publicacion;
        if (!solicitudesPorPublicacion[pubId]) {
          solicitudesPorPublicacion[pubId] = [];
        }
        solicitudesPorPublicacion[pubId].push(s);
      });

      donaciones.forEach(pub => {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group flex flex-col justify-between';

        let bgGradient = 'from-primary-50 to-primary-100';
        let emoji = '🍲';
        if (pub.categoria === 'perecedero') {
          bgGradient = 'from-green-50 to-emerald-100';
          emoji = '🥕';
        } else if (pub.categoria === 'no_perecedero') {
          bgGradient = 'from-amber-50 to-orange-100';
          emoji = '🥫';
        } else if (pub.categoria === 'preparado') {
          bgGradient = 'from-primary-50 to-amber-100';
          emoji = '🍲';
        }

        let statusText = 'Activo';
        let statusClass = 'bg-green-100 text-green-800 border-green-200';
        if (pub.estado === 'solicitado') {
          statusText = 'Solicitado';
          statusClass = 'bg-amber-100 text-amber-800 border-amber-200';
        } else if (pub.estado === 'entregado') {
          statusText = 'Entregado';
          statusClass = 'bg-gray-200 text-gray-800 border-gray-300';
          card.classList.add('opacity-75', 'hover:opacity-100');
        }

        const fechaObj = new Date(pub.createdAt);
        const fechaFormateada = fechaObj.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
        const limiteObj = new Date(pub.fechaLimite);
        const limiteFormateado = limiteObj.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });

        const pubRequests = solicitudesPorPublicacion[pub._id] || [];
        let solicitudesHTML = '';

        if (pubRequests.length > 0 && pub.estado !== 'entregado') {
          solicitudesHTML = `
            <div class="mt-4 border-t border-dashed border-gray-200 pt-4 space-y-3">
              <h4 class="text-xs font-bold text-gray-500 uppercase tracking-wider">Solicitudes Recibidas:</h4>
              ${pubRequests.map(req => {
                const nombreReceptora = req.receptora ? req.receptora.nombre : 'Organización';
                const telefonoReceptora = req.receptora ? req.receptora.telefono || 'Sin teléfono' : 'Sin teléfono';
                
                if (req.estado === 'pendiente') {
                  return `
                    <div class="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs">
                      <div class="font-semibold text-gray-900">${nombreReceptora}</div>
                      <p class="text-gray-600 mt-1 italic">"${req.mensaje}"</p>
                      <div class="mt-3 flex gap-2">
                        <button class="btn-aprobar flex-1 bg-primary text-white py-1 px-2 rounded font-bold hover:bg-primary-dark transition-colors" data-id="${req._id}">Aceptar</button>
                        <button class="btn-rechazar flex-1 bg-white border border-red-200 text-red-600 py-1 px-2 rounded font-bold hover:bg-red-50 transition-colors" data-id="${req._id}">Rechazar</button>
                      </div>
                      <a href="/pages/chat.html?solicitudId=${req._id}" class="w-full mt-2 inline-flex items-center justify-center gap-1 bg-primary-100 hover:bg-primary-200 text-primary py-1.5 px-2 rounded font-bold transition-all text-[11px] text-center shadow-sm">
                        💬 Chatear con Receptor
                      </a>
                    </div>
                  `;
                } else if (req.estado === 'aprobada') {
                  return `
                    <div class="bg-green-50 border border-green-200 rounded-lg p-3 text-xs">
                      <div class="font-semibold text-gray-900">Aceptada para: ${nombreReceptora}</div>
                      <div class="text-gray-500 mt-1">Tel: ${telefonoReceptora}</div>
                      <div class="mt-3 flex gap-2">
                        <button class="btn-entregar flex-1 bg-secondary text-white py-1.5 px-2 rounded font-bold hover:bg-secondary-dark transition-colors" data-id="${req._id}">Confirmar Entrega</button>
                        <a href="/pages/chat.html?solicitudId=${req._id}" class="flex-1 inline-flex items-center justify-center gap-1 bg-primary text-white py-1.5 px-2 rounded font-bold hover:bg-primary-dark transition-all text-center">
                          💬 Chatear
                        </a>
                      </div>
                    </div>
                  `;
                }
                return '';
              }).join('')}
            </div>
          `;
        } else if (pub.estado === 'entregado') {
          const entReq = pubRequests.find(r => r.estado === 'entregada');
          if (entReq) {
            solicitudesHTML = `
              <div class="mt-4 border-t border-gray-100 pt-3 text-xs text-gray-500 flex items-center gap-1">
                <span>✅ Entregado a:</span>
                <span class="font-semibold text-gray-700">${entReq.receptora ? entReq.receptora.nombre : 'Organización'}</span>
              </div>
            `;
          }
        }

        card.innerHTML = `
          <div>
            <div class="h-40 bg-gradient-to-br ${bgGradient} flex items-center justify-center relative">
              <span class="text-5xl">${emoji}</span>
              <span class="absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full border ${statusClass}">${statusText}</span>
            </div>
            <div class="p-5">
              <div class="text-xs text-gray-500 font-medium mb-1 capitalize">${pub.categoria.replace('_', ' ')} • Creado el ${fechaFormateada}</div>
              <h3 class="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">${pub.titulo}</h3>
              <p class="text-sm text-gray-600 mb-4 line-clamp-2">${pub.descripcion}</p>
              
              <div class="space-y-1 text-xs text-gray-500">
                <div><strong>Cantidad:</strong> ${pub.cantidad}</div>
                <div><strong>Límite consumo:</strong> ${limiteFormateado}</div>
                <div><strong>Ubicación Recogida:</strong> ${pub.ubicacion}</div>
              </div>

              ${solicitudesHTML}
            </div>
          </div>
          <div class="p-5 pt-0 mt-auto flex justify-between border-t border-gray-100 pt-4">
            <button class="btn-eliminar text-sm text-red-600 hover:text-red-800 font-semibold" data-id="${pub._id}">Eliminar</button>
          </div>
        `;

        listContainer.appendChild(card);
      });

      listContainer.querySelectorAll('.btn-aprobar').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          const reqId = e.target.dataset.id;
          if (confirm('¿Deseas aceptar esta solicitud? Esto reservará el alimento para esta organización.')) {
            try {
              await api.patch(`/solicitudes/${reqId}/estado`, { estado: 'aprobada' });
              alert('Solicitud aceptada. Comunícate con la organización receptora.');
              cargarDonaciones();
            } catch (err) {
              alert(err.message || 'Error al aceptar solicitud');
            }
          }
        });
      });

      listContainer.querySelectorAll('.btn-rechazar').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          const reqId = e.target.dataset.id;
          if (confirm('¿Deseas rechazar esta solicitud? El alimento seguirá disponible para otras organizaciones.')) {
            try {
              await api.patch(`/solicitudes/${reqId}/estado`, { estado: 'rechazada' });
              alert('Solicitud rechazada.');
              cargarDonaciones();
            } catch (err) {
              alert(err.message || 'Error al rechazar solicitud');
            }
          }
        });
      });

      listContainer.querySelectorAll('.btn-entregar').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          const reqId = e.target.dataset.id;
          if (confirm('¿Confirmas que has entregado con éxito los alimentos a la organización?')) {
            try {
              await api.patch(`/solicitudes/${reqId}/estado`, { estado: 'entregada' });
              alert('¡Gracias por donar! Donación marcada como completada/entregada.');
              cargarDonaciones();
            } catch (err) {
              alert(err.message || 'Error al confirmar entrega');
            }
          }
        });
      });

      listContainer.querySelectorAll('.btn-eliminar').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          const pubId = e.target.dataset.id;
          if (confirm('¿Estás seguro de que deseas eliminar esta publicación?')) {
            try {
              await api.delete(`/publicaciones/${pubId}`);
              alert('Publicación eliminada correctamente.');
              cargarDonaciones();
            } catch (err) {
              alert(err.message || 'Error al eliminar publicación');
            }
          }
        });
      });

    } catch (error) {
      console.error('Error al cargar publicaciones:', error);
      listContainer.innerHTML = `
        <div class="col-span-full text-center text-red-600 font-semibold py-10">
          Ocurrió un error al conectar con el servidor. Por favor asegúrate de que el backend está corriendo.
        </div>
      `;
    }
  }

  cargarDonaciones();
});
