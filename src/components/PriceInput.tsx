import React, { useState, useEffect } from 'react';
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
  const [displayValue, setDisplayValue] = useState('');

  // Format number with thousand separators
  const formatWithThousands = (num: number): string => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
      useGrouping: true
    }).format(num);
  };

  // Parse string with thousand separators to number
  const parseFormattedNumber = (str: string): number => {
    // Remove all commas and spaces
    const cleanStr = str.replace(/[,\s]/g, '');
    // Parse as float, return 0 if invalid
    return parseFloat(cleanStr) || 0;
  };

  useEffect(() => {
    // Update display value when the numeric value changes
    setDisplayValue(value ? formatWithThousands(value) : '');
  }, [value]);

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    
    // Allow empty input
    if (!rawValue) {
      setDisplayValue('');
      onChange(0);
      return;
    }

    // Remove any non-numeric characters except decimal point
    const sanitizedValue = rawValue.replace(/[^\d.]/g, '');
    
    // Ensure only one decimal point
    const parts = sanitizedValue.split('.');
    const cleanValue = parts[0] + (parts.length > 1 ? '.' + parts[1] : '');
    
    // Parse the clean value to number
    const numericValue = parseFloat(cleanValue) || 0;
    
    // Format for display
    const formattedValue = formatWithThousands(numericValue);
    setDisplayValue(formattedValue);
    
    // Notify parent with numeric value
    onChange(numericValue);
  };

  const handleBlur = () => {
    // Ensure consistent formatting on blur
    if (displayValue) {
      const numValue = parseFormattedNumber(displayValue);
      setDisplayValue(formatWithThousands(numValue));
    }
  };

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
              type="text"
              value={displayValue}
              onChange={handleValueChange}
              onBlur={handleBlur}
              className="block flex-1 h-12 rounded-md border-gray-300 shadow-sm focus:ring-[#db4a2b] focus:border-[#db4a2b] text-base"
              placeholder="Enter amount"
            />
            <select
              value={currency}
              onChange={(e) => onCurrencyChange(e.target.value)}
              className="w-24 h-12 rounded-md border-gray-300 shadow-sm focus:ring-[#db4a2b] focus:border-[#db4a2b] text-base"
            >
              {currencies.map((curr) => (
                <option key={curr.code} value={curr.code}>
                  {curr.code}
                </option>
              ))}
            </select>
          </div>

          {/* Price Type and Unit Selection */}
          {showPricePerUnit && onPriceTypeChange && onUnitChange && Array.isArray(availableUnits) && (
            <div className="flex space-x-2">
              <select
                value={priceType}
                onChange={(e) => onPriceTypeChange(e.target.value as 'total' | 'per-unit')}
                className="flex-1 h-12 rounded-md border-gray-300 shadow-sm focus:ring-[#db4a2b] focus:border-[#db4a2b] text-base"
              >
                <option value="total">Total Price</option>
                <option value="per-unit">Price per Unit</option>
              </select>
              {priceType === 'per-unit' && (
                <select
                  value={selectedUnit}
                  onChange={(e) => onUnitChange(e.target.value)}
                  className="flex-1 h-12 rounded-md border-gray-300 shadow-sm focus:ring-[#db4a2b] focus:border-[#db4a2b] text-base"
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