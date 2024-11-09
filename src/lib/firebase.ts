import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { 
  getFirestore, 
  initializeFirestore,
  persistentLocalCache,
  persistentSingleTabManager,
  CACHE_SIZE_UNLIMITED,
  type Firestore
} from 'firebase/firestore';
import { getAnalytics, type Analytics } from 'firebase/analytics';

// Validate required environment variables
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID'
] as const;

const missingEnvVars = requiredEnvVars.filter(
  (envVar) => !import.meta.env[envVar]
);

if (missingEnvVars.length > 0) {
  throw new Error(
    `Missing required Firebase configuration. Please check your .env file for: ${missingEnvVars.join(', ')}`
  );
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || undefined
};

interface FirebaseServices {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
  analytics?: Analytics;
}

let firebaseServices: FirebaseServices | null = null;

const initializeFirebaseServices = (): FirebaseServices => {
  if (firebaseServices) {
    return firebaseServices;
  }

  try {
    // Initialize or get existing Firebase app
    const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

    // Initialize Auth
    const auth = getAuth(app);

    // Initialize Firestore with offline persistence settings
    const db = initializeFirestore(app, {
      localCache: persistentLocalCache({
        tabManager: persistentSingleTabManager(),
        cacheSizeBytes: CACHE_SIZE_UNLIMITED
      }),
      experimentalForceLongPolling: true
    });

    // Initialize Analytics if measurementId is provided
    let analytics: Analytics | undefined;
    if (import.meta.env.VITE_FIREBASE_MEASUREMENT_ID && typeof window !== 'undefined') {
      analytics = getAnalytics(app);
    }

    // Set up connection state listener
    const connectionStateListener = () => {
      const isOnline = navigator.onLine;
      console.log('Connection state changed:', isOnline ? 'online' : 'offline');
      
      if (!isOnline) {
        console.log('Device is offline. App will operate in offline mode.');
      }
    };

    window.addEventListener('online', connectionStateListener);
    window.addEventListener('offline', connectionStateListener);

    firebaseServices = { app, auth, db, analytics };
    return firebaseServices;
  } catch (error) {
    console.error('Firebase initialization error:', error);
    throw error;
  }
};

// Initialize services
const { auth, db, analytics } = initializeFirebaseServices();

// Export initialized services
export { auth, db, analytics };

// Export helper functions
export const isOnline = (): boolean => {
  return navigator.onLine;
};

export const isFirestoreAvailable = async (): Promise<boolean> => {
  try {
    if (!firebaseServices?.db) return false;
    
    const timeout = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Firestore timeout')), 5000);
    });

    await Promise.race([
      firebaseServices.db.terminate(),
      timeout
    ]);

    return true;
  } catch (error) {
    console.error('Firestore availability check failed:', error);
    return false;
  }
};