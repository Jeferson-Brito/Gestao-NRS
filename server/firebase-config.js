// server/firebase-config.js
import admin from 'firebase-admin';

// Configuração usando variáveis de ambiente para produção
const firebaseConfig = {
  type: "service_account",
  project_id: "gestao-nrs",
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID || "default",
  private_key: process.env.FIREBASE_PRIVATE_KEY || "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC5\n-----END PRIVATE KEY-----\n",
  client_email: process.env.FIREBASE_CLIENT_EMAIL || "firebase-adminsdk-ple7o@gestao-nrs.iam.gserviceaccount.com",
  client_id: process.env.FIREBASE_CLIENT_ID || "default",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-ple7o%40gestao-nrs.iam.gserviceaccount.com"
};

// Inicializar Firebase Admin (apenas se ainda não foi inicializado)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(firebaseConfig),
    projectId: "gestao-nrs"
  });
}

const db = admin.firestore();

export const COLLECTIONS = {
  ANALISTAS: 'analistas',
  TURNOS: 'turnos',
  EVENTOS: 'eventos',
  FOLGAS_MANUAIS: 'folgasManuais',
  USERS: 'users'
};

export default db;
