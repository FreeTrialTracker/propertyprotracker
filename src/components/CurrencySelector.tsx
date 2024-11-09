import React from 'react';
import { currencies } from '../constants/currencies';

interface CurrencySelectorProps {
  value: string;
  onChange: (currency: string) => void;
  className?: string;
}

export function CurrencySelector({ value, onChange, className = '' }: CurrencySelectorProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-24 rounded-md border-gray-300 shadow-sm focus:border-[#db4a2b] focus:ring-[#db4a2b] ${className}`}
    >
      {currencies.map((curr) => (
        <option key={curr.code} value={curr.code}>{curr.code}</option>
      ))}
    </select>
  );
}