import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

export interface FirebaseConfigOptions {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId: string;
}

// Check local storage for runtime configuration override (for external Firebase projects)
const LOCAL_STORAGE_KEY = 'student_twin_firebase_config';

export function getSavedFirebaseConfig(): FirebaseConfigOptions | null {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.apiKey && parsed.projectId) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to parse saved Firebase config', e);
  }
  return null;
}

export function saveFirebaseConfig(config: FirebaseConfigOptions): void {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(config));
  // Reload window to re-initialize with new credentials
  window.location.reload();
}

export function clearCustomFirebaseConfig(): void {
  localStorage.removeItem(LOCAL_STORAGE_KEY);
  window.location.reload();
}

export function isValidFirebaseConfig(config: FirebaseConfigOptions | null): boolean {
  if (!config) return false;
  if (!config.apiKey || typeof config.apiKey !== 'string') return false;
  const key = config.apiKey.trim();
  if (key === '' || key === 'YOUR_API_KEY' || key.includes('...') || key.length < 15) {
    return false;
  }
  if (!config.projectId || typeof config.projectId !== 'string') return false;
  const proj = config.projectId.trim();
  if (proj === '' || proj === 'your-project-id') {
    return false;
  }
  return true;
}

export function getEffectiveFirebaseConfig(): FirebaseConfigOptions | null {
  const saved = getSavedFirebaseConfig();
  if (saved && isValidFirebaseConfig(saved)) return saved;

  const envApiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  const envProjectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;

  if (envApiKey && envProjectId) {
    const candidate: FirebaseConfigOptions = {
      apiKey: envApiKey,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || `${envProjectId}.firebaseapp.com`,
      projectId: envProjectId,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || `${envProjectId}.appspot.com`,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
      appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
    };
    if (isValidFirebaseConfig(candidate)) {
      return candidate;
    }
  }

  // If saved config exists (even if partially configured by user), return it so UI can display it
  if (saved) return saved;

  return null;
}

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

const effectiveConfig = getEffectiveFirebaseConfig();

if (effectiveConfig && isValidFirebaseConfig(effectiveConfig)) {
  try {
    if (!getApps().length) {
      app = initializeApp(effectiveConfig);
    } else {
      app = getApp();
    }
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (err) {
    console.error('Firebase initialization error:', err);
  }
}

export const isFirebaseConfigured = Boolean(app && auth && db);

export { app, auth, db };
