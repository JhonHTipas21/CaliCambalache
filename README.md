# 🍎 CaliCambalache

[![NestJS](https://img.shields.io/badge/Backend-NestJS-red?style=for-the-badge&logo=nestjs)](https://nestjs.com/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-green?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![JavaScript](https://img.shields.io/badge/Frontend-Vanilla_JS-yellow?style=for-the-badge&logo=javascript)](https://developer.mozilla.org/es/docs/Web/JavaScript)
[![TailwindCSS](https://img.shields.io/badge/Styling-Tailwind_CSS-blue?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![JWT](https://img.shields.io/badge/Auth-JWT_&_OAuth_2.0-orange?style=for-the-badge&logo=json-web-tokens)](https://jwt.io/)
[![Trello](https://img.shields.io/badge/Gestión-Trello-0079BF?style=for-the-badge&logo=trello&logoColor=white)](https://trello.com/b/mQeaxNbR/calicambalache)

**Plataforma comunitaria interactiva para reducir el desperdicio de alimentos y conectar corazones en Cali, Colombia.**

CaliCambalache conecta de forma eficiente a **Donantes** (restaurantes, comercios y particulares) con **Organizaciones Receptoras** (fundaciones, comedores comunitarios) a través de un flujo intuitivo y seguro de publicación, solicitud, chat integrado en tiempo real y confirmación de entregas.

---

## ✨ Características Principales

### 🔒 Autenticación Híbrida y Robusta
*   **Inicio de sesión tradicional:** Con contraseñas seguras encriptadas localmente usando `bcryptjs` con 12 rondas de hashing.
*   **Inicio de sesión social:** Integración nativa con **Google OAuth 2.0** que vincula cuentas de forma inteligente.
*   **Sesiones seguras:** Manejo de tokens duales (**Access Token** de 8h y **Refresh Token** de 7d) con un cliente HTTP personalizado que ejecuta renovación silenciosa (*silent refresh*).
*   **Rate Limiting:** Protección activa contra ataques de fuerza bruta y denegación de servicio mediante `ThrottlerModule` de NestJS.

### 🍲 Panel de Donaciones (Donante)
*   Creación, edición y eliminación de publicaciones de alimentos disponibles.
*   Gestión en tiempo real de las solicitudes entrantes de organizaciones.
*   Historial completo de donaciones entregadas y pendientes.

### 🏠 Panel de Receptoras (Organización)
*   Exploración del catálogo público de alimentos con filtros de búsqueda interactiva.
*   Envío y seguimiento de solicitudes de donación.
*   Historial y control de entregas de alimentos recibidos.

### 💬 Chat en Tiempo Real
*   Centro de mensajería interactivo para coordinar entregas directamente entre el Donante y la Receptora.
*   Persistencia de mensajes en MongoDB para no perder ningún detalle de la conversación.
*   Selector integrado de emojis interactivos y scroll dinámico inteligente.

---

## 🛠️ Stack Tecnológico

### Frontend (Cliente)
*   **Lenguaje:** HTML5 semántico y Vanilla JavaScript (ES6+ Modules).
*   **Estilos:** CSS3 nativo potenciado con **Tailwind CSS** para un diseño adaptativo y premium.
*   **Animaciones:** Micro-animaciones en CSS y SVG interactivos para una experiencia visual de alta calidad.

### Backend (API)
*   **Framework:** NestJS (Node.js + TypeScript).
*   **ORM / ODM:** Mongoose para el modelado de datos sobre MongoDB.
*   **Autenticación:** Passport.js (JWT y Google OAuth 2.0).

### Base de Datos
*   **Motor:** MongoDB Atlas (Cloud NoSQL DB).

---

## 📁 Estructura del Proyecto

```text
CaliCambalache/
├── assets/                  # Logos, imágenes y recursos estáticos
├── css/                     # Estilos principales compilados de Tailwind
├── js/                      # Lógica interactiva en JS Vanilla por pantalla
│   ├── utils/               # Clientes HTTP, almacenamiento de sesión y roles
│   └── chat.js, login.js... # Controladores de vistas
├── pages/                   # Vistas HTML organizadas
│   ├── donante/             # Dashboard y vistas de donantes
│   ├── receptora/           # Dashboard y vistas de receptoras
│   └── chat.html, login.html# Páginas públicas y de interacción
├── nestjs-api/              # ⚙️ API del Servidor en NestJS
│   ├── src/
│   │   ├── auth/            # Módulo de autenticación (JWT, Google OAuth, Guards)
│   │   ├── mensajes/        # Módulo del chat y persistencia de mensajes
│   │   ├── usuarios/        # Módulo de gestión y esquemas de usuarios
│   │   ├── publicaciones/   # Módulo del catálogo de donaciones
│   │   └── solicitudes/     # Módulo de solicitudes de alimentos
│   └── package.json
├── index.html               # Página de inicio del proyecto
├── tailwind.config.js       # Configuración del motor de diseño Tailwind CSS
└── package.json             # Dependencias del entorno frontend
```

---

## 🚀 Instalación y Configuración Local

### Prerrequisitos
*   [Node.js](https://nodejs.org/) v18 o superior instalado.
*   Base de datos de MongoDB (Local o Atlas en la nube).

### 1. Clonar el repositorio
```bash
git clone https://github.com/JhonHTipas21/CaliCambalache.git
cd CaliCambalache
```

### 2. Configurar el Backend (API)
1. Dirígete a la carpeta del servidor:
   ```bash
   cd nestjs-api
   ```
2. Crea un archivo `.env` basado en `.env.example` y rellena tus credenciales de MongoDB y Google OAuth:
   ```env
   PORT=3000
   MONGODB_URI=mongodb+srv://<usuario>:<password>@cluster...
   JWT_SECRET=tu_clave_secreta_jwt_de_64_caracteres
   JWT_REFRESH_SECRET=otra_clave_secreta_jwt_para_refresh
   GOOGLE_CLIENT_ID=tu_cliente_id_de_google_console
   GOOGLE_CLIENT_SECRET=tu_secreto_de_google_console
   GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
   FRONTEND_URL=http://localhost:5500
   ```
3. Instala las dependencias y ejecuta el servidor en modo desarrollo:
   ```bash
   npm install
   npm run start:dev
   ```
El backend estará escuchando en `http://localhost:3000`.

### 3. Configurar el Frontend
1. Vuelve a la raíz del proyecto e instala las dependencias:
   ```bash
   cd ..
   npm install
   ```
2. Inicia el servidor de desarrollo local para el frontend:
   ```bash
   npm run dev
   ```
El servidor web frontend iniciará por defecto en `http://localhost:5500`.

---

## ♿ Guía de Implementación de Accesibilidad - WCAG 2.2

CaliCambalache está comprometido con la inclusión social y la accesibilidad digital, permitiendo que donantes y fundaciones con diversas capacidades utilicen la plataforma sin barreras. Esta guía recopila los estándares técnicos y la conceptualización aplicada en nuestro proyecto bajo los lineamientos de **WCAG 2.2 del W3C**.

### Principios Fundamentales (POUR)

1.  **Perceptible:** La información y los componentes de la interfaz de CaliCambalache deben ser presentables de forma que todos los usuarios puedan percibirlos (no pueden ser invisibles a todos sus sentidos).
2.  **Operable:** Los elementos de navegación, botones y formularios de la aplicación deben ser operables desde cualquier dispositivo (teclado, mouse, táctil).
3.  **Comprensible:** El texto, estados y funcionamiento de la interfaz deben ser fáciles de entender para donantes y receptoras de todas las edades.
4.  **Robusto:** El código HTML y JS de CaliCambalache es compatible con tecnologías asistivas actuales y futuras (como lectores de pantalla).

#### Niveles de Conformidad
*   **Nivel A (Básico):** Requisitos mínimos que deben cumplirse para no bloquear completamente a usuarios con discapacidades.
*   **Nivel AA (Estándar - *Meta de CaliCambalache*):** Nivel recomendado y adoptado para garantizar una navegación óptima en la mayoría de sitios y servicios públicos/sociales.
*   **Nivel AAA (Mejorado):** Criterios especializados altamente restrictivos aplicables a secciones clave.

---

### 1. PERCEPTIBLE

#### 1.1 Alternativas de Texto (Nivel A)
*   **Imágenes de Donaciones:** Las fotografías de alimentos en el catálogo deben llevar un texto alternativo descriptivo en el atributo `alt` detallando el tipo de alimento (ej. manzana, arroz, pan).
*   **Imágenes Decorativas:** Iconos estéticos o fondos deben llevar `alt=""` y `role="presentation"` para que los lectores de pantalla los ignoren.
*   *Ejemplo en nuestro código:*
    ```html
    <!-- Imagen de alimento descriptiva -->
    <img src="platano.jpg" alt="Racimo de plátanos verdes de 3kg en buen estado">
    
    <!-- Logo puramente decorativo -->
    <img src="decoracion-naranja.svg" alt="" role="presentation">
    ```

#### 1.2 Medios Basados en Tiempo (Nivel A / AA)
*   **Transmisión / Videos Guía:** De incorporarse videos instructivos para la entrega de alimentos, estos deben contar con subtítulos sincronizados y transcripción textual completa.

#### 1.3 Adaptable (Nivel A)
*   **Estructura Semántica:** Uso estructurado de encabezados jerárquicos (`h1` para el título del panel, `h2` para secciones de donaciones, `h3` para cards individuales).
*   **Orden de lectura lógico:** El contenido de las publicaciones mantiene una estructura comprensible en orden lineal si se desactiva el estilo CSS.
*   *Ejemplo de estructura en CaliCambalache:*
    ```html
    <h1>Panel de Organización Receptora</h1>
    <main>
      <section>
        <h2>Alimentos Disponibles</h2>
        <article class="card">
          <h3>Donación de Panadería Pan de Bono</h3>
        </article>
      </section>
    </main>
    ```

#### 1.4 Distinguible (Nivel AA)
*   **Contraste de Color:** Todo el texto cumple con la relación de contraste **4.5:1** para texto normal y **3:1** para texto grande sobre fondos del color corporativo naranja/gris.
*   **Redimensionamiento:** El diseño responsivo permite hacer zoom de hasta un **200%** en el navegador sin que se rompan los botones de solicitar o enviar mensajes.
*   **Reflow:** La rejilla se adapta de forma fluida a un ancho de **320px** para dispositivos móviles.

---

### 2. OPERABLE

#### 2.1 Accesible por Teclado (Nivel A)
*   **Navegación Completa:** Se puede interactuar con el chat, botones de solicitud y formularios usando únicamente las teclas `Tab`, `Shift+Tab`, `Enter` y `Espacio`.
*   **Sin trampas para el foco:** El foco del teclado entra y sale libremente de la lista de emojis del chat y modales de confirmación.
*   *Ejemplo en el Chat interactivo:*
    ```html
    <!-- Accesibilidad mediante teclado en eventos -->
    <button onclick="enviarMensaje()" onkeypress="if(event.key === 'Enter') enviarMensaje()">
      Enviar Mensaje
    </button>
    ```

#### 2.2 Tiempo Suficiente (Nivel A / AA)
*   **Sin límites de tiempo:** Las solicitudes y confirmación de donaciones no caducan por inactividad en la sesión del usuario de forma inmediata sin previo aviso.

#### 2.3 Convulsiones y Reacciones Físicas (Nivel A / AAA)
*   **Sin parpadeos agresivos:** Las transiciones de carga de CaliCambalache evitan animaciones rápidas.
*   **Reducción de movimiento:** Si el sistema operativo tiene activada la reducción de animaciones, el sitio web las desactiva mediante CSS.
    ```css
    @media (prefers-reduced-motion: reduce) {
      * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    }
    ```

#### 2.4 Navegable (Nivel A / AA)
*   **Enlaces de Salto (Skip Links):** Se incluye un enlace de salto al inicio de cada página para permitir a usuarios con teclado saltarse la barra de navegación repetitiva y dirigirse directamente al contenido.
*   **Orden de foco lógico:** Al tabular, el cursor se mueve de forma natural de izquierda a derecha y de arriba a abajo.
*   *Ejemplo implementado:*
    ```html
    <a href="#main" class="sr-only focus:not-sr-only bg-primary text-white px-4 py-2 absolute top-0 left-0 z-50">
      Saltar al contenido principal
    </a>
    ```

#### 2.5 Modalidades de Entrada (Nivel AA)
*   **Tamaño del Objetivo:** Los botones de "Aceptar donación", "Solicitar" y los iconos de redes tienen una dimensión mínima de **24x24 píxeles** para evitar pulsaciones erróneas en pantallas táctiles.

---

### 3. COMPRENSIBLE

#### 3.1 Legible (Nivel A)
*   **Idioma de la página:** Todas las plantillas HTML especifican el idioma primario en la etiqueta raíz: `<html lang="es">`.
*   **Uso de otros idiomas:** Palabras o jergas técnicas en otros idiomas se envuelven indicando su procedencia: `<span lang="en">refresh token</span>`.

#### 3.2 Predecible (Nivel A / AA)
*   **Foco Seguro:** Posicionar el foco mediante teclado sobre un botón del catálogo de donaciones no desencadena una acción de solicitud inesperada de forma automática.

#### 3.3 Asistencia para la Entrada (Nivel A / AA)
*   **Validación y Etiquetas de Formularios:** Todos los campos de entrada de datos (email, teléfono, contraseña) están vinculados programáticamente a sus etiquetas utilizando el atributo `for`.
*   **Alertas Accesibles:** Los mensajes de error de registro se leen automáticamente por lectores de pantalla utilizando `aria-live="polite"`.
*   *Ejemplo en el Formulario de Registro:*
    ```html
    <label for="email">Correo electrónico (requerido)</label>
    <input type="email" id="email" required aria-describedby="email-error">
    <div id="email-error" class="error" aria-live="polite">
      Por favor ingrese un correo válido
    </div>
    ```

---

### 4. ROBUSTO

#### 4.1 Compatible (Nivel A / AA)
*   **Marcado Limpio:** Estructuras HTML con etiquetas de cierre bien formadas y atributos id únicos para evitar problemas de interpretación en los lectores de pantalla.
*   **Estados Accesibles:** Los menús interactivos o secciones colapsables del dashboard utilizan atributos dinámicos como `aria-expanded` para informar su estado al usuario.
    ```html
    <button aria-expanded="false" aria-controls="menu-navegacion">
      Menú de Cuenta
    </button>
    <ul id="menu-navegacion" hidden>
      <li><a href="/pages/donante/perfil.html">Mi Perfil</a></li>
    </ul>
    ```

---

### 🚀 Nuevos Criterios WCAG 2.2 Adoptados

1.  **Foco No Oscurecido (2.4.11 - AA):** Al usar navegación por teclado, el indicador de foco de un botón en el dashboard de CaliCambalache nunca es tapado por banners adhesivos o modales superpuestos.
2.  **Tamaño del Objetivo Mínimo (2.5.8 - AA):** Los botones táctiles de la interfaz móvil miden mínimo **24x24 px** de área física interactiva.
3.  **Ayuda Consistente (3.2.6 - A):** El botón de ayuda o contacto de soporte técnico está ubicado siempre en la misma posición (esquina inferior derecha/final del sidebar).
4.  **Autenticación Accesible (3.3.8 - AA):** El inicio de sesión con Google OAuth 2.0 evita que los usuarios tengan que realizar operaciones cognitivas complejas (como memorizar y escribir contraseñas largas en cada acceso).

---

### 🔍 Herramientas de Evaluación Utilizadas
*   **axe DevTools:** Extensión en navegador para auditorías rápidas de accesibilidad.
*   **Lighthouse:** Herramienta integrada de Chrome para medir la puntuación global de accesibilidad (Meta: >90 puntos).
*   **Prueba de Contraste WebAIM:** Validador de contraste de paleta de colores sobre el naranja marcario.
*   **Navegación Manual:** Pruebas rigurosas de toda la interfaz usando solo el teclado (`Tab`, `Enter`).

---

## 📄 Licencia
Este proyecto es de código abierto bajo la licencia MIT. Desarrollado con pasión para transformar el desperdicio de comida en abundancia para la comunidad caleña.
