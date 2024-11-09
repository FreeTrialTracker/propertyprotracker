import React from 'react';
import { areaUnits } from '../constants/units';

interface AreaUnitSelectorProps {
  value: string;
  onChange: (unit: string) => void;
  className?: string;
}

export function AreaUnitSelector({ value, onChange, className = '' }: AreaUnitSelectorProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-24 rounded-md border-gray-300 shadow-sm focus:border-[#db4a2b] focus:ring-[#db4a2b] ${className}`}
    >
      {areaUnits.land.map((unit) => (
        <option key={unit.id} value={unit.id}>{unit.shortName}</option>
      ))}
    </select>
  );
}