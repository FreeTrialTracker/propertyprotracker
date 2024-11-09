import { create } from 'zustand';

// Master defaults that should never change
const masterDefaults = {
  currency: 'USD',
  areaUnit: 'sqm'
};

const initialState = {
  landArea: {
    column1: { value: 0, unit: masterDefaults.areaUnit },
    column2: { value: 0, unit: masterDefaults.areaUnit },
    column3: { value: 0, unit: masterDefaults.areaUnit }
  },
  buildingArea: {
    column1: { value: 0, unit: masterDefaults.areaUnit },
    column2: { value: 0, unit: masterDefaults.areaUnit },
    column3: { value: 0, unit: masterDefaults.areaUnit }
  },
  price: {
    value: 0,
    currency: masterDefaults.currency,
    priceType: 'total' as const,
    selectedUnit: masterDefaults.areaUnit
  },
  valuation: {
    value: 0,
    currency: masterDefaults.currency,
    priceType: 'total' as const,
    selectedUnit: masterDefaults.areaUnit
  },
  lease: {
    leasePrice: {
      value: 0,
      currency: masterDefaults.currency,
      priceType: 'monthly' as const
    },
    marketLeasePrice: {
      value: 0,
      currency: masterDefaults.currency,
      priceType: 'monthly' as const
    },
    duration: 10
  },
  mortgage: {
    downPayment: {
      value: 0,
      currency: masterDefaults.currency
    },
    interestRate: 0,
    loanTermYears: 30,
    isCompoundInterest: true
  }
};

interface DefaultUnits {
  landArea?: {
    column1: { unit: string };
    column2: { unit: string };
    column3: { unit: string };
  };
  buildingArea?: {
    column1: { unit: string };
    column2: { unit: string };
    column3: { unit: string };
  };
  currency: string;
  isActive: boolean;
}

interface CalculatorStore {
  properties: typeof initialState[];
  activeProperties: number[];
  defaultUnits: DefaultUnits | null;
  addProperty: () => void;
  updateProperty: (index: number, updates: Partial<typeof initialState>) => void;
  clearProperty: (index: number) => void;
  resetStore: () => void;
  setDefaultUnits: (units: Partial<DefaultUnits>) => void;
  toggleDefaultUnits: () => void;
  updateAllProperties: (updates: Partial<typeof initialState>) => void;
}

export const useCalculatorStore = create<CalculatorStore>((set, get) => ({
  properties: [{ ...initialState }],
  activeProperties: [0],
  defaultUnits: null,

  addProperty: () => set((state) => {
    if (state.activeProperties.length >= 4) return state;

    const usedIndexes = new Set(state.activeProperties);
    let nextIndex = 0;
    while (usedIndexes.has(nextIndex)) {
      nextIndex++;
    }

    // Apply default units if active, otherwise use master defaults
    const newProperty = state.defaultUnits?.isActive ? {
      landArea: {
        column1: { value: 0, unit: state.defaultUnits.landArea?.column1.unit || masterDefaults.areaUnit },
        column2: { value: 0, unit: state.defaultUnits.landArea?.column2.unit || masterDefaults.areaUnit },
        column3: { value: 0, unit: state.defaultUnits.landArea?.column3.unit || masterDefaults.areaUnit }
      },
      buildingArea: {
        column1: { value: 0, unit: state.defaultUnits.buildingArea?.column1.unit || masterDefaults.areaUnit },
        column2: { value: 0, unit: state.defaultUnits.buildingArea?.column2.unit || masterDefaults.areaUnit },
        column3: { value: 0, unit: state.defaultUnits.buildingArea?.column3.unit || masterDefaults.areaUnit }
      },
      price: {
        value: 0,
        currency: state.defaultUnits.currency,
        priceType: 'total',
        selectedUnit: masterDefaults.areaUnit
      },
      valuation: {
        value: 0,
        currency: state.defaultUnits.currency,
        priceType: 'total',
        selectedUnit: masterDefaults.areaUnit
      },
      lease: { ...initialState.lease },
      mortgage: { ...initialState.mortgage }
    } : { ...initialState };

    return {
      properties: [...state.properties, newProperty],
      activeProperties: [...state.activeProperties, nextIndex].sort((a, b) => a - b)
    };
  }),

  updateProperty: (index, updates) => set((state) => ({
    properties: state.properties.map((prop, i) => 
      i === index ? { ...prop, ...updates } : prop
    )
  })),

  clearProperty: (index) => set((state) => ({
    properties: state.properties.map((prop, i) => 
      i === index ? { ...initialState } : prop
    ),
    activeProperties: state.activeProperties.filter(i => i !== index)
  })),

  resetStore: () => set({
    properties: [{ ...initialState }],
    activeProperties: [0],
    defaultUnits: null
  }),

  setDefaultUnits: (units) => set((state) => ({
    defaultUnits: {
      landArea: units.landArea,
      buildingArea: units.buildingArea,
      currency: units.currency || state.properties[0].price.currency,
      isActive: true
    }
  })),

  toggleDefaultUnits: () => set((state) => ({
    defaultUnits: state.defaultUnits?.isActive ? null : {
      landArea: {
        column1: { unit: state.properties[0].landArea.column1.unit },
        column2: { unit: state.properties[0].landArea.column2.unit },
        column3: { unit: state.properties[0].landArea.column3.unit }
      },
      buildingArea: {
        column1: { unit: state.properties[0].buildingArea.column1.unit },
        column2: { unit: state.properties[0].buildingArea.column2.unit },
        column3: { unit: state.properties[0].buildingArea.column3.unit }
      },
      currency: state.properties[0].price.currency,
      isActive: true
    }
  })),

  updateAllProperties: (updates) => set((state) => ({
    properties: state.properties.map(prop => {
      const newProp = { ...prop };
      if (updates.landArea) {
        newProp.landArea = {
          column1: { value: 0, unit: updates.landArea.column1.unit },
          column2: { value: 0, unit: updates.landArea.column2.unit },
          column3: { value: 0, unit: updates.landArea.column3.unit }
        };
      }
      if (updates.buildingArea) {
        newProp.buildingArea = {
          column1: { value: 0, unit: updates.buildingArea.column1.unit },
          column2: { value: 0, unit: updates.buildingArea.column2.unit },
          column3: { value: 0, unit: updates.buildingArea.column3.unit }
        };
      }
      if (updates.price?.currency) {
        newProp.price = {
          ...newProp.price,
          value: 0,
          currency: updates.price.currency,
          priceType: 'total',
          selectedUnit: masterDefaults.areaUnit
        };
        newProp.valuation = {
          ...newProp.valuation,
          value: 0,
          currency: updates.price.currency,
          priceType: 'total',
          selectedUnit: masterDefaults.areaUnit
        };
      }
      return newProp;
    })
  }))
}));