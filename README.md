# 🍎 CaliCambalache

[![NestJS](https://img.shields.io/badge/Backend-NestJS-red?style=for-the-badge&logo=nestjs)](https://nestjs.com/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-green?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![JavaScript](https://img.shields.io/badge/Frontend-Vanilla_JS-yellow?style=for-the-badge&logo=javascript)](https://developer.mozilla.org/es/docs/Web/JavaScript)
[![TailwindCSS](https://img.shields.io/badge/Styling-Tailwind_CSS-blue?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![JWT](https://img.shields.io/badge/Auth-JWT_&_OAuth_2.0-orange?style=for-the-badge&logo=json-web-tokens)](https://jwt.io/)

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

## 📄 Licencia
Este proyecto es de código abierto bajo la licencia MIT. Desarrollado con pasión para transformar el desperdicio de comida en abundancia para la comunidad caleña.
