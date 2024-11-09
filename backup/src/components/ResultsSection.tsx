import React, { useState } from 'react';
import { Share2, Download } from 'lucide-react';
import {
  convertToSquareMeters,
  calculatePricePerSqm,
  formatCurrency,
  type AreaUnit
} from '../utils/calculations';
import { generatePDF } from '../utils/pdfGenerator';

interface ResultsSectionProps {
  data: {
    propertyType: string;
    transactionType: 'buy' | 'sell' | 'lease' | 'mortgage';
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
    price: {
      value: number;
      currency: string;
      priceType: 'total' | 'per-unit';
      selectedUnit: string;
    };
    valuation?: {
      value: number;
      currency: string;
      priceType: 'total' | 'per-unit';
      selectedUnit: string;
    };
    leaseConfig?: {
      duration: number;
      frequency: 'monthly' | 'quarterly' | 'yearly';
      totalCost: number;
      marketTotalCost: number;
    };
  };
}

export function ResultsSection({ data }: ResultsSectionProps) {
  const [showResults, setShowResults] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const calculateResults = () => {
    const results = [];
    
    if (data.transactionType === 'lease' && data.leaseConfig) {
      // For lease transactions
      const { totalCost, marketTotalCost } = data.leaseConfig;
      const difference = totalCost - marketTotalCost;
      const percentageDiff = marketTotalCost > 0 
        ? ((totalCost - marketTotalCost) / marketTotalCost) * 100 
        : 0;

      results.push({
        title: 'Total Value',
        value: formatCurrency(totalCost, data.price.currency),
        info: 'Total value based on Total Lease Cost'
      });

      results.push({
        title: 'Market Value',
        value: formatCurrency(marketTotalCost, data.price.currency),
        info: 'Total value based on Total Market Value'
      });

      results.push({
        title: 'Valuation Difference',
        value: `${formatCurrency(Math.abs(difference), data.price.currency)} (${Math.abs(percentageDiff).toFixed(2)}%)`,
        info: `${difference > 0 ? 'Above' : 'Below'} market value`,
        type: difference > 0 ? 'negative' : 'positive'
      });
    } else {
      // For buy/sell transactions
      const area = data.propertyType === 'building' ? data.buildingArea : data.landArea;
      
      if (area) {
        const totalAreaSqm = convertToSquareMeters(
          { value: area.column1.value, unit: area.column1.unit as AreaUnit['unit'] },
          { value: area.column2.value, unit: area.column2.unit as AreaUnit['unit'] },
          { value: area.column3.value, unit: area.column3.unit as AreaUnit['unit'] }
        );

        const pricePerSqm = data.price.priceType === 'total' 
          ? data.price.value / totalAreaSqm 
          : calculatePricePerSqm(data.price.value, data.price.priceType, data.price.selectedUnit);

        const totalValue = totalAreaSqm * pricePerSqm;

        results.push({
          title: 'Total Value',
          value: formatCurrency(totalValue, data.price.currency),
          info: `Total value based on ${data.propertyType} price`
        });

        if (data.valuation) {
          const marketValuePerSqm = data.valuation.priceType === 'total'
            ? data.valuation.value / totalAreaSqm
            : calculatePricePerSqm(data.valuation.value, data.valuation.priceType, data.valuation.selectedUnit);

          const marketValue = totalAreaSqm * marketValuePerSqm;
          const difference = marketValue - totalValue;
          const percentageDiff = (difference / totalValue) * 100;
          const isOverValued = totalValue > marketValue;

          results.push({
            title: 'Market Value',
            value: formatCurrency(marketValue, data.valuation.currency),
            info: 'Total value based on current market price'
          });

          results.push({
            title: 'Valuation Difference',
            value: `${formatCurrency(Math.abs(difference), data.price.currency)} (${Math.abs(percentageDiff).toFixed(2)}%)`,
            info: `${isOverValued ? 'Over' : 'Under'} valuation`,
            type: isOverValued ? 'negative' : 'positive'
          });
        }
      }
    }

    return results;
  };

  const handleGenerateResults = () => {
    setShowResults(true);
  };

  const handleShare = () => {
    setShowShareMenu(!showShareMenu);
  };

  const handleDownload = () => {
    generatePDF(data);
  };

  const results = calculateResults();

  return (
    <div className="mt-8">
      <button
        onClick={handleGenerateResults}
        className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors"
      >
        Generate Results
      </button>

      {showResults && results.length > 0 && (
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