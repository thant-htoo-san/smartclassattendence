import { getApp, getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Replace these with your Firebase project credentials
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || 'YOUR_API_KEY',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || 'your-project.firebaseapp.com',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || 'your-project-id',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || 'your-project.appspot.com',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '1:123456789:web:abc123',
};

const invalidConfigKeys = Object.entries(firebaseConfig)
  .filter(([key, value]) => {
    const normalized = value.trim().toLowerCase();

    if (!normalized) {
      return true;
    }

    if (value.includes('YOUR_') || value.includes('your-project')) {
      return true;
    }

    if (key === 'messagingSenderId' && value === '123456789') {
      return true;
    }

    if (key === 'appId' && value.includes(':abc123')) {
      return true;
    }

    return false;
  })
  .map(([key]) => key);

export const isFirebaseConfigured = invalidConfigKeys.length === 0;

if (!isFirebaseConfigured) {
  console.warn(
    `[Firebase] Missing or placeholder config values for: ${invalidConfigKeys.join(', ')}. ` +
      'Set EXPO_PUBLIC_FIREBASE_* in .env.local and restart Expo with cache clear.'
  );
}

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

export default app;
