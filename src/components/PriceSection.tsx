import React from 'react';
import { PriceInput } from './PriceInput';
import { formatCurrency } from '../utils/calculations';

interface PriceSectionProps {
  label: string;
  totalArea: number;
  price: {
    value: number;
    currency: string;
    priceType: 'total' | 'per-unit';
    selectedUnit: string;
  };
  pricePerSqm: number;
  areaLabel: string;
  priceLabel: string;
  availableUnits: Array<{ value: string; label: string }>;
  onChange: (value: number) => void;
  onCurrencyChange: (currency: string) => void;
  onPriceTypeChange: (type: 'total' | 'per-unit') => void;
  onUnitChange: (unit: string) => void;
}

export function PriceSection({
  label,
  totalArea,
  price,
  pricePerSqm,
  areaLabel,
  priceLabel,
  availableUnits,
  onChange,
  onCurrencyChange,
  onPriceTypeChange,
  onUnitChange
}: PriceSectionProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-medium text-gray-900 mb-4">{label}</h3>
      <div className="space-y-4">
        <PriceInput
          label="Purchase Price"
          value={price.value}
          currency={price.currency}
          priceType={price.priceType}
          selectedUnit={price.selectedUnit}
          availableUnits={availableUnits}
          onChange={onChange}
          onCurrencyChange={onCurrencyChange}
          onPriceTypeChange={onPriceTypeChange}
          onUnitChange={onUnitChange}
        />
        <div className="mt-4 p-3 bg-gray-50 rounded-md space-y-2">
          <p className="text-sm text-gray-600">
            {areaLabel}: {totalArea.toFixed(2)} sqm
          </p>
          <p className="text-sm text-gray-600">
            {priceLabel}: {formatCurrency(pricePerSqm, price.currency)}/sqm
          </p>
          <p className="text-sm font-medium text-gray-900">
            Total Value: {formatCurrency(totalArea * pricePerSqm, price.currency)}
          </p>
        </div>
      </div>
    </div>
  );
}