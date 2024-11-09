import React from 'react';
import { currencies } from '../constants/currencies';
import { convertCurrency } from '../utils/currencyConversion';

interface PriceDisplayProps {
  amount: number;
  fromCurrency: string;
  toCurrency: string;
  onCurrencyChange: (currency: string) => void;
  className?: string;
  showPerUnit?: boolean;
  unitType?: string;
}

export function PriceDisplay({
  amount,
  fromCurrency,
  toCurrency,
  onCurrencyChange,
  className = '',
  showPerUnit = false,
  unitType
}: PriceDisplayProps) {
  const [convertedAmount, setConvertedAmount] = React.useState(amount);

  React.useEffect(() => {
    const updateConvertedAmount = async () => {
      const converted = await convertCurrency(amount, fromCurrency, toCurrency);
      setConvertedAmount(converted);
    };
    updateConvertedAmount();
  }, [amount, fromCurrency, toCurrency]);

  return (
    <div className={`flex gap-2 ${className}`}>
      <select
        value={toCurrency}
        onChange={(e) => onCurrencyChange(e.target.value)}
        className="w-24 rounded-md border-gray-300 shadow-sm focus:border-[#db4a2b] focus:ring-[#db4a2b]"
      >
        {currencies.map((curr) => (
          <option key={curr.code} value={curr.code}>{curr.code}</option>
        ))}
      </select>
      <input
        type="text"
        value={showPerUnit ? 
          `${convertedAmount.toLocaleString('en-US')}/${unitType}` :
          convertedAmount.toLocaleString('en-US')
        }
        readOnly
        className="flex-1 h-12 rounded-md border-gray-300 bg-gray-50 shadow-sm"
      />
    </div>
  );
}