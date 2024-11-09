import React from 'react';
import { Share2, Download } from 'lucide-react';
import { calculateMonthlyPayment, calculateTotalInterest, formatCurrency } from '../utils/calculations';
import { generatePDF } from '../utils/pdfGenerator';
import type { PropertyType } from '../types';

interface MortgageResultsProps {
  purchasePrice: number;
  downPayment: number;
  interestRate: number;
  loanTermYears: number;
  isCompoundInterest: boolean;
  currency: string;
  propertyType: PropertyType;
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
  propertyType = 'land',
  landArea,
  buildingArea
}: MortgageResultsProps) {
  const [showShareMenu, setShowShareMenu] = React.useState(false);

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

  const results = [
    {
      title: 'Principal Loan Amount',
      value: formatCurrency(principalLoanAmount, currency),
      info: 'Purchase price minus down payment'
    },
    {
      title: 'Monthly Payment',
      value: formatCurrency(monthlyPayment, currency),
      info: `Based on ${isCompoundInterest ? 'compound' : 'simple'} interest`
    },
    {
      title: 'Total Amount Paid',
      value: formatCurrency(totalAmountPaid, currency),
      info: 'Principal plus total interest'
    },
    {
      title: 'Total Interest Paid',
      value: formatCurrency(totalInterest, currency),
      info: 'Total interest over loan term'
    }
  ];

  const handleShare = () => {
    setShowShareMenu(!showShareMenu);
  };

  const handleDownload = () => {
    generatePDF({
      propertyType,
      transactionType: 'mortgage',
      landArea,
      buildingArea,
      price: {
        value: purchasePrice,
        currency,
        priceType: 'total',
        selectedUnit: 'sqm'
      },
      mortgageConfig: {
        downPayment: {
          value: downPayment,
          currency
        },
        interestRate,
        loanTermYears,
        isCompoundInterest,
        monthlyPayment,
        totalInterest,
        totalAmount: totalAmountPaid,
        principalAmount: principalLoanAmount
      }
    });
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Generate Results - Mortgage</h3>
      <div className="grid gap-4 md:grid-cols-2">
        {results.map((result, index) => (
          <div
            key={index}
            className="p-4 rounded-lg border border-gray-200 bg-white"
          >
            <h4 className="text-sm font-medium text-gray-500">{result.title}</h4>
            <p className="mt-2 text-2xl font-semibold">{result.value}</p>
            <p className="mt-1 text-sm text-gray-500">{result.info}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex gap-4">
        <div className="relative">
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
          {showShareMenu && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border">
              <a
                href="#"
                className="block px-4 py-2 hover:bg-gray-50"
                onClick={(e) => e.preventDefault()}
              >
                Facebook
              </a>
              <a
                href="#"
                className="block px-4 py-2 hover:bg-gray-50"
                onClick={(e) => e.preventDefault()}
              >
                LinkedIn
              </a>
              <a
                href="#"
                className="block px-4 py-2 hover:bg-gray-50"
                onClick={(e) => e.preventDefault()}
              >
                X (Twitter)
              </a>
            </div>
          )}
        </div>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
        >
          <Download className="w-4 h-4" />
          Download PDF
        </button>
      </div>
    </div>
  );
}