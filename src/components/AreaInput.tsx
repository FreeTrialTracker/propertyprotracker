import React from 'react';
import { areaUnits } from '../constants/units';
import type { AreaUnit } from '../types';

interface AreaInputProps {
  type: 'land' | 'building';
  primaryUnit: AreaUnit;
  secondaryUnit: AreaUnit;
  tertiaryUnit: AreaUnit;
  onPrimaryUnitChange: (unit: AreaUnit) => void;
  onSecondaryUnitChange: (unit: AreaUnit) => void;
  onTertiaryUnitChange: (unit: AreaUnit) => void;
}

export function AreaInput({
  type,
  primaryUnit,
  secondaryUnit,
  tertiaryUnit,
  onPrimaryUnitChange,
  onSecondaryUnitChange,
  onTertiaryUnitChange
}: AreaInputProps) {
  const availableUnits = areaUnits[type] || [];

  const handleValueChange = (value: string, onChange: (unit: AreaUnit) => void, currentUnit: AreaUnit) => {
    const numericValue = value.replace(/,/g, '');
    const parsedValue = numericValue === '' ? 0 : parseFloat(numericValue);
    
    onChange({
      ...currentUnit,
      value: parsedValue || 0
    });
  };

  const formatDisplayValue = (value: number) => {
    return value === 0 ? '' : value.toLocaleString('en-US');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Primary Unit */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Primary Unit</label>
        <div className="mt-1 flex gap-2">
          <input
            type="text"
            inputMode="decimal"
            value={formatDisplayValue(primaryUnit.value)}
            onChange={(e) => handleValueChange(e.target.value, onPrimaryUnitChange, primaryUnit)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#db4a2b] focus:ring-[#db4a2b]"
            placeholder="Enter value"
          />
          <select
            value={primaryUnit.unit}
            onChange={(e) => onPrimaryUnitChange({
              ...primaryUnit,
              unit: e.target.value
            })}
            className="w-24 rounded-md border-gray-300 shadow-sm focus:border-[#db4a2b] focus:ring-[#db4a2b]"
          >
            {availableUnits.map((unit) => (
              <option key={unit.id} value={unit.id}>
                {unit.shortName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Secondary Unit */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Secondary Unit</label>
        <div className="mt-1 flex gap-2">
          <input
            type="text"
            inputMode="decimal"
            value={formatDisplayValue(secondaryUnit.value)}
            onChange={(e) => handleValueChange(e.target.value, onSecondaryUnitChange, secondaryUnit)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#db4a2b] focus:ring-[#db4a2b]"
            placeholder="Enter value"
          />
          <select
            value={secondaryUnit.unit}
            onChange={(e) => onSecondaryUnitChange({
              ...secondaryUnit,
              unit: e.target.value
            })}
            className="w-24 rounded-md border-gray-300 shadow-sm focus:border-[#db4a2b] focus:ring-[#db4a2b]"
          >
            {availableUnits.map((unit) => (
              <option key={unit.id} value={unit.id}>
                {unit.shortName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tertiary Unit */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Tertiary Unit</label>
        <div className="mt-1 flex gap-2">
          <input
            type="text"
            inputMode="decimal"
            value={formatDisplayValue(tertiaryUnit.value)}
            onChange={(e) => handleValueChange(e.target.value, onTertiaryUnitChange, tertiaryUnit)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#db4a2b] focus:ring-[#db4a2b]"
            placeholder="Enter value"
          />
          <select
            value={tertiaryUnit.unit}
            onChange={(e) => onTertiaryUnitChange({
              ...tertiaryUnit,
              unit: e.target.value
            })}
            className="w-24 rounded-md border-gray-300 shadow-sm focus:border-[#db4a2b] focus:ring-[#db4a2b]"
          >
            {availableUnits.map((unit) => (
              <option key={unit.id} value={unit.id}>
                {unit.shortName}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}