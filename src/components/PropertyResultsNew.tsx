import React, { useState, useEffect } from 'react';
import { Share2, Download } from 'lucide-react';
import { ResultBox } from './ResultBox';
import { generatePDF } from '../utils/pdfGenerator';
import { convertToSquareMeters, calculatePricePerSqm, formatCurrency } from '../utils/calculations';
import { convertCurrency } from '../utils/currencyConversion';
import type { PropertyType, TransactionType } from '../types';

interface PropertyData {
  propertyType: PropertyType;
  transactionType: TransactionType;
  propertyIndex: number;
  landArea: {
    column1: { value: number; unit: string };
    column2: { value: number; unit: string };
    column3: { value: number; unit: string };
  };
  buildingArea: {
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
}

interface PropertyResultsNewProps {
  property: PropertyData;
  onClearProperty: (index: number) => void;
  propertyIndex: number;
}

export function PropertyResultsNew({ property, onClearProperty, propertyIndex }: PropertyResultsNewProps) {
  const [selectedCurrency, setSelectedCurrency] = useState(property.price.currency);
  const [landResults, setLandResults] = useState<any[]>([]);
  const [buildingResults, setBuildingResults] = useState<any[]>([]);
  const [totalResults, setTotalResults] = useState<any[]>([]);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const calculateResults = async () => {
    // Calculate areas
    const totalLandArea = convertToSquareMeters(
      property.landArea.column1,
      property.landArea.column2,
      property.landArea.column3
    );

    const totalBuildingArea = convertToSquareMeters(
      property.buildingArea.column1,
      property.buildingArea.column2,
      property.buildingArea.column3
    );

    const totalArea = totalLandArea + totalBuildingArea;

    // Calculate price allocations (50% each for simplicity)
    const landPriceRatio = 0.5;
    const buildingPriceRatio = 0.5;

    const landPrice = property.price.value * landPriceRatio;
    const buildingPrice = property.price.value * buildingPriceRatio;

    // Land Results
    const landPricePerSqm = calculatePricePerSqm(landPrice, property.price.priceType, property.price.selectedUnit, totalLandArea);
    const convertedLandPricePerSqm = await convertCurrency(landPricePerSqm, property.price.currency, selectedCurrency);
    const landTotalValue = totalLandArea * convertedLandPricePerSqm;

    const newLandResults = [
      {
        title: 'Land Area',
        value: totalLandArea,
        unit: 'sqm',
        info: 'Total land area',
        showUnitConverter: false
      },
      {
        title: 'Land Price per Unit',
        value: convertedLandPricePerSqm,
        currency: selectedCurrency,
        info: 'Land price per square meter',
        showCurrencyConverter: true,
        onCurrencyChange: setSelectedCurrency
      },
      {
        title: 'Land Value',
        value: landTotalValue,
        currency: selectedCurrency,
        info: 'Total land value',
        showCurrencyConverter: false
      }
    ];

    // Building Results
    const buildingPricePerSqm = calculatePricePerSqm(buildingPrice, property.price.priceType, property.price.selectedUnit, totalBuildingArea);
    const convertedBuildingPricePerSqm = await convertCurrency(buildingPricePerSqm, property.price.currency, selectedCurrency);
    const buildingTotalValue = totalBuildingArea * convertedBuildingPricePerSqm;

    const newBuildingResults = [
      {
        title: 'Building Area',
        value: totalBuildingArea,
        unit: 'sqm',
        info: 'Total building area',
        showUnitConverter: false
      },
      {
        title: 'Building Price per Unit',
        value: convertedBuildingPricePerSqm,
        currency: selectedCurrency,
        info: 'Building price per square meter',
        showCurrencyConverter: true,
        onCurrencyChange: setSelectedCurrency
      },
      {
        title: 'Building Value',
        value: buildingTotalValue,
        currency: selectedCurrency,
        info: 'Total building value',
        showCurrencyConverter: false
      }
    ];

    // Total Results
    const totalPricePerSqm = calculatePricePerSqm(property.price.value, property.price.priceType, property.price.selectedUnit, totalArea);
    const convertedTotalPricePerSqm = await convertCurrency(totalPricePerSqm, property.price.currency, selectedCurrency);
    const totalValue = totalArea * convertedTotalPricePerSqm;

    const newTotalResults = [
      {
        title: 'Total Area',
        value: totalArea,
        unit: 'sqm',
        info: 'Combined land and building area',
        showUnitConverter: false
      },
      {
        title: 'Total Price per Unit',
        value: convertedTotalPricePerSqm,
        currency: selectedCurrency,
        info: 'Combined price per square meter',
        showCurrencyConverter: true,
        onCurrencyChange: setSelectedCurrency
      },
      {
        title: 'Total Value',
        value: totalValue,
        currency: selectedCurrency,
        info: 'Total property value',
        showCurrencyConverter: false
      }
    ];

    if (property.valuation) {
      const marketValuePerSqm = property.valuation.priceType === 'total'
        ? property.valuation.value / totalArea
        : calculatePricePerSqm(
            property.valuation.value,
            property.valuation.priceType,
            property.valuation.selectedUnit,
            totalArea
          );

      const convertedMarketValue = await convertCurrency(
        totalArea * marketValuePerSqm,
        property.valuation.currency,
        selectedCurrency
      );

      const difference = convertedMarketValue - totalValue;
      const percentageDiff = totalValue > 0 ? (difference / totalValue) * 100 : 0;

      newTotalResults.push({
        title: 'Market Value',
        value: convertedMarketValue,
        currency: selectedCurrency,
        info: 'Market value based on current rates',
        showCurrencyConverter: false
      });

      newTotalResults.push({
        title: 'Value Difference',
        value: Math.abs(difference),
        percentage: Math.abs(percentageDiff),
        currency: selectedCurrency,
        info: `${totalValue > convertedMarketValue ? 'Above' : 'Below'} market value`,
        type: totalValue > convertedMarketValue ? 'negative' : 'positive',
        showCurrencyConverter: false
      });
    }

    setLandResults(newLandResults);
    setBuildingResults(newBuildingResults);
    setTotalResults(newTotalResults);
  };

  useEffect(() => {
    calculateResults();
  }, [property, selectedCurrency]);

  const handleDownload = () => {
    generatePDF({
      ...property,
      isComparison: false,
      propertyResults: [{
        propertyNumber: property.propertyIndex,
        results: [...landResults, ...buildingResults, ...totalResults]
      }]
    });
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">
          Property {property.propertyIndex} Results
        </h3>
        <button
          onClick={() => onClearProperty(propertyIndex)}
          className="px-3 py-1 text-red-600 border border-red-600 rounded hover:bg-red-50"
        >
          Clear Property
        </button>
      </div>

      {/* Land Results */}
      <div className="mb-6">
        <h4 className="text-lg font-medium text-gray-800 mb-3">Land Results</h4>
        <div className="grid gap-4 md:grid-cols-3">
          {landResults.map((result, idx) => (
            <ResultBox key={`land-${idx}`} {...result} />
          ))}
        </div>
      </div>

      {/* Building Results */}
      <div className="mb-6">
        <h4 className="text-lg font-medium text-gray-800 mb-3">Building Results</h4>
        <div className="grid gap-4 md:grid-cols-3">
          {buildingResults.map((result, idx) => (
            <ResultBox key={`building-${idx}`} {...result} />
          ))}
        </div>
      </div>

      {/* Total Results */}
      <div className="mb-6">
        <h4 className="text-lg font-medium text-gray-800 mb-3">Combined Results</h4>
        <div className="grid gap-4 md:grid-cols-3">
          {totalResults.map((result, idx) => (
            <ResultBox key={`total-${idx}`} {...result} />
          ))}
        </div>
      </div>

      <div className="mt-6 flex gap-4">
        <div className="relative">
          <button
            onClick={() => setShowShareMenu(!showShareMenu)}
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

export default PropertyResultsNew;