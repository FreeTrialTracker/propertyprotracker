import React from 'react';
import { Save } from 'lucide-react';
import { useCalculatorStore } from '../store/calculatorStore';

interface DefaultSettingsButtonProps {
  currentSettings: {
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
    price: {
      currency: string;
    };
  };
}

export function DefaultSettingsButton({ currentSettings }: DefaultSettingsButtonProps) {
  const { setDefaultUnits, toggleDefaultUnits, defaultUnits } = useCalculatorStore();

  const handleSetDefaults = () => {
    if (!defaultUnits?.isActive) {
      // Set new defaults
      const newDefaults = {
        landArea: currentSettings.landArea ? {
          column1: { unit: currentSettings.landArea.column1.unit },
          column2: { unit: currentSettings.landArea.column2.unit },
          column3: { unit: currentSettings.landArea.column3.unit }
        } : undefined,
        buildingArea: currentSettings.buildingArea ? {
          column1: { unit: currentSettings.buildingArea.column1.unit },
          column2: { unit: currentSettings.buildingArea.column2.unit },
          column3: { unit: currentSettings.buildingArea.column3.unit }
        } : undefined,
        currency: currentSettings.price.currency
      };
      setDefaultUnits(newDefaults);
    } else {
      // Toggle off existing defaults
      toggleDefaultUnits();
    }
  };

  return (
    <button
      onClick={handleSetDefaults}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
        defaultUnits?.isActive
          ? 'bg-[#db4a2b] text-white hover:bg-[#c43d21]'
          : 'text-[#db4a2b] border border-[#db4a2b] hover:bg-[#db4a2b] hover:text-white'
      }`}
    >
      <Save className="h-4 w-4" />
      {defaultUnits?.isActive ? 'Default Units Active' : 'Set as Default Units'}
    </button>
  );
}