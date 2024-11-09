import { create } from 'zustand';

const initialState = {
  landArea: {
    column1: { value: 0, unit: 'sqm' },
    column2: { value: 0, unit: 'sqm' },
    column3: { value: 0, unit: 'sqm' }
  },
  buildingArea: {
    column1: { value: 0, unit: 'sqm' },
    column2: { value: 0, unit: 'sqm' },
    column3: { value: 0, unit: 'sqm' }
  },
  landPrice: {
    value: 0,
    currency: 'USD',
    priceType: 'total' as const,
    selectedUnit: 'sqm'
  },
  landValuation: {
    value: 0,
    currency: 'USD',
    priceType: 'total' as const,
    selectedUnit: 'sqm'
  },
  buildingPrice: {
    value: 0,
    currency: 'USD',
    priceType: 'total' as const,
    selectedUnit: 'sqm'
  },
  buildingValuation: {
    value: 0,
    currency: 'USD',
    priceType: 'total' as const,
    selectedUnit: 'sqm'
  }
};

interface CombinedPropertyStore {
  properties: typeof initialState[];
  addProperty: () => void;
  updateProperty: (index: number, updates: Partial<typeof initialState>) => void;
  clearProperty: (index: number) => void;
  resetStore: () => void;
  getInitialState: () => typeof initialState;
}

export const useCombinedPropertyStore = create<CombinedPropertyStore>((set) => ({
  properties: [initialState],
  addProperty: () => set((state) => ({
    properties: [...state.properties, { ...initialState }]
  })),
  updateProperty: (index, updates) => set((state) => ({
    properties: state.properties.map((prop, i) => 
      i === index ? { ...prop, ...updates } : prop
    )
  })),
  clearProperty: (index) => set((state) => ({
    properties: state.properties.map((prop, i) => 
      i === index ? { ...initialState } : prop
    )
  })),
  resetStore: () => set({ properties: [initialState] }),
  getInitialState: () => ({ ...initialState })
}));