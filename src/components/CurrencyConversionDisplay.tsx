import React, { useState, useEffect } from 'react';
import { currencies } from '../constants/currencies';
import { convertCurrency } from '../utils/currencyConversion';

interface CurrencyConversionDisplayProps {
  amount: number;
  baseCurrency: string;
  onCurrencyChange: (currency: string) => void;
  totalAreaSqm: number;
  className?: string;
}

export function CurrencyConversionDisplay({ 
  amount, 
  baseCurrency, 
  onCurrencyChange,
  totalAreaSqm,
  className = ''
}: CurrencyConversionDisplayProps) {
  const [convertedAmount, setConvertedAmount] = useState(amount);
  const [selectedCurrency, setSelectedCurrency] = useState(baseCurrency);
  const [pricePerSqm, setPricePerSqm] = useState(0);

  useEffect(() => {
    const updateConversion = async () => {
      const converted = await convertCurrency(amount, baseCurrency, selectedCurrency);
      setConvertedAmount(converted);
      setPricePerSqm(totalAreaSqm > 0 ? converted / totalAreaSqm : 0);
    };
    updateConversion();
  }, [amount, baseCurrency, selectedCurrency, totalAreaSqm]);

  const handleCurrencyChange = (currency: string) => {
    setSelectedCurrency(currency);
    onCurrencyChange(currency);
  };

  return (
    <div className="space-y-2">
      <div className={`flex gap-2 ${className}`}>
        <input
          type="text"
          value={`${convertedAmount.toLocaleString('en-US')} (${selectedCurrency})`}
          readOnly
          className="flex-1 h-12 rounded-md border-gray-300 bg-gray-50 shadow-sm px-3"
        />
        <select
          value={selectedCurrency}
          onChange={(e) => handleCurrencyChange(e.target.value)}
          className="w-24 rounded-md border-gray-300 shadow-sm focus:border-[#db4a2b] focus:ring-[#db4a2b]"
        >
          {currencies.map((curr) => (
            <option key={curr.code} value={curr.code}>{curr.code}</option>
          ))}
        </select>
      </div>
      <p className="text-sm text-gray-500">
        Price per sqm: {selectedCurrency} {pricePerSqm.toLocaleString('en-US')}
      </p>
    </div>
  );
}