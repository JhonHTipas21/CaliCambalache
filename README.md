# 🍎 CaliCambalache

**Aplicación web comunitaria para reducir el desperdicio de alimentos en Cali, Colombia.**

Conecta **Donantes** (personas, restaurantes, comercios) con **Organizaciones Receptoras** (fundaciones, comedores comunitarios) mediante un flujo completo de publicación → solicitud → aceptación → entrega → historial.

> Proyecto desarrollado por el equipo **TripleBug** · Metodología FDD · 5 sprints de 2 semanas.

---

## 🚀 Instalación y Uso Local

### Prerrequisitos

- [Node.js](https://nodejs.org/) v18 o superior
- Cuenta de [Firebase](https://firebase.google.com/) con proyecto configurado

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/calicambalache.git
cd calicambalache
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
# Editar .env con las credenciales reales de Firebase
```

### 3. Instalar dependencias del frontend

```bash
npm install
```

### 4. Compilar Tailwind CSS

```bash
# Modo desarrollo (watch)
npx tailwindcss -i ./css/input.css -o ./css/main.css --watch

# Modo producción (minificado)
npm run build
```

### 5. Levantar el servidor de desarrollo (frontend)

```bash
npm run dev
```

Esto abrirá el proyecto en `http://localhost:5500`.

### 6. Levantar el backend (en otra terminal)

```bash
cd backend
npm install
npm run dev
```

El servidor Express correrá en `http://localhost:3000`.

---

## 📁 Estructura del Proyecto

| Carpeta | Descripción |
|---------|-------------|
| `pages/` | Pantallas HTML organizadas por rol (donante, receptora, admin) |
| `css/` | Archivo de entrada Tailwind (`input.css`) y salida compilada (`main.css`) |
| `js/` | Un archivo JavaScript por pantalla o funcionalidad |
| `firebase/` | Servicios Firebase separados por colección (auth, publicaciones, etc.) |
| `components/` | Fragmentos HTML reutilizables (navbar, sidebar, cards, modales) |
| `utils/` | Funciones helper reutilizables (validaciones, fechas, roles) |
| `assets/` | Imágenes, íconos y fuentes del proyecto |
| `backend/` | Servidor Node.js + Express con API REST |

---

## 👥 Roles de Usuario

### 🟢 Donante
Registrarse, editar perfil, crear/editar/eliminar publicaciones de alimentos, ver y gestionar solicitudes recibidas, confirmar entregas y recibir notificaciones.

### 🔵 Receptora
Registrarse, editar perfil, ver y filtrar publicaciones disponibles, solicitar donaciones, cancelar solicitudes, consultar historial de donaciones recibidas y recibir notificaciones.

### 🔴 Admin
Iniciar sesión, gestionar usuarios (listar, bloquear, activar), moderar publicaciones y consultar reportes de impacto (kg salvados, donaciones totales).

---

## 🛠️ Stack Tecnológico

- **Frontend:** HTML5 + CSS3 + JavaScript ES6+ + Tailwind CSS
- **Backend:** Node.js + Express (API REST)
- **Base de datos:** Firebase Firestore (NoSQL)
- **Autenticación:** Firebase Authentication
- **Hosting:** Vercel (frontend)
- **Control de versiones:** GitHub

---

## 📄 Licencia

MIT © TripleBug
