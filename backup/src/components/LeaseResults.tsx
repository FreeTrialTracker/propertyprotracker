import React, { useState } from 'react';
import { Share2, Download } from 'lucide-react';
import { formatCurrency } from '../utils/calculations';
import { generatePDF } from '../utils/pdfGenerator';
import type { PropertyType } from '../types';

interface LeaseResultsProps {
  totalLeaseCost: number;
  totalMarketValue: number;
  currency: string;
  propertyType: PropertyType;
  duration: number;
  monthlyPayment: number;
  marketMonthlyPayment: number;
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

export function LeaseResults({
  totalLeaseCost,
  totalMarketValue,
  currency,
  propertyType,
  duration,
  monthlyPayment,
  marketMonthlyPayment,
  landArea,
  buildingArea
}: LeaseResultsProps) {
  const [showResults, setShowResults] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const calculateResults = () => {
    const difference = totalLeaseCost - totalMarketValue;
    const percentageDiff = totalMarketValue > 0 
      ? ((totalLeaseCost - totalMarketValue) / totalMarketValue) * 100 
      : 0;

    return [
      {
        title: 'Total Value',
        value: formatCurrency(totalLeaseCost, currency),
        info: 'Total value based on Total Lease Cost'
      },
      {
        title: 'Market Value',
        value: formatCurrency(totalMarketValue, currency),
        info: 'Total value based on Total Market Value'
      },
      {
        title: 'Valuation Difference',
        value: `${formatCurrency(Math.abs(difference), currency)} (${Math.abs(percentageDiff).toFixed(2)}%)`,
        info: `${difference > 0 ? 'Above' : 'Below'} market value`,
        type: difference > 0 ? 'negative' : 'positive'
      }
    ];
  };

  const handleGenerateResults = () => {
    setShowResults(true);
  };

  const handleShare = () => {
    setShowShareMenu(!showShareMenu);
  };

  const handleDownload = () => {
    generatePDF({
      propertyType,
      transactionType: 'lease',
      landArea,
      buildingArea,
      price: {
        value: monthlyPayment,
        currency,
        priceType: 'total',
        selectedUnit: 'sqm'
      },
      leaseConfig: {
        duration,
        totalCost: totalLeaseCost,
        marketTotalCost: totalMarketValue,
        monthlyPayment,
        marketMonthlyPayment
      }
    });
  };

  const results = calculateResults();

  return (
    <div className="mt-8">
      <button
        onClick={handleGenerateResults}
        className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors"
      >
        Generate Results - Lease
      </button>

      {showResults && (
        <div className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {results.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  result.type === 'positive'
                    ? 'border-green-200 bg-green-50'
                    : result.type === 'negative'
                    ? 'border-red-200 bg-red-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <h3 className="text-sm font-medium text-gray-500">{result.title}</h3>
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
      )}
    </div>
  );
}