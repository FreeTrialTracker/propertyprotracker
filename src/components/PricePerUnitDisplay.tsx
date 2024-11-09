import React from 'react';
import { areaUnits } from '../constants/units';
import { convertArea } from '../utils/calculations';

interface PricePerUnitDisplayProps {
  pricePerSqm: number;
  currency: string;
  selectedUnit: string;
  onUnitChange: (unit: string) => void;
}

export function PricePerUnitDisplay({
  pricePerSqm,
  currency,
  selectedUnit,
  onUnitChange
}: PricePerUnitDisplayProps) {
  const convertedPrice = pricePerSqm * (areaUnits.land.find(u => u.id === selectedUnit)?.conversionToSqM || 1);

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={`${currency} ${convertedPrice.toLocaleString('en-US')}`}
        readOnly
        className="flex-1 h-12 rounded-md border-gray-300 bg-gray-50 shadow-sm"
      />
      <select
        value={selectedUnit}
        onChange={(e) => onUnitChange(e.target.value)}
        className="w-24 rounded-md border-gray-300 shadow-sm focus:border-[#db4a2b] focus:ring-[#db4a2b]"
      >
        {areaUnits.land.map((unit) => (
          <option key={unit.id} value={unit.id}>{unit.shortName}</option>
        ))}
      </select>
    </div>
  );
}