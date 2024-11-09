import { create } from 'zustand';

const initialState = {
  buildingArea: {
    column1: { value: 0, unit: 'sqm' },
    column2: { value: 0, unit: 'sqm' },
    column3: { value: 0, unit: 'sqm' }
  },
  price: {
    value: 0,
    currency: 'USD',
    priceType: 'total' as const,
    selectedUnit: 'sqm'
  },
  valuation: {
    value: 0,
    currency: 'USD',
    priceType: 'total' as const,
    selectedUnit: 'sqm'
  }
};

interface BuildingStore {
  properties: typeof initialState[];
  addProperty: () => void;
  updateProperty: (index: number, updates: Partial<typeof initialState>) => void;
  clearProperty: (index: number) => void;
  resetStore: () => void;
  getInitialState: () => typeof initialState;
}

export const useBuildingStore = create<BuildingStore>((set) => ({
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