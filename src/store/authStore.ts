import { create } from 'zustand';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName?: string) => Promise<any>;
  signOut: () => Promise<void>;
  setUser: (user: User | null) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: null,
  signIn: async (email, password) => {
    try {
      set({ loading: true, error: null });
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      set({ user: userCredential.user });
      
      // Get user preferences
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      if (!userDoc.exists()) {
        // Create default preferences if they don't exist
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          email: userCredential.user.email,
          displayName: userCredential.user.displayName || email.split('@')[0],
          preferences: {
            defaultCurrency: 'USD'
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
    } catch (error: any) {
      set({ 
        error: error.code === 'auth/invalid-credential' 
          ? 'Invalid email or password' 
          : 'An error occurred during sign in'
      });
    } finally {
      set({ loading: false });
    }
  },
  signUp: async (email, password, displayName) => {
    try {
      set({ loading: true, error: null });
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create user document with preferences
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email: userCredential.user.email,
        displayName: displayName || email.split('@')[0],
        preferences: {
          defaultCurrency: 'USD'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      set({ user: userCredential.user });
      return userCredential;
    } catch (error: any) {
      set({ 
        error: error.code === 'auth/email-already-in-use'
          ? 'Email already in use'
          : 'An error occurred during sign up'
      });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  signOut: async () => {
    try {
      set({ loading: true, error: null });
      await firebaseSignOut(auth);
      set({ user: null });
    } catch (error: any) {
      set({ error: 'An error occurred during sign out' });
    } finally {
      set({ loading: false });
    }
  },
  setUser: (user) => set({ user }),
  clearError: () => set({ error: null })
}));

// Set up auth state listener
onAuthStateChanged(auth, (user) => {
  useAuthStore.getState().setUser(user);
});