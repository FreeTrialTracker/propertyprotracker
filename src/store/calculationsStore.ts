import { create } from 'zustand';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  deleteDoc,
  doc,
  serverTimestamp,
  Timestamp,
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from '../lib/firebase';

interface CalculationData {
  id?: string;
  userId: string;
  propertyType: string;
  propertyNumber: number;
  transactionType: string;
  landArea?: {
    column1: { value: number; unit: string };
    column2: { value: number; unit: string };
    column3: { value: number; unit: string };
  } | null;
  buildingArea?: {
    column1: { value: number; unit: string };
    column2: { value: number; unit: string };
    column3: { value: number; unit: string };
  } | null;
  price: {
    value: number;
    currency: string;
    priceType: string;
    selectedUnit: string;
  };
  valuation?: {
    value: number;
    currency: string;
    priceType: string;
    selectedUnit: string;
  } | null;
  results: Array<{
    title: string;
    value: number | string;
    currency?: string | null;
    info: string;
    type?: 'positive' | 'negative' | null;
    percentage?: number | null;
    unit?: string | null;
  }>;
  createdAt?: Timestamp | string;
  updatedAt?: Timestamp | string;
}

interface CalculationsStore {
  savedCalculations: CalculationData[];
  loading: boolean;
  error: string | null;
  saveCalculation: (userId: string, data: Omit<CalculationData, 'userId'>) => Promise<string>;
  loadCalculations: (userId: string) => Promise<void>;
  deleteCalculation: (calculationId: string) => Promise<void>;
}

const MAX_SAVED_CALCULATIONS = 10;

export const useCalculationsStore = create<CalculationsStore>((set) => ({
  savedCalculations: [],
  loading: false,
  error: null,

  saveCalculation: async (userId: string, data: Omit<CalculationData, 'userId'>) => {
    try {
      set({ loading: true, error: null });

      // Check if user has reached the limit
      const userCalcsQuery = query(
        collection(db, 'calculations'),
        where('userId', '==', userId)
      );
      const snapshot = await getDocs(userCalcsQuery);
      
      if (snapshot.size >= MAX_SAVED_CALCULATIONS) {
        throw new Error(`You can only save up to ${MAX_SAVED_CALCULATIONS} calculations`);
      }

      // Prepare data for Firestore
      const calculationData = {
        userId,
        propertyType: data.propertyType,
        propertyNumber: data.propertyNumber,
        transactionType: data.transactionType,
        landArea: data.landArea || null,
        buildingArea: data.buildingArea || null,
        price: {
          value: Number(data.price.value),
          currency: data.price.currency,
          priceType: data.price.priceType,
          selectedUnit: data.price.selectedUnit
        },
        valuation: data.valuation ? {
          value: Number(data.valuation.value),
          currency: data.valuation.currency,
          priceType: data.valuation.priceType,
          selectedUnit: data.valuation.selectedUnit
        } : null,
        results: data.results.map(result => ({
          title: result.title,
          value: typeof result.value === 'string' ? result.value : Number(result.value),
          currency: result.currency || null,
          info: result.info,
          type: result.type || null,
          percentage: result.percentage ? Number(result.percentage) : null,
          unit: result.unit || null
        })),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'calculations'), calculationData);
      
      set(state => ({
        savedCalculations: [...state.savedCalculations, { ...calculationData, id: docRef.id }]
      }));

      return docRef.id;
    } catch (error: any) {
      console.error('Error saving calculation:', error);
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  loadCalculations: async (userId: string) => {
    try {
      set({ loading: true, error: null });
      const q = query(
        collection(db, 'calculations'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(MAX_SAVED_CALCULATIONS)
      );
      const querySnapshot = await getDocs(q);
      const calculations = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CalculationData[];
      set({ savedCalculations: calculations });
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deleteCalculation: async (calculationId: string) => {
    try {
      set({ loading: true, error: null });
      await deleteDoc(doc(db, 'calculations', calculationId));
      set(state => ({
        savedCalculations: state.savedCalculations.filter(calc => calc.id !== calculationId)
      }));
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  }
}));