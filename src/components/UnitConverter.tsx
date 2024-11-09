import React from 'react';
import { areaUnits } from '../constants/units';

interface UnitConverterProps {
  value: number;
  currentUnit: string;
  onUnitChange: (unit: string) => void;
  className?: string;
}

export function UnitConverter({ value, currentUnit, onUnitChange, className = '' }: UnitConverterProps) {
  return (
    <select
      value={currentUnit}
      onChange={(e) => onUnitChange(e.target.value)}
      className={`text-sm border-gray-300 rounded-md focus:ring-[#db4a2b] focus:border-[#db4a2b] ${className}`}
    >
      {areaUnits.land.map((unit) => (
        <option key={unit.id} value={unit.id}>
          {unit.shortName}
        </option>
      ))}
    </select>
  );
}