import React from 'react';
import { CurrencySelector } from './CurrencySelector';
import { formatCurrency } from '../utils/calculations';

interface ResultBoxProps {
  title: string;
  value: number | string;
  currency?: string;
  info: string;
  type?: 'positive' | 'negative';
  percentage?: number;
  unit?: string;
  showCurrencyConverter?: boolean;
  onCurrencyChange?: (currency: string) => void;
}

export function ResultBox({
  title,
  value,
  currency,
  info,
  type,
  percentage,
  unit,
  showCurrencyConverter = false,
  onCurrencyChange
}: ResultBoxProps) {
  const getDisplayValue = () => {
    // If value is a string, return as is
    if (typeof value === 'string') {
      return value;
    }

    // If currency is provided, format with currency
    if (currency) {
      const formattedValue = formatCurrency(value, currency);
      if (percentage !== undefined) {
        return `${formattedValue} (${Math.abs(percentage).toFixed(1)}%)`;
      }
      return formattedValue;
    }

    // If unit is provided, format with unit
    if (unit) {
      return `${value.toLocaleString('en-US', { maximumFractionDigits: 2 })} ${unit}`;
    }

    // Default number formatting
    return value.toLocaleString('en-US', { maximumFractionDigits: 2 });
  };

  return (
    <div
      className={`p-4 rounded-lg border ${
        type === 'positive'
          ? 'border-green-200 bg-green-50'
          : type === 'negative'
          ? 'border-red-200 bg-red-50'
          : 'border-gray-200 bg-white'
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        {showCurrencyConverter && onCurrencyChange && (
          <CurrencySelector
            value={currency || 'USD'}
            onChange={onCurrencyChange}
            className="ml-2 text-xs"
          />
        )}
      </div>
      <p className="mt-2 text-2xl font-semibold">{getDisplayValue()}</p>
      <p className="mt-1 text-sm text-gray-500">{info}</p>
    </div>
  );
}