import React from 'react';
import { currencies } from '../constants/currencies';
import { areaUnits } from '../constants/units';
import { NumberInputWithSeparator } from './NumberInputWithSeparator';

interface PriceCalculatorProps {
  price: string;
  currency: string;
  priceType: 'total' | 'per_unit';
  selectedUnit: string;
  totalAreaSqm: number;
  onPriceChange: (value: string) => void;
  onCurrencyChange: (currency: string) => void;
  onPriceTypeChange: (type: 'total' | 'per_unit') => void;
  onUnitChange: (unit: string) => void;
}

export function PriceCalculator({
  price,
  currency,
  priceType,
  selectedUnit,
  totalAreaSqm,
  onPriceChange,
  onCurrencyChange,
  onPriceTypeChange,
  onUnitChange
}: PriceCalculatorProps) {
  const calculateTotalPrice = () => {
    if (!price) return '';
    const numericPrice = parseFloat(price.replace(/,/g, '')) || 0;
    
    if (priceType === 'total') {
      return numericPrice;
    } else {
      // Convert price per unit to price per sqm
      const unitConversion = areaUnits.land.find(u => u.id === selectedUnit)?.conversionToSqM || 1;
      const pricePerSqm = numericPrice / unitConversion;
      return pricePerSqm * totalAreaSqm;
    }
  };

  return (
    <div className="flex gap-2">
      <NumberInputWithSeparator
        value={price}
        onChange={onPriceChange}
        className="flex-1"
      />
      <select
        value={currency}
        onChange={(e) => onCurrencyChange(e.target.value)}
        className="w-24 rounded-md border-gray-300 shadow-sm focus:border-[#db4a2b] focus:ring-[#db4a2b]"
      >
        {currencies.map((curr) => (
          <option key={curr.code} value={curr.code}>{curr.code}</option>
        ))}
      </select>
      <select
        value={priceType}
        onChange={(e) => onPriceTypeChange(e.target.value as 'total' | 'per_unit')}
        className="w-40 rounded-md border-gray-300 shadow-sm focus:border-[#db4a2b] focus:ring-[#db4a2b]"
      >
        <option value="total">Total Price</option>
        <option value="per_unit">Price per Unit</option>
      </select>
      {priceType === 'per_unit' && (
        <select
          value={selectedUnit}
          onChange={(e) => onUnitChange(e.target.value)}
          className="w-24 rounded-md border-gray-300 shadow-sm focus:border-[#db4a2b] focus:ring-[#db4a2b]"
        >
          {areaUnits.land.map((unit) => (
            <option key={unit.id} value={unit.id}>{unit.shortName}</option>
          ))}
        </select>
      )}
    </div>
  );
}