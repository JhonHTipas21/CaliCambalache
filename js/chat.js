import { api } from '../utils/api-client.js';
import { authStore } from '../utils/auth-store.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Proteger ruta
  if (!authStore.isAuthenticated()) {
    window.location.href = '/pages/login.html';
    return;
  }

  // Datos del usuario actual
  const usuario = authStore.getUsuario();
  const currentUserId = usuario ? (usuario._id || usuario.id) : null;
  const currentUserName = authStore.getNombre();
  const currentUserRole = authStore.getRol();

  // Redirigir al dashboard según rol al pulsar "Volver al Dashboard"
  const btnBackDashboard = document.getElementById('btn-back-dashboard');
  if (btnBackDashboard) {
    const dashboardPath = currentUserRole === 'donante'
      ? '/pages/donante/dashboard.html'
      : '/pages/receptora/dashboard.html';
    btnBackDashboard.setAttribute('href', dashboardPath);
    btnBackDashboard.classList.remove('hidden');
  }

  // 2. Elementos DOM
  const listaConversaciones = document.getElementById('lista-conversaciones');
  const workspaceEmpty = document.getElementById('workspace-empty');
  const workspaceActive = document.getElementById('workspace-active');
  const activeChatAvatar = document.getElementById('active-chat-avatar');
  const activeChatName = document.getElementById('active-chat-name');
  const activeChatRole = document.getElementById('active-chat-role');
  const activeChatFood = document.getElementById('active-chat-food');
  const activeChatContact = document.getElementById('active-chat-contact');
  const activeChatPhone = document.getElementById('active-chat-phone');
  const chatMessagesThread = document.getElementById('chat-messages-thread');
  
  // Elementos del Input y Formulario
  const chatForm = document.getElementById('chat-form');
  const chatInputText = document.getElementById('chat-input-text');
  
  // Elementos Emoji
  const emojiDrawer = document.getElementById('emoji-drawer');
  const btnEmojiToggle = document.getElementById('btn-emoji-toggle');
  const emojiGrid = document.getElementById('emoji-grid');
  
  // Elementos Mobile
  const chatSidebar = document.getElementById('chat-sidebar');
  const btnCloseSidebarMobile = document.getElementById('btn-close-sidebar-mobile');
  const btnOpenSidebarMobile = document.getElementById('btn-open-sidebar-mobile');
  const btnBackListMobile = document.getElementById('btn-back-list-mobile');

  // Estado local del Chat
  let activeSolicitudId = null;
  let activeOtherUser = null;
  let pollingInterval = null;
  let cacheMensajesCount = 0;

  // Mapas de Emojis por categoría
  const EMOJI_MAP = {
    faces: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🥸', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😶', '🤫', '😬', '🤐', '🤢', '🤮', '🤧', '😷'],
    food: ['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶', '🫑', '🌽', '🥕', '🫒', '🧄', '🧅', '🥔', '🍠', '🥐', '🥯', '🍞', '🥖', '🥨', '🧀', '🍳', '🥞', '🧇', '🥓', '🥩', '🍗', '🍖', '🌭', '🍔', '🍟', '🍕', '🥪', '🥗', '🥘', '🍲', '🥣', '🥫'],
    symbols: ['👍', '👎', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '👇', '☝️', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💅', '🤳', '💪', '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '🌟', '⭐️', '✨', '⚡️', '🔥', '💥', '🌈', '☀️', '⛅️', '☁️']
  };

  // 3. Inicialización de Emoji Drawer
  function cargarEmojis(categoria) {
    emojiGrid.innerHTML = '';
    const emojis = EMOJI_MAP[categoria] || [];
    emojis.forEach(emoji => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'hover:scale-125 transition-transform w-9 h-9 focus:outline-none flex items-center justify-center';
      btn.textContent = emoji;
      btn.addEventListener('click', () => {
        // Insertar emoji en la posición actual del cursor o al final
        const startPos = chatInputText.selectionStart;
        const endPos = chatInputText.selectionEnd;
        const text = chatInputText.value;
        chatInputText.value = text.substring(0, startPos) + emoji + text.substring(endPos);
        
        // Restaurar cursor justo después del emoji insertado
        chatInputText.focus();
        chatInputText.selectionStart = chatInputText.selectionEnd = startPos + emoji.length;
      });
      emojiGrid.appendChild(btn);
    });
  }

  // Alternar apertura de Emoji Drawer
  btnEmojiToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    emojiDrawer.classList.toggle('hidden');
    if (!emojiDrawer.classList.contains('hidden')) {
      cargarEmojis('faces');
      document.querySelectorAll('.emoji-tab').forEach(tab => tab.classList.remove('text-primary', 'border-b-2', 'border-primary'));
      document.querySelector('[data-cat="faces"]').classList.add('text-primary', 'border-b-2', 'border-primary');
    }
  });

  // Cerrar cajón de emojis si se hace clic afuera
  document.addEventListener('click', (e) => {
    if (!emojiDrawer.contains(e.target) && e.target !== btnEmojiToggle) {
      emojiDrawer.classList.add('hidden');
    }
  });

  // Manejar pestañas de categorías de emoji
  document.querySelectorAll('.emoji-tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.stopPropagation();
      document.querySelectorAll('.emoji-tab').forEach(t => t.classList.remove('text-primary', 'border-b-2', 'border-primary'));
      tab.classList.add('text-primary', 'border-b-2', 'border-primary');
      cargarEmojis(tab.dataset.cat);
    });
  });

  // 4. Lógica de Sidebar y Vista Móvil
  if (btnOpenSidebarMobile) {
    btnOpenSidebarMobile.addEventListener('click', () => {
      chatSidebar.classList.remove('-translate-x-full');
      chatSidebar.classList.add('translate-x-0');
    });
  }
  if (btnCloseSidebarMobile) {
    btnCloseSidebarMobile.addEventListener('click', () => {
      chatSidebar.classList.add('-translate-x-full');
      chatSidebar.classList.remove('translate-x-0');
    });
  }
  if (btnBackListMobile) {
    btnBackListMobile.addEventListener('click', () => {
      activeSolicitudId = null;
      if (pollingInterval) clearInterval(pollingInterval);
      workspaceActive.classList.add('hidden');
      workspaceEmpty.classList.remove('hidden');
      chatSidebar.classList.remove('-translate-x-full');
      chatSidebar.classList.add('translate-x-0');
      // Limpiar query params sin recargar
      window.history.pushState(null, '', window.location.pathname);
    });
  }

  // 5. Cargar Conversaciones
  async function cargarConversaciones(solicitudIdPreseleccionada = null) {
    try {
      const endpoint = currentUserRole === 'donante' ? '/solicitudes/recibidas' : '/solicitudes/mis-solicitudes';
      const solicitudes = await api.get(endpoint);
      
      listaConversaciones.innerHTML = '';
      
      if (!solicitudes || solicitudes.length === 0) {
        listaConversaciones.innerHTML = `
          <div class="text-center py-10 px-4 text-slate-400 text-sm">
            No tienes solicitudes activas para chatear.
          </div>
        `;
        return;
      }

      solicitudes.forEach(sol => {
        // Filtrar solicitudes rechazadas si lo deseas, pero mostremos las pendientes y aprobadas
        if (sol.estado === 'rechazada') return;

        const otherUser = currentUserRole === 'donante' ? sol.receptora : sol.donante;
        if (!otherUser) return;

        const nombreContacto = otherUser.nombre;
        const inicial = nombreContacto.charAt(0).toUpperCase();
        
        const item = document.createElement('div');
        const isActive = sol._id === solicitudIdPreseleccionada;
        
        item.className = `flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all hover:bg-slate-50 border border-transparent ${
          isActive ? 'bg-primary-50/70 border-primary-100' : ''
        }`;
        
        // Determinar badge de estado
        let badgeColor = 'bg-amber-100 text-amber-800';
        if (sol.estado === 'aprobada') badgeColor = 'bg-emerald-100 text-emerald-800';
        if (sol.estado === 'entregada') badgeColor = 'bg-slate-200 text-slate-700';

        item.innerHTML = `
          <div class="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-base flex-shrink-0">
            ${inicial}
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex justify-between items-start">
              <h4 class="font-bold text-sm text-slate-800 truncate">${nombreContacto}</h4>
              <span class="text-[9px] font-bold px-2 py-0.5 rounded-full ${badgeColor} capitalize">${sol.estado}</span>
            </div>
            <p class="text-xs text-slate-500 truncate mt-0.5">${sol.publicacion ? sol.publicacion.titulo : 'Alimento'}</p>
          </div>
        `;
        
        item.addEventListener('click', () => {
          // Remover resaltado de los demás
          listaConversaciones.querySelectorAll('.bg-primary-50\\/70').forEach(el => {
            el.classList.remove('bg-primary-50/70', 'border-primary-100');
          });
          // Añadir resaltado
          item.classList.add('bg-primary-50/70', 'border-primary-100');
          
          // Ocultar sidebar en móviles al abrir chat
          if (window.innerWidth < 768) {
            chatSidebar.classList.add('-translate-x-full');
          }
          
          seleccionarConversacion(sol._id);
        });

        listaConversaciones.appendChild(item);
      });

      // Si hay una preseleccionada y existe en la lista, activarla
      if (solicitudIdPreseleccionada) {
        seleccionarConversacion(solicitudIdPreseleccionada);
      }

    } catch (err) {
      console.error('Error al cargar conversaciones:', err);
      listaConversaciones.innerHTML = `
        <div class="text-center py-10 px-4 text-red-500 text-xs font-semibold">
          Error al cargar los mensajes.
        </div>
      `;
    }
  }

  // 6. Seleccionar Conversación y activar Chat
  async function seleccionarConversacion(solicitudId) {
    if (pollingInterval) clearInterval(pollingInterval);
    activeSolicitudId = solicitudId;
    cacheMensajesCount = 0;

    // Actualizar parámetro de URL sin recargar
    window.history.pushState(null, '', `?solicitudId=${solicitudId}`);

    try {
      // Cargar detalles de la solicitud
      const solicitud = await api.get(`/solicitudes/${solicitudId}`);
      activeOtherUser = currentUserRole === 'donante' ? solicitud.receptora : solicitud.donante;

      if (!activeOtherUser) {
        alert('El contacto de esta conversación ya no está disponible.');
        return;
      }

      // Rellenar cabecera
      activeChatAvatar.textContent = activeOtherUser.nombre.charAt(0).toUpperCase();
      activeChatName.textContent = activeOtherUser.nombre;
      activeChatRole.textContent = activeOtherUser.rol === 'receptora' ? 'Organización Receptora' : 'Donante';
      activeChatFood.textContent = `Sobre: ${solicitud.publicacion ? solicitud.publicacion.titulo : 'Alimento'}`;

      // Mostrar/Ocultar teléfono de contacto (Solo si está aprobada o entregada)
      if ((solicitud.estado === 'aprobada' || solicitud.estado === 'entregada') && activeOtherUser.telefono) {
        activeChatPhone.textContent = activeOtherUser.telefono;
        activeChatPhone.setAttribute('href', `tel:${activeOtherUser.telefono}`);
        activeChatContact.classList.remove('hidden');
      } else {
        activeChatContact.classList.add('hidden');
      }

      // Activar paneles
      workspaceEmpty.classList.add('hidden');
      workspaceActive.classList.remove('hidden');

      // Carga inicial de mensajes
      await cargarMensajes();

      // Iniciar bucle de polling cada 3 segundos
      pollingInterval = setInterval(cargarMensajes, 3000);

    } catch (err) {
      console.error('Error al seleccionar la conversación:', err);
      alert('No pudimos abrir esta conversación. Asegúrate de tener permisos.');
    }
  }

  // 7. Cargar Mensajes
  async function cargarMensajes() {
    if (!activeSolicitudId) return;

    try {
      const mensajes = await api.get(`/mensajes?solicitud=${activeSolicitudId}`);
      
      // Si el conteo es el mismo, no redibujar para evitar flickering
      if (mensajes.length === cacheMensajesCount) return;
      
      cacheMensajesCount = mensajes.length;
      chatMessagesThread.innerHTML = '';

      if (mensajes.length === 0) {
        chatMessagesThread.innerHTML = `
          <div class="flex flex-col items-center justify-center py-20 text-slate-400 text-center">
            <span class="text-3xl mb-2">👋</span>
            <h4 class="font-bold text-sm text-slate-700">¡Saluda!</h4>
            <p class="text-xs text-slate-400 max-w-xs mt-1">Escribe un mensaje para iniciar la conversación y acordar detalles de entrega.</p>
          </div>
        `;
        return;
      }

      mensajes.forEach(msg => {
        const esEmisor = msg.emisor === currentUserId || (msg.emisor && (msg.emisor._id === currentUserId || msg.emisor === currentUserId));
        
        const bubbleWrap = document.createElement('div');
        bubbleWrap.className = `flex w-full ${esEmisor ? 'justify-end' : 'justify-start'}`;

        const hora = new Date(msg.createdAt || msg.time).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
        const nombreEmisor = msg.sender_name || 'Usuario';

        if (esEmisor) {
          bubbleWrap.innerHTML = `
            <div class="max-w-[75%] bg-primary text-white rounded-2xl rounded-tr-none px-4 py-2.5 shadow-md shadow-primary-500/10">
              <p class="text-sm leading-relaxed whitespace-pre-wrap">${msg.content}</p>
              <div class="flex items-center justify-end gap-1.5 mt-1 text-[9px] text-white/70 font-medium">
                <span>${hora}</span>
                <span>• Leído</span>
              </div>
            </div>
          `;
        } else {
          bubbleWrap.innerHTML = `
            <div class="max-w-[75%] bg-white border border-slate-100 text-slate-800 rounded-2xl rounded-tl-none px-4 py-2.5 shadow-sm">
              <div class="text-[9.5px] font-bold text-primary mb-0.5 capitalize">${nombreEmisor}</div>
              <p class="text-sm leading-relaxed whitespace-pre-wrap">${msg.content}</p>
              <div class="text-[9px] text-slate-400 mt-1 text-right font-medium">${hora}</div>
            </div>
          `;
        }

        chatMessagesThread.appendChild(bubbleWrap);
      });

      // Hacer scroll al final del hilo de mensajes
      chatMessagesThread.scrollTop = chatMessagesThread.scrollHeight;

    } catch (err) {
      console.error('Error al cargar mensajes:', err);
    }
  }

  // 8. Enviar Mensaje
  chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const texto = chatInputText.value.trim();
    if (!texto || !activeSolicitudId || !activeOtherUser) return;

    const btnSend = document.getElementById('btn-send-message');
    btnSend.disabled = true;
    chatInputText.value = '';
    emojiDrawer.classList.add('hidden');

    try {
      const dataMessage = {
        solicitud: activeSolicitudId,
        emisor: currentUserId,
        receptor: activeOtherUser._id || activeOtherUser,
        content: texto,
        sender_type: currentUserRole === 'donante' ? 'donante' : 'receptora',
        sender_name: currentUserName
      };

      // Guardar en backend
      await api.post('/mensajes', dataMessage);
      
      // Cargar mensajes inmediatamente
      await cargarMensajes();

    } catch (err) {
      console.error('Error al enviar el mensaje:', err);
      alert('No se pudo enviar el mensaje. Inténtalo de nuevo.');
    } finally {
      btnSend.disabled = false;
      chatInputText.focus();
    }
  });

  // Enviar mensaje al presionar la tecla Enter (sin presionar Shift)
  chatInputText.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      // Usar requestSubmit para ejecutar también el evento submit del formulario
      if (typeof chatForm.requestSubmit === 'function') {
        chatForm.requestSubmit();
      } else {
        chatForm.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      }
    }
  });

  // 9. Cargar inicial
  const urlParams = new URLSearchParams(window.location.search);
  const solicitudIdParam = urlParams.get('solicitudId');
  
  // Ocultar sidebar en mobile si carga con una conversación activa
  if (solicitudIdParam && window.innerWidth < 768) {
    chatSidebar.classList.add('-translate-x-full');
  }

  cargarConversaciones(solicitudIdParam);
});
