import React from 'react';
import { Building, Map } from 'lucide-react';
import type { PropertyType } from '../types';

interface PropertyTypeSelectorProps {
  value: PropertyType;
  onChange: (type: PropertyType) => void;
}

export function PropertyTypeSelector({ value, onChange }: PropertyTypeSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
      <button
        onClick={() => onChange('land')}
        className={`flex flex-col items-center p-6 rounded-lg border-2 transition-all ${
          value === 'land'
            ? 'border-[#db4a2b] bg-[#db4a2b]/10'
            : 'border-gray-200 hover:border-[#db4a2b] hover:bg-[#db4a2b]/5'
        }`}
      >
        <Map className={`h-8 w-8 mb-2 ${value === 'land' ? 'text-[#db4a2b]' : 'text-gray-600'}`} />
        <span className={`font-medium ${value === 'land' ? 'text-[#db4a2b]' : 'text-gray-700'}`}>Land</span>
      </button>

      <button
        onClick={() => onChange('building')}
        className={`flex flex-col items-center p-6 rounded-lg border-2 transition-all ${
          value === 'building'
            ? 'border-[#db4a2b] bg-[#db4a2b]/10'
            : 'border-gray-200 hover:border-[#db4a2b] hover:bg-[#db4a2b]/5'
        }`}
      >
        <Building className={`h-8 w-8 mb-2 ${value === 'building' ? 'text-[#db4a2b]' : 'text-gray-600'}`} />
        <span className={`font-medium ${value === 'building' ? 'text-[#db4a2b]' : 'text-gray-700'}`}>Property</span>
      </button>
    </div>
  );
}