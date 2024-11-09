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

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Primary Unit</label>
        <div className="mt-1 flex gap-2">
          <input
            type="number"
            min="0"
            value={primaryUnit.value}
            onChange={(e) => onPrimaryUnitChange({
              ...primaryUnit,
              value: parseFloat(e.target.value) || 0
            })}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#db4a2b] focus:ring-[#db4a2b]"
          />
          <select
            value={primaryUnit.unit}
            onChange={(e) => onPrimaryUnitChange({
              ...primaryUnit,
              unit: e.target.value
            })}
            className="block rounded-md border-gray-300 shadow-sm focus:border-[#db4a2b] focus:ring-[#db4a2b]"
          >
            {availableUnits.map((unit) => (
              <option key={unit.id} value={unit.id}>
                {unit.shortName} ({unit.name})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Secondary Unit</label>
        <div className="mt-1 flex gap-2">
          <input
            type="number"
            min="0"
            value={secondaryUnit.value}
            onChange={(e) => onSecondaryUnitChange({
              ...secondaryUnit,
              value: parseFloat(e.target.value) || 0
            })}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#db4a2b] focus:ring-[#db4a2b]"
          />
          <select
            value={secondaryUnit.unit}
            onChange={(e) => onSecondaryUnitChange({
              ...secondaryUnit,
              unit: e.target.value
            })}
            className="block rounded-md border-gray-300 shadow-sm focus:border-[#db4a2b] focus:ring-[#db4a2b]"
          >
            {availableUnits.map((unit) => (
              <option key={unit.id} value={unit.id}>
                {unit.shortName} ({unit.name})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Tertiary Unit</label>
        <div className="mt-1 flex gap-2">
          <input
            type="number"
            min="0"
            value={tertiaryUnit.value}
            onChange={(e) => onTertiaryUnitChange({
              ...tertiaryUnit,
              value: parseFloat(e.target.value) || 0
            })}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#db4a2b] focus:ring-[#db4a2b]"
          />
          <select
            value={tertiaryUnit.unit}
            onChange={(e) => onTertiaryUnitChange({
              ...tertiaryUnit,
              unit: e.target.value
            })}
            className="block rounded-md border-gray-300 shadow-sm focus:border-[#db4a2b] focus:ring-[#db4a2b]"
          >
            {availableUnits.map((unit) => (
              <option key={unit.id} value={unit.id}>
                {unit.shortName} ({unit.name})
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}