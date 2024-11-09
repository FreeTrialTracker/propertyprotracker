import React from 'react';
import { ArrowRight, X, Download } from 'lucide-react';
import { convertToSquareMeters, formatCurrency } from '../utils/calculations';
import { generatePDF } from '../utils/pdfGenerator';
import type { PropertyData } from '../types';

interface ComparisonViewProps {
  properties: PropertyData[];
  onRemoveProperty?: (index: number) => void;
  onExitComparison?: () => void;
}

export function ComparisonView({ 
  properties,
  onRemoveProperty,
  onExitComparison
}: ComparisonViewProps) {
  // Show only first two properties for comparison
  const propertiesToCompare = properties.slice(0, 2);

  if (propertiesToCompare.length !== 2) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Please select two properties to compare.</p>
      </div>
    );
  }

  const [property1, property2] = propertiesToCompare;

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
      ? { total: landAreaSqm + buildingAreaSqm, land: landAreaSqm, building: buildingAreaSqm }
      : property.propertyType === 'land'
      ? { total: landAreaSqm, land: landAreaSqm, building: 0 }
      : { total: buildingAreaSqm, land: 0, building: buildingAreaSqm };
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

  const area1 = calculateTotalArea(property1);
  const area2 = calculateTotalArea(property2);
  const areaDiff = calculateDifference(area1.total, area2.total);
  const priceDiff = calculateDifference(property1.price.value, property2.price.value);
  const valuationDiff = property1.valuation && property2.valuation
    ? calculateDifference(property1.valuation.value, property2.valuation.value)
    : null;

  const handleDownloadComparison = () => {
    generatePDF({
      ...property1,
      isComparison: true,
      propertyResults: properties.map((property, index) => {
        const area = calculateTotalArea(property);
        return {
          propertyNumber: property.propertyIndex,
          results: [
            {
              title: 'Total Area',
              value: `${area.total.toFixed(2)} sqm`,
              info: `Total ${property.propertyType} area`
            },
            {
              title: 'Price',
              value: formatCurrency(property.price.value, property.price.currency),
              info: 'Total price'
            },
            {
              title: 'Price per sqm',
              value: formatCurrency(property.price.value / area.total, property.price.currency),
              info: 'Price per square meter'
            },
            ...(property.valuation ? [{
              title: 'Market Value',
              value: formatCurrency(property.valuation.value, property.valuation.currency),
              info: 'Market valuation'
            }] : [])
          ]
        };
      }),
      totalProperties: properties.length
    });
  };

  const renderPropertyDetails = (property: PropertyData, area: { total: number; land: number; building: number }, index: number) => (
    <div className="space-y-3">
      {onRemoveProperty && (
        <button
          onClick={() => onRemoveProperty(properties.indexOf(property))}
          className="px-3 py-1 text-red-600 border border-red-600 rounded hover:bg-red-50"
        >
          Remove Property {property.propertyIndex}
        </button>
      )}

      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Property Details</h4>
        <div className="space-y-2 text-sm">
          <p>Type: {property.propertyType.charAt(0).toUpperCase() + property.propertyType.slice(1)}</p>
          {area.land > 0 && <p>Land Area: {area.land.toFixed(2)} sqm</p>}
          {area.building > 0 && <p>Building Area: {area.building.toFixed(2)} sqm</p>}
          <p>Total Area: {area.total.toFixed(2)} sqm</p>
        </div>
      </div>

      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Financial Details</h4>
        <div className="space-y-2 text-sm">
          <p>Price: {formatCurrency(property.price.value, property.price.currency)}</p>
          <p>Price per sqm: {formatCurrency(property.price.value / area.total, property.price.currency)}</p>
          {property.valuation && (
            <p>Market Value: {formatCurrency(property.valuation.value, property.valuation.currency)}</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderDifference = (
    title: string,
    diff: { amount: number; percentage: number; isPositive: boolean },
    currency?: string
  ) => (
    <div className="flex items-center gap-2">
      <ArrowRight className={`h-4 w-4 ${diff.isPositive ? 'text-green-500' : 'text-red-500'}`} />
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-sm text-gray-600">
          {currency 
            ? `${formatCurrency(Math.abs(diff.amount), currency)} (${Math.abs(diff.percentage).toFixed(1)}%)`
            : `${Math.abs(diff.amount).toFixed(2)} (${Math.abs(diff.percentage).toFixed(1)}%)`}
        </p>
        <p className="text-xs text-gray-500">
          Property {property2.propertyIndex} is {diff.isPositive ? 'higher' : 'lower'} than Property {property1.propertyIndex}
        </p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Property Comparison</h2>
        <div className="flex gap-4">
          <button
            onClick={handleDownloadComparison}
            className="flex items-center gap-2 px-4 py-2 bg-[#db4a2b] text-white rounded-lg hover:bg-[#c43d21] transition-colors"
          >
            <Download className="h-4 w-4" />
            Download Comparison PDF
          </button>
          {properties.length > 2 && (
            <p className="text-sm text-gray-600 self-center">
              Showing comparison of first two properties ({properties.length} total)
            </p>
          )}
          {onExitComparison && (
            <button
              onClick={onExitComparison}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              <X className="h-4 w-4" />
              Exit Comparison
            </button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-6">
        {/* Property 1 */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Property {property1.propertyIndex}</h3>
          {renderPropertyDetails(property1, area1, 0)}
        </div>

        {/* Differences */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Comparison</h3>
          <div className="p-4 bg-gray-50 rounded-lg space-y-4">
            {renderDifference('Area Difference', areaDiff)}
            {renderDifference('Price Difference', priceDiff, property1.price.currency)}
            {valuationDiff && renderDifference('Market Value Difference', valuationDiff, property1.valuation?.currency)}
          </div>
        </div>

        {/* Property 2 */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Property {property2.propertyIndex}</h3>
          {renderPropertyDetails(property2, area2, 1)}
        </div>
      </div>
    </div>
  );
}