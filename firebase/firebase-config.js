// ═══════════════════════════════════════════════════════════════
// firebase-config.js — Inicialización del SDK de Firebase (v10+)
// ═══════════════════════════════════════════════════════════════

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

// ── Configuración de Firebase — proyecto calicambalache-fdfb4 ──
const firebaseConfig = {
    apiKey: "AIzaSyB6YANOKH88QECDt3-TfUDAeEzmbKFKdi8",
    authDomain: "calicambalache-fdfb4.firebaseapp.com",
    projectId: "calicambalache-fdfb4",
    storageBucket: "calicambalache-fdfb4.firebasestorage.app",
    messagingSenderId: "890080125085",
    appId: "1:890080125085:f9e2fdd95d5e605a57474"
};

// ── Inicializar Firebase ──
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ── Exportar instancias para uso en toda la app ──
export { app, auth, db };
