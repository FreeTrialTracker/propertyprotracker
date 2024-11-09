import React, { useState } from 'react';
import { Share2, Download, ArrowRight } from 'lucide-react';
import { formatCurrency, convertToSquareMeters } from '../utils/calculations';
import { generatePDF } from '../utils/pdfGenerator';
import type { PropertyData } from '../types';

interface ComparisonResultsProps {
  properties: PropertyData[];
}

export function ComparisonResults({ properties }: ComparisonResultsProps) {
  const [showShareMenu, setShowShareMenu] = useState(false);

  const handleShare = () => {
    setShowShareMenu(!showShareMenu);
  };

  const handleDownload = () => {
    // Generate a comparison PDF
    const comparisonData = {
      ...properties[0],
      comparisonData: properties[1],
      isComparison: true
    };
    generatePDF(comparisonData);
  };

  const calculateDifference = (value1: number, value2: number) => {
    if (value1 === 0) return { amount: 0, percentage: 0, isPositive: true };
    const difference = value2 - value1;
    const percentageDiff = (difference / value1) * 100;
    return {
      amount: difference,
      percentage: percentageDiff,
      isPositive: difference >= 0
    };
  };

  const calculateTotalArea = (property: PropertyData) => {
    const landAreaSqm = property.landArea 
      ? convertToSquareMeters(
          property.landArea.column1,
          property.landArea.column2,
          property.landArea.column3
        )
      : 0;

    const buildingAreaSqm = property.buildingArea
      ? convertToSquareMeters(
          property.buildingArea.column1,
          property.buildingArea.column2,
          property.buildingArea.column3
        )
      : 0;

    return property.propertyType === 'both'
      ? landAreaSqm + buildingAreaSqm
      : property.propertyType === 'land'
      ? landAreaSqm
      : buildingAreaSqm;
  };

  const renderComparison = () => {
    if (properties.length !== 2) return null;

    const [property1, property2] = properties;
    const priceDiff = calculateDifference(property1.price.value, property2.price.value);
    const valuationDiff = property1.valuation && property2.valuation
      ? calculateDifference(property1.valuation.value, property2.valuation.value)
      : null;
    
    const area1 = calculateTotalArea(property1);
    const area2 = calculateTotalArea(property2);
    const areaDiff = calculateDifference(area1, area2);

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="p-6 rounded-lg border border-gray-200 bg-white">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Property 1</h3>
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                Total Area: {area1.toFixed(2)} sqm
              </p>
              <p className="text-sm text-gray-600">
                Price: {formatCurrency(property1.price.value, property1.price.currency)}
              </p>
              {property1.valuation && (
                <p className="text-sm text-gray-600">
                  Valuation: {formatCurrency(property1.valuation.value, property1.valuation.currency)}
                </p>
              )}
              <p className="text-sm text-gray-600">
                Price per sqm: {formatCurrency(property1.price.value / area1, property1.price.currency)}
              </p>
            </div>
          </div>

          <div className="p-6 rounded-lg border border-gray-200 bg-white">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Difference</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <ArrowRight className={`h-4 w-4 ${areaDiff.isPositive ? 'text-green-500' : 'text-red-500'}`} />
                <p className="text-sm text-gray-600">
                  Area: {Math.abs(areaDiff.amount).toFixed(2)} sqm ({Math.abs(areaDiff.percentage).toFixed(2)}%)
                </p>
              </div>
              <div className="flex items-center gap-2">
                <ArrowRight className={`h-4 w-4 ${priceDiff.isPositive ? 'text-green-500' : 'text-red-500'}`} />
                <p className="text-sm text-gray-600">
                  Price: {formatCurrency(Math.abs(priceDiff.amount), property1.price.currency)} ({Math.abs(priceDiff.percentage).toFixed(2)}%)
                </p>
              </div>
              {valuationDiff && (
                <div className="flex items-center gap-2">
                  <ArrowRight className={`h-4 w-4 ${valuationDiff.isPositive ? 'text-green-500' : 'text-red-500'}`} />
                  <p className="text-sm text-gray-600">
                    Valuation: {formatCurrency(Math.abs(valuationDiff.amount), property1.valuation!.currency)} ({Math.abs(valuationDiff.percentage).toFixed(2)}%)
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="p-6 rounded-lg border border-gray-200 bg-white">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Property 2</h3>
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                Total Area: {area2.toFixed(2)} sqm
              </p>
              <p className="text-sm text-gray-600">
                Price: {formatCurrency(property2.price.value, property2.price.currency)}
              </p>
              {property2.valuation && (
                <p className="text-sm text-gray-600">
                  Valuation: {formatCurrency(property2.valuation.value, property2.valuation.currency)}
                </p>
              )}
              <p className="text-sm text-gray-600">
                Price per sqm: {formatCurrency(property2.price.value / area2, property2.price.currency)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="relative">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              <Share2 className="w-4 h-4" />
              Share Comparison
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
            Download Comparison PDF
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Property Comparison</h2>
      {renderComparison()}
    </div>
  );
}