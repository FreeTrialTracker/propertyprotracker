import { create } from 'zustand';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface UserSettings {
  defaultCurrency: string;
  displayName: string;
}

interface UserState {
  settings: UserSettings | null;
  loading: boolean;
  error: string | null;
  loadSettings: (userId: string) => Promise<void>;
  updateSettings: (userId: string, settings: Partial<UserSettings>) => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  settings: null,
  loading: false,
  error: null,
  loadSettings: async (userId: string) => {
    try {
      set({ loading: true, error: null });
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        set({ settings: docSnap.data() as UserSettings });
      } else {
        // Initialize default settings
        const defaultSettings: UserSettings = {
          defaultCurrency: 'USD',
          displayName: ''
        };
        await setDoc(docRef, defaultSettings);
        set({ settings: defaultSettings });
      }
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },
  updateSettings: async (userId: string, newSettings: Partial<UserSettings>) => {
    try {
      set({ loading: true, error: null });
      const docRef = doc(db, 'users', userId);
      await setDoc(docRef, newSettings, { merge: true });
      
      // Update local state immediately
      set((state) => ({
        settings: state.settings 
          ? { ...state.settings, ...newSettings }
          : newSettings as UserSettings
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  }
}));