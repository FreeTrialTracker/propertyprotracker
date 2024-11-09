import React, { useEffect, useState } from 'react';
import { currencies } from '../constants/currencies';
import { convertCurrency } from '../utils/currencyConversion';

interface CurrencyConverterProps {
  amount: number;
  fromCurrency: string;
  onCurrencyChange: (currency: string) => void;
}

export function CurrencyConverter({
  amount,
  fromCurrency,
  onCurrencyChange
}: CurrencyConverterProps) {
  const [selectedCurrency, setSelectedCurrency] = useState(fromCurrency);
  const [convertedAmount, setConvertedAmount] = useState(amount);

  useEffect(() => {
    const updateAmount = async () => {
      const converted = await convertCurrency(amount, fromCurrency, selectedCurrency);
      setConvertedAmount(converted);
    };
    updateAmount();
  }, [amount, fromCurrency, selectedCurrency]);

  const handleCurrencyChange = (currency: string) => {
    setSelectedCurrency(currency);
    onCurrencyChange(currency);
  };

  return (
    <div className="flex gap-2">
      <select
        value={selectedCurrency}
        onChange={(e) => handleCurrencyChange(e.target.value)}
        className="w-24 rounded-md border-gray-300 shadow-sm focus:border-[#db4a2b] focus:ring-[#db4a2b]"
      >
        {currencies.map((curr) => (
          <option key={curr.code} value={curr.code}>{curr.code}</option>
        ))}
      </select>
      <input
        type="text"
        value={convertedAmount.toLocaleString('en-US')}
        readOnly
        className="flex-1 h-12 rounded-md border-gray-300 bg-gray-50 shadow-sm"
      />
    </div>
  );
}