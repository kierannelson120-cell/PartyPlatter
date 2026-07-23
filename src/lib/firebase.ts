import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Database instance (using specific database ID configured in firebase-applet-config.json)
const configWithDb = firebaseConfig as typeof firebaseConfig & { firestoreDatabaseId?: string };
export const db = getFirestore(app, configWithDb.firestoreDatabaseId || '(default)');

// Auth instance
export const auth = getAuth(app);

export default app;
