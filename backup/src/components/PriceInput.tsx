import React from 'react';
import { Info } from 'lucide-react';
import { currencies } from '../constants/currencies';

interface PriceInputProps {
  label: string;
  value: number;
  currency: string;
  priceType?: 'total' | 'per-unit';
  selectedUnit?: string;
  availableUnits?: Array<{ value: string; label: string }>;
  showPricePerUnit?: boolean;
  onChange: (value: number) => void;
  onCurrencyChange: (currency: string) => void;
  onPriceTypeChange?: (type: 'total' | 'per-unit') => void;
  onUnitChange?: (unit: string) => void;
  className?: string;
}

export function PriceInput({
  label,
  value,
  currency,
  priceType = 'total',
  selectedUnit,
  availableUnits = [],
  showPricePerUnit = true,
  onChange,
  onCurrencyChange,
  onPriceTypeChange,
  onUnitChange,
  className = ''
}: PriceInputProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="space-y-2">
        <label className="flex items-center text-sm font-medium text-gray-700">
          {label}
          <button
            type="button"
            className="ml-1 text-gray-400 hover:text-gray-500"
            title="Click for more information about pricing"
          >
            <Info className="h-4 w-4" />
          </button>
        </label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Price Input and Currency Selection */}
          <div className="flex space-x-2">
            <input
              type="number"
              min="0"
              value={value || ''}
              onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
              className="block flex-1 h-12 rounded-md border-gray-300 shadow-sm focus:border-[#db4a2b] focus:ring-[#db4a2b] text-base"
              placeholder="0.00"
            />
            <select
              value={currency}
              onChange={(e) => onCurrencyChange(e.target.value)}
              className="w-24 h-12 rounded-md border-gray-300 shadow-sm focus:border-[#db4a2b] focus:ring-[#db4a2b] text-base"
            >
              {currencies.map((curr) => (
                <option key={curr.code} value={curr.code}>
                  {curr.code}
                </option>
              ))}
            </select>
          </div>

          {/* Price Type and Unit Selection */}
          {showPricePerUnit && onPriceTypeChange && onUnitChange && (
            <div className="flex space-x-2">
              <select
                value={priceType}
                onChange={(e) => onPriceTypeChange(e.target.value as 'total' | 'per-unit')}
                className="flex-1 h-12 rounded-md border-gray-300 shadow-sm focus:border-[#db4a2b] focus:ring-[#db4a2b] text-base"
              >
                <option value="total">Total Price</option>
                <option value="per-unit">Price per Unit</option>
              </select>
              {priceType === 'per-unit' && (
                <select
                  value={selectedUnit}
                  onChange={(e) => onUnitChange(e.target.value)}
                  className="flex-1 h-12 rounded-md border-gray-300 shadow-sm focus:border-[#db4a2b] focus:ring-[#db4a2b] text-base"
                >
                  {availableUnits.map((unit) => (
                    <option key={unit.value} value={unit.value}>
                      {unit.label}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}