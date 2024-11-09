import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import { ResultBox } from '../ResultBox';
import { SaveCalculation } from '../SaveCalculation';
import { convertCurrency } from '../../utils/currencyConversion';
import type { PropertyType } from '../../types';

interface MortgageResultsNewProps {
  propertyType: PropertyType;
  propertyNumber: number;
  initialCurrency: string;
  purchasePrice: number;
  downPayment: number;
  principalLoanAmount: number;
  interestRate: number;
  loanTermYears: number;
  isCompoundInterest: boolean;
  monthlyPayment: number;
  totalInterest: number;
  totalAmountPaid: number;
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
  onAuthRequired: () => void;
}

export default function MortgageResultsNew({
  propertyType,
  propertyNumber,
  initialCurrency,
  purchasePrice,
  downPayment,
  principalLoanAmount,
  interestRate,
  loanTermYears,
  isCompoundInterest,
  monthlyPayment,
  totalInterest,
  totalAmountPaid,
  landArea,
  buildingArea,
  onAuthRequired
}: MortgageResultsNewProps) {
  const [selectedCurrency, setSelectedCurrency] = useState(initialCurrency);
  const [convertedValues, setConvertedValues] = useState({
    purchasePrice,
    downPayment,
    principalLoanAmount,
    monthlyPayment,
    totalInterest,
    totalAmountPaid
  });

  useEffect(() => {
    const updateConvertedValues = async () => {
      try {
        const [
          newPurchasePrice,
          newDownPayment,
          newPrincipalLoanAmount,
          newMonthlyPayment,
          newTotalInterest,
          newTotalAmountPaid
        ] = await Promise.all([
          convertCurrency(purchasePrice, initialCurrency, selectedCurrency),
          convertCurrency(downPayment, initialCurrency, selectedCurrency),
          convertCurrency(principalLoanAmount, initialCurrency, selectedCurrency),
          convertCurrency(monthlyPayment, initialCurrency, selectedCurrency),
          convertCurrency(totalInterest, initialCurrency, selectedCurrency),
          convertCurrency(totalAmountPaid, initialCurrency, selectedCurrency)
        ]);

        setConvertedValues({
          purchasePrice: newPurchasePrice,
          downPayment: newDownPayment,
          principalLoanAmount: newPrincipalLoanAmount,
          monthlyPayment: newMonthlyPayment,
          totalInterest: newTotalInterest,
          totalAmountPaid: newTotalAmountPaid
        });
      } catch (error) {
        console.error('Error converting currencies:', error);
      }
    };

    updateConvertedValues();
  }, [selectedCurrency, initialCurrency, purchasePrice, downPayment, principalLoanAmount, monthlyPayment, totalInterest, totalAmountPaid]);

  const handleSave = async () => {
    const calculationData = {
      propertyType,
      propertyNumber,
      purchasePrice: convertedValues.purchasePrice,
      downPayment: convertedValues.downPayment,
      principalLoanAmount: convertedValues.principalLoanAmount,
      interestRate,
      loanTermYears,
      isCompoundInterest,
      monthlyPayment: convertedValues.monthlyPayment,
      totalInterest: convertedValues.totalInterest,
      totalAmountPaid: convertedValues.totalAmountPaid,
      currency: selectedCurrency,
      landArea,
      buildingArea
    };

    try {
      // Save calculation logic here
      console.log('Saving calculation:', calculationData);
    } catch (error) {
      console.error('Error saving calculation:', error);
    }
  };

  const handleDownload = () => {
    // PDF generation logic here
    console.log('Downloading PDF...');
  };

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">
          Property {propertyNumber} - Mortgage Results
        </h3>
        <div className="flex gap-4">
          <SaveCalculation
            onSave={handleSave}
            onAuthRequired={onAuthRequired}
          />
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 text-[#db4a2b] border border-[#db4a2b] rounded-lg hover:bg-[#db4a2b] hover:text-white transition-colors"
          >
            <Download className="h-4 w-4" />
            Download PDF
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <ResultBox
          title="Purchase Price"
          value={convertedValues.purchasePrice}
          currency={selectedCurrency}
          info="Total property purchase price"
          showCurrencyConverter
          onCurrencyChange={setSelectedCurrency}
        />
        <ResultBox
          title="Down Payment"
          value={convertedValues.downPayment}
          currency={selectedCurrency}
          info="Initial payment amount"
        />
        <ResultBox
          title="Principal Loan Amount"
          value={convertedValues.principalLoanAmount}
          currency={selectedCurrency}
          info="Purchase price minus down payment"
        />
        <ResultBox
          title="Monthly Payment"
          value={convertedValues.monthlyPayment}
          currency={selectedCurrency}
          info={`Based on ${isCompoundInterest ? 'compound' : 'simple'} interest at ${interestRate}% per annum`}
        />
        <ResultBox
          title="Total Interest"
          value={convertedValues.totalInterest}
          currency={selectedCurrency}
          info={`Total interest over ${loanTermYears} years`}
          type="negative"
        />
        <ResultBox
          title="Total Amount Paid"
          value={convertedValues.totalAmountPaid}
          currency={selectedCurrency}
          info="Principal plus total interest"
          type="negative"
        />
      </div>
    </div>
  );
}