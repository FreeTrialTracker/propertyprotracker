import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { calculateMonthlyPayment, calculateTotalInterest, formatCurrency } from '../utils/calculations';
import { generateMortgagePDF } from '../utils/generateMortgagePDF';
import { ResultBox } from './ResultBox';
import { SaveCalculation } from './SaveCalculation';
import { useAuthStore } from '../store/authStore';
import { useCalculationsStore } from '../store/calculationsStore';
import type { PropertyType } from '../types';

interface MortgageResultsProps {
  purchasePrice: number;
  downPayment: number;
  interestRate: number;
  loanTermYears: number;
  isCompoundInterest: boolean;
  currency: string;
  propertyType: PropertyType;
  propertyNumber: number;
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

export function MortgageResults({
  purchasePrice,
  downPayment,
  interestRate,
  loanTermYears,
  isCompoundInterest,
  currency,
  propertyType,
  propertyNumber,
  landArea,
  buildingArea
}: MortgageResultsProps) {
  const [showResults, setShowResults] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(currency);
  const { user } = useAuthStore();
  const { saveCalculation } = useCalculationsStore();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const principalLoanAmount = purchasePrice - downPayment;
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

  const handleSaveCalculation = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    try {
      await saveCalculation(user.uid, {
        propertyType,
        transactionType: 'mortgage',
        propertyNumber,
        purchasePrice,
        downPayment,
        principalLoanAmount,
        interestRate,
        loanTermYears,
        isCompoundInterest,
        monthlyPayment,
        totalInterest,
        totalAmountPaid,
        currency: selectedCurrency,
        landArea,
        buildingArea,
        results: [
          {
            title: 'Purchase Price',
            value: purchasePrice,
            currency: selectedCurrency,
            info: 'Total property purchase price'
          },
          {
            title: 'Down Payment',
            value: downPayment,
            currency: selectedCurrency,
            info: 'Initial payment amount'
          },
          {
            title: 'Principal Loan Amount',
            value: principalLoanAmount,
            currency: selectedCurrency,
            info: 'Purchase price minus down payment'
          },
          {
            title: 'Monthly Payment',
            value: monthlyPayment,
            currency: selectedCurrency,
            info: `Based on ${isCompoundInterest ? 'compound' : 'simple'} interest`
          },
          {
            title: 'Total Interest',
            value: totalInterest,
            currency: selectedCurrency,
            info: 'Total interest over loan term',
            type: 'negative'
          },
          {
            title: 'Total Amount Paid',
            value: totalAmountPaid,
            currency: selectedCurrency,
            info: 'Principal plus total interest',
            type: 'negative'
          }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error saving calculation:', error);
    }
  };

  const handleDownload = () => {
    generateMortgagePDF({
      propertyType,
      propertyNumber,
      purchasePrice,
      downPayment,
      principalLoanAmount,
      interestRate,
      loanTermYears,
      isCompoundInterest,
      monthlyPayment,
      totalInterest,
      totalAmountPaid,
      currency: selectedCurrency,
      landArea,
      buildingArea
    });
  };

  return (
    <div className="mt-8">
      <button
        onClick={() => setShowResults(true)}
        className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors"
      >
        Generate Results - Mortgage
      </button>

      {showResults && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">
              Property {propertyNumber} - Mortgage Results
            </h3>
            <div className="flex gap-4">
              <SaveCalculation
                onSave={handleSaveCalculation}
                onAuthRequired={() => setShowAuthModal(true)}
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
              value={purchasePrice}
              currency={selectedCurrency}
              info="Total property purchase price"
              showCurrencyConverter
              onCurrencyChange={setSelectedCurrency}
            />
            <ResultBox
              title="Down Payment"
              value={downPayment}
              currency={selectedCurrency}
              info="Initial payment amount"
            />
            <ResultBox
              title="Principal Loan Amount"
              value={principalLoanAmount}
              currency={selectedCurrency}
              info="Purchase price minus down payment"
            />
            <ResultBox
              title="Monthly Payment"
              value={monthlyPayment}
              currency={selectedCurrency}
              info={`Based on ${isCompoundInterest ? 'compound' : 'simple'} interest`}
            />
            <ResultBox
              title="Total Interest"
              value={totalInterest}
              currency={selectedCurrency}
              info="Total interest over loan term"
              type="negative"
            />
            <ResultBox
              title="Total Amount Paid"
              value={totalAmountPaid}
              currency={selectedCurrency}
              info="Principal plus total interest"
              type="negative"
            />
          </div>
        </div>
      )}
    </div>
  );
}