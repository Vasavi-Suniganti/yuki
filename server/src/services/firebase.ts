import admin from 'firebase-admin';

let db: any = null;
let auth: any = null;

try {
  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY) {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
        }),
      });
    }
    db = admin.firestore();
    auth = admin.auth();
    console.log('[POLARIS Backend] Firebase Admin SDK initialized with service account.');
  } else {
    console.log('[POLARIS Backend] Firebase Admin credentials not provided. Operating in development fallback mode.');
  }
} catch (err) {
  console.warn('[POLARIS Backend] Firebase Admin initialization warning:', err);
}

export function getDb() {
  return db;
}

export function getAuth() {
  return auth;
}
