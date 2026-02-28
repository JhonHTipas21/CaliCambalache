// ═══════════════════════════════════════════════════════════════
// server.js — Punto de entrada del servidor Express
// ═══════════════════════════════════════════════════════════════

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middlewares globales ──
app.use(cors({
    origin: process.env.CORS_ORIGIN
        ? process.env.CORS_ORIGIN.split(',')
        : ['http://localhost:5500', 'http://127.0.0.1:5500'],
}));
app.use(express.json());
app.use(morgan('dev'));

// ── Rutas de la API ──
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/publicaciones', require('./routes/publicaciones.routes'));
app.use('/api/solicitudes', require('./routes/solicitudes.routes'));
app.use('/api/donaciones', require('./routes/donaciones.routes'));
app.use('/api/usuarios', require('./routes/usuarios.routes'));
app.use('/api/notificaciones', require('./routes/notificaciones.routes'));

// ── Ruta de health check ──
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Manejo de errores global ──
app.use((err, req, res, next) => {
    console.error('❌ Error:', err.message);
    res.status(err.status || 500).json({
        error: true,
        message: process.env.NODE_ENV === 'development'
            ? err.message
            : 'Error interno del servidor',
    });
});

// ── Iniciar servidor ──
app.listen(PORT, () => {
    console.log(`🚀 CaliCambalache API corriendo en http://localhost:${PORT}`);
});
