import React, { useState } from 'react';
import { Info } from 'lucide-react';
import { PriceInput } from './PriceInput';
import { MortgageResults } from './MortgageResults';

interface MortgageInputsProps {
  purchasePrice: number;
  downPayment: {
    value: number;
    currency: string;
  };
  interestRate: number;
  loanTermYears: number;
  isCompoundInterest: boolean;
  onDownPaymentChange: (value: number) => void;
  onDownPaymentCurrencyChange: (currency: string) => void;
  onInterestRateChange: (rate: number) => void;
  onLoanTermChange: (years: number) => void;
  onInterestTypeChange: (isCompound: boolean) => void;
}

export function MortgageInputs({
  purchasePrice,
  downPayment,
  interestRate,
  loanTermYears,
  isCompoundInterest,
  onDownPaymentChange,
  onDownPaymentCurrencyChange,
  onInterestRateChange,
  onLoanTermChange,
  onInterestTypeChange
}: MortgageInputsProps) {
  const [localDownPayment, setLocalDownPayment] = useState(downPayment.value);
  const [localInterestRate, setLocalInterestRate] = useState(interestRate);
  const [localLoanTerm, setLocalLoanTerm] = useState(loanTermYears);
  const [localIsCompound, setLocalIsCompound] = useState(isCompoundInterest);

  const handleDownPaymentChange = (value: number) => {
    setLocalDownPayment(value);
    onDownPaymentChange(value);
  };

  const handleInterestRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setLocalInterestRate(value);
    onInterestRateChange(value);
  };

  const handleLoanTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setLocalLoanTerm(value);
    onLoanTermChange(value);
  };

  const handleInterestTypeChange = (isCompound: boolean) => {
    setLocalIsCompound(isCompound);
    onInterestTypeChange(isCompound);
  };

  return (
    <div className="space-y-6 border-t border-gray-200 pt-6 mt-6">
      <h2 className="text-xl font-semibold text-gray-900">Enter Mortgage Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Down Payment Input */}
        <div>
          <PriceInput
            label="Down Payment"
            value={localDownPayment}
            currency={downPayment.currency}
            onChange={handleDownPaymentChange}
            onCurrencyChange={onDownPaymentCurrencyChange}
          />
        </div>

        {/* Interest Rate Input */}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-700">
            Interest Rate (% per annum)
            <button
              type="button"
              className="ml-1 text-gray-400 hover:text-gray-500"
              title="Annual interest rate percentage"
            >
              <Info className="h-4 w-4" />
            </button>
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={localInterestRate || ''}
            onChange={handleInterestRateChange}
            className="block w-full h-12 rounded-md border-gray-300 shadow-sm focus:border-[#db4a2b] focus:ring-[#db4a2b] text-base"
            placeholder="0.00"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Loan Term Input */}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-700">
            Loan Term (Years)
            <button
              type="button"
              className="ml-1 text-gray-400 hover:text-gray-500"
              title="Duration of the mortgage in years"
            >
              <Info className="h-4 w-4" />
            </button>
          </label>
          <input
            type="number"
            min="1"
            max="50"
            value={localLoanTerm || ''}
            onChange={handleLoanTermChange}
            className="block w-full h-12 rounded-md border-gray-300 shadow-sm focus:border-[#db4a2b] focus:ring-[#db4a2b] text-base"
            placeholder="30"
          />
        </div>

        {/* Interest Type Selection */}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-700">
            Interest Type
            <button
              type="button"
              className="ml-1 text-gray-400 hover:text-gray-500"
              title="Choose between compound or simple interest calculation"
            >
              <Info className="h-4 w-4" />
            </button>
          </label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                checked={localIsCompound}
                onChange={() => handleInterestTypeChange(true)}
                className="form-radio h-4 w-4 text-[#db4a2b] focus:ring-[#db4a2b]"
              />
              <span className="ml-2 text-sm text-gray-700">Compound Interest</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                checked={!localIsCompound}
                onChange={() => handleInterestTypeChange(false)}
                className="form-radio h-4 w-4 text-[#db4a2b] focus:ring-[#db4a2b]"
              />
              <span className="ml-2 text-sm text-gray-700">Simple Interest</span>
            </label>
          </div>
        </div>
      </div>

      <MortgageResults
        purchasePrice={purchasePrice}
        downPayment={localDownPayment}
        interestRate={localInterestRate}
        loanTermYears={localLoanTerm}
        isCompoundInterest={localIsCompound}
        currency={downPayment.currency}
      />
    </div>
  );
}