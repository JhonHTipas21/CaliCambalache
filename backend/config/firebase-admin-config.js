// ═══════════════════════════════════════════════════════════════════
// firebase-admin-config.js — Inicialización de Firebase Admin SDK
// ═══════════════════════════════════════════════════════════════════

const admin = require('firebase-admin');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

// ── Inicializar Admin SDK con service account ──
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH
    || path.resolve(__dirname, '../../serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(require(serviceAccountPath)),
});

// ── Exportar instancias de Firestore y Auth del Admin ──
const adminDb = admin.firestore();
const adminAuth = admin.auth();

module.exports = { admin, adminDb, adminAuth };
