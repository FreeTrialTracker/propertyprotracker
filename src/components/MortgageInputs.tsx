import React, { useState, useEffect } from 'react';
import { Info } from 'lucide-react';
import { PriceInput } from './PriceInput';
import MortgageResultCard from './results/MortgageResultCard';
import { calculateMonthlyPayment, calculateTotalInterest } from '../utils/calculations';
import type { PropertyType } from '../types';
import { useCalculatorStore } from '../store/calculatorStore';

interface MortgageInputsProps {
  purchasePrice: number;
  propertyType: PropertyType;
  propertyNumber: number;
  initialCurrency: string;
  reportName: string;
  location: string;
  notes: string;
  landArea?: {
    column1: { value: number; unit: string };
    column2: { value: number; unit: string };
    column3: { value: number; unit: string };
  };
  buildingArea?: {
    column1: { value: number; unit: string };
    column2: { value: number; unit: string };
    column3: { value: number; unit: string };
  };
}

export function MortgageInputs({
  purchasePrice,
  propertyType,
  propertyNumber,
  initialCurrency,
  reportName,
  location,
  notes,
  landArea,
  buildingArea
}: MortgageInputsProps) {
  const [showResults, setShowResults] = useState(false);
  const property = useCalculatorStore(state => state.properties[propertyNumber - 1]);
  const updateProperty = useCalculatorStore(state => state.updateProperty);

  const [downPayment, setDownPayment] = useState({
    value: 0,
    currency: initialCurrency // Initialize with the purchase price currency
  });
  const [interestRate, setInterestRate] = useState(0);
  const [loanTermYears, setLoanTermYears] = useState(30);
  const [isCompoundInterest, setIsCompoundInterest] = useState(true);

  // Update down payment currency when purchase price currency changes
  useEffect(() => {
    setDownPayment(prev => ({
      ...prev,
      currency: initialCurrency
    }));
  }, [initialCurrency]);

  useEffect(() => {
    // Update store when mortgage inputs change
    updateProperty(propertyNumber - 1, {
      mortgage: {
        downPayment,
        interestRate,
        loanTermYears,
        isCompoundInterest
      }
    });
  }, [downPayment, interestRate, loanTermYears, isCompoundInterest, propertyNumber, updateProperty]);

  const principalLoanAmount = purchasePrice - downPayment.value;
  const monthlyPayment = calculateMonthlyPayment(
    principalLoanAmount,
    interestRate,
    loanTermYears,
    isCompoundInterest
  );
  const totalInterest = calculateTotalInterest(
    principalLoanAmount,
    monthlyPayment,
    loanTermYears
  );
  const totalAmountPaid = principalLoanAmount + totalInterest;

  const handleClearData = () => {
    setDownPayment({ value: 0, currency: initialCurrency });
    setInterestRate(0);
    setLoanTermYears(30);
    setIsCompoundInterest(true);
    setShowResults(false);
  };

  return (
    <div className="space-y-6 border-t border-gray-200 pt-6 mt-6">
      <h2 className="text-xl font-semibold text-gray-900">Enter Mortgage Details - Property {propertyNumber}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Down Payment Input */}
        <div>
          <PriceInput
            label="Down Payment"
            value={downPayment.value}
            currency={downPayment.currency}
            onChange={(value) => setDownPayment({ ...downPayment, value })}
            onCurrencyChange={(currency) => setDownPayment({ ...downPayment, currency })}
            showPricePerUnit={false}
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
            value={interestRate || ''}
            onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
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
            value={loanTermYears || ''}
            onChange={(e) => setLoanTermYears(parseInt(e.target.value) || 0)}
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
                checked={isCompoundInterest}
                onChange={() => setIsCompoundInterest(true)}
                className="form-radio h-4 w-4 text-[#db4a2b] focus:ring-[#db4a2b]"
              />
              <span className="ml-2 text-sm text-gray-700">Compound Interest</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                checked={!isCompoundInterest}
                onChange={() => setIsCompoundInterest(false)}
                className="form-radio h-4 w-4 text-[#db4a2b] focus:ring-[#db4a2b]"
              />
              <span className="ml-2 text-sm text-gray-700">Simple Interest</span>
            </label>
          </div>
        </div>
      </div>

      <button
        onClick={() => setShowResults(true)}
        className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors"
      >
        Generate Results - Mortgage
      </button>

      {showResults && (
        <MortgageResultCard
          propertyType={propertyType}
          propertyNumber={propertyNumber}
          initialCurrency={initialCurrency}
          purchasePrice={purchasePrice}
          downPayment={downPayment.value}
          principalLoanAmount={principalLoanAmount}
          interestRate={interestRate}
          loanTermYears={loanTermYears}
          isCompoundInterest={isCompoundInterest}
          monthlyPayment={monthlyPayment}
          totalInterest={totalInterest}
          totalAmountPaid={totalAmountPaid}
          reportName={reportName}
          location={location}
          notes={notes}
          landArea={landArea}
          buildingArea={buildingArea}
          onAuthRequired={() => {}}
          onClearData={handleClearData}
        />
      )}
    </div>
  );
}