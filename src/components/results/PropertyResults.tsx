import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { ResultBox } from '../ResultBox';
import { generatePDF } from '../../utils/pdfGenerator';
import { convertToSquareMeters, calculatePricePerSqm } from '../../utils/calculations';
import { SaveCalculation } from '../SaveCalculation';
import { useCalculationsStore } from '../../store/calculationsStore';
import { AuthModal } from '../auth/AuthModal';
import type { PropertyType, TransactionType } from '../../types';

interface PropertyData {
  propertyType: PropertyType;
  transactionType: TransactionType;
  propertyIndex: number;
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
}

interface PropertyResultsProps {
  property: PropertyData;
  onClearProperty: () => void;
}

export function PropertyResults({ property, onClearProperty }: PropertyResultsProps) {
  const [selectedCurrency, setSelectedCurrency] = useState(property.price.currency);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { saveCalculation } = useCalculationsStore();

  const calculateResults = () => {
    const totalArea = property.propertyType === 'building' 
      ? convertToSquareMeters(
          property.buildingArea!.column1,
          property.buildingArea!.column2,
          property.buildingArea!.column3
        )
      : convertToSquareMeters(
          property.landArea!.column1,
          property.landArea!.column2,
          property.landArea!.column3
        );

    const pricePerSqm = calculatePricePerSqm(
      property.price.value,
      property.price.priceType,
      property.price.selectedUnit,
      totalArea
    );

    const results = [
      {
        title: 'Total Area',
        value: `${totalArea.toFixed(2)} sqm`,
        info: `Total ${property.propertyType} area`
      },
      {
        title: 'Price per Unit',
        value: pricePerSqm,
        currency: selectedCurrency,
        info: 'Price per square meter'
      },
      {
        title: 'Total Value',
        value: totalArea * pricePerSqm,
        currency: selectedCurrency,
        info: `Total ${property.propertyType} value`,
        showCurrencyConverter: true,
        onCurrencyChange: setSelectedCurrency
      }
    ];

    if (property.valuation) {
      const marketValuePerSqm = calculatePricePerSqm(
        property.valuation.value,
        property.valuation.priceType,
        property.valuation.selectedUnit,
        totalArea
      );

      const marketValue = totalArea * marketValuePerSqm;
      results.push({
        title: 'Market Value',
        value: marketValue,
        currency: selectedCurrency,
        info: 'Market value based on current rates'
      });

      const difference = marketValue - (totalArea * pricePerSqm);
      const percentageDiff = ((difference) / (totalArea * pricePerSqm)) * 100;

      results.push({
        title: 'Value Difference',
        value: Math.abs(difference),
        currency: selectedCurrency,
        percentage: Math.abs(percentageDiff),
        info: `${difference > 0 ? 'Above' : 'Below'} market value`,
        type: difference > 0 ? 'positive' : 'negative'
      });
    }

    return results;
  };

  const handleSaveCalculation = async () => {
    const results = calculateResults();
    const calculationData = {
      ...property,
      results,
      createdAt: new Date().toISOString()
    };

    try {
      await saveCalculation(calculationData);
    } catch (error) {
      console.error('Error saving calculation:', error);
    }
  };

  const handleDownload = () => {
    const results = calculateResults();
    generatePDF({
      ...property,
      isComparison: false,
      propertyResults: [{
        propertyNumber: property.propertyIndex,
        results
      }]
    });
  };

  const results = calculateResults();

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">
          Property {property.propertyIndex} Results
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
          <button
            onClick={onClearProperty}
            className="px-3 py-1 text-red-600 border border-red-600 rounded hover:bg-red-50"
          >
            Clear Property
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {results.map((result, index) => (
          <ResultBox key={index} {...result} />
        ))}
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
}