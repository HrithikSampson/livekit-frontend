// @/utils/firebase.ts
import admin from 'firebase-admin';

const serviceAccountPath = '../../serviceAccountKey.json';

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(require(serviceAccountPath)),
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DB_URL
    });
    console.log('Firebase Admin initialized successfully');
  } catch (error) {
    console.error('Firebase admin initialization error', error);
    console.error('Make sure serviceAccountKey.json is in the correct location');
  }
}

const db = admin.firestore();

export { db };