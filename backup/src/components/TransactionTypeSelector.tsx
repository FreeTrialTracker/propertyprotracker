import React from 'react';
import { ShoppingCart, DollarSign, Key, Building2 } from 'lucide-react';
import type { TransactionType } from '../types';

interface TransactionTypeSelectorProps {
  value: TransactionType;
  onChange: (type: TransactionType) => void;
}

export function TransactionTypeSelector({ value, onChange }: TransactionTypeSelectorProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4">
      <button
        onClick={() => onChange('buy')}
        className={`flex flex-col items-center p-6 rounded-lg border-2 transition-all ${
          value === 'buy'
            ? 'border-[#db4a2b] bg-[#db4a2b]/10'
            : 'border-gray-200 hover:border-[#db4a2b] hover:bg-[#db4a2b]/5'
        }`}
      >
        <ShoppingCart className={`h-8 w-8 mb-2 ${value === 'buy' ? 'text-[#db4a2b]' : 'text-gray-600'}`} />
        <span className={`font-medium ${value === 'buy' ? 'text-[#db4a2b]' : 'text-gray-700'}`}>Buy</span>
      </button>

      <button
        onClick={() => onChange('sell')}
        className={`flex flex-col items-center p-6 rounded-lg border-2 transition-all ${
          value === 'sell'
            ? 'border-[#db4a2b] bg-[#db4a2b]/10'
            : 'border-gray-200 hover:border-[#db4a2b] hover:bg-[#db4a2b]/5'
        }`}
      >
        <DollarSign className={`h-8 w-8 mb-2 ${value === 'sell' ? 'text-[#db4a2b]' : 'text-gray-600'}`} />
        <span className={`font-medium ${value === 'sell' ? 'text-[#db4a2b]' : 'text-gray-700'}`}>Sell</span>
      </button>

      <button
        onClick={() => onChange('lease')}
        className={`flex flex-col items-center p-6 rounded-lg border-2 transition-all ${
          value === 'lease'
            ? 'border-[#db4a2b] bg-[#db4a2b]/10'
            : 'border-gray-200 hover:border-[#db4a2b] hover:bg-[#db4a2b]/5'
        }`}
      >
        <Key className={`h-8 w-8 mb-2 ${value === 'lease' ? 'text-[#db4a2b]' : 'text-gray-600'}`} />
        <span className={`font-medium ${value === 'lease' ? 'text-[#db4a2b]' : 'text-gray-700'}`}>Lease</span>
      </button>

      <button
        onClick={() => onChange('mortgage')}
        className={`flex flex-col items-center p-6 rounded-lg border-2 transition-all ${
          value === 'mortgage'
            ? 'border-[#db4a2b] bg-[#db4a2b]/10'
            : 'border-gray-200 hover:border-[#db4a2b] hover:bg-[#db4a2b]/5'
        }`}
      >
        <Building2 className={`h-8 w-8 mb-2 ${value === 'mortgage' ? 'text-[#db4a2b]' : 'text-gray-600'}`} />
        <span className={`font-medium ${value === 'mortgage' ? 'text-[#db4a2b]' : 'text-gray-700'}`}>
          Mortgage
        </span>
      </button>
    </div>
  );
}