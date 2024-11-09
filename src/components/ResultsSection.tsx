import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { ResultBox } from './ResultBox';
import { generatePDF } from '../utils/pdfGenerator';
import { SaveCalculation } from './SaveCalculation';
import { useCalculationsStore } from '../store/calculationsStore';
import { AuthModal } from './auth/AuthModal';
import type { PropertyType, TransactionType } from '../types';

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

interface ResultsSectionProps {
  properties: PropertyData[];
  showResults: boolean[];
  onAddProperty: () => void;
  onClearProperty: (index: number) => void;
  onShowResults: (index: number) => void;
  maxProperties: number;
  activeProperties: number[];
}

export function ResultsSection({
  properties,
  showResults,
  onAddProperty,
  onClearProperty,
  onShowResults,
  maxProperties,
  activeProperties
}: ResultsSectionProps) {
  const [selectedCurrencies, setSelectedCurrencies] = useState<{[key: string]: string}>({});
  const [propertyResults, setPropertyResults] = useState<{[key: number]: any[]}>({});
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { saveCalculation } = useCalculationsStore();

  const handleSaveCalculation = async (propertyIndex: number) => {
    const property = properties.find(p => p.propertyIndex === propertyIndex);
    const results = propertyResults[propertyIndex];
    
    if (!property || !results) return;

    const calculationData = {
      propertyType: property.propertyType,
      transactionType: property.transactionType,
      landArea: property.landArea,
      buildingArea: property.buildingArea,
      price: property.price,
      valuation: property.valuation,
      results: results.map(result => ({
        title: result.title,
        value: result.value,
        currency: result.currency,
        info: result.info,
        type: result.type,
        percentage: result.percentage
      }))
    };

    try {
      await saveCalculation(calculationData);
    } catch (error) {
      console.error('Failed to save calculation:', error);
    }
  };

  const handleDownloadSingle = (propertyIndex: number) => {
    const property = properties.find(p => p.propertyIndex === propertyIndex);
    if (!property || !propertyResults[propertyIndex]) return;

    const pdfData = {
      propertyType: property.propertyType,
      transactionType: property.transactionType,
      isComparison: false,
      propertyNumber: propertyIndex,
      propertyResults: [{
        propertyNumber: propertyIndex,
        results: propertyResults[propertyIndex]
      }]
    };

    generatePDF(pdfData);
  };

  return (
    <div className="mt-8">
      <div className="border-t border-gray-200 pt-8 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Property Results</h2>
        </div>
        
        {properties.map((property, index) => (
          <div key={`property-section-${index}`}>
            {!showResults[index] ? (
              <button
                onClick={() => onShowResults(index)}
                className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors mb-4"
              >
                Generate Results - Property {property.propertyIndex}
              </button>
            ) : (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">
                    Property {property.propertyIndex} Results
                  </h3>
                  <div className="flex gap-4">
                    <SaveCalculation
                      onSave={() => handleSaveCalculation(property.propertyIndex)}
                      onAuthRequired={() => setShowAuthModal(true)}
                    />
                    <button
                      onClick={() => handleDownloadSingle(property.propertyIndex)}
                      className="flex items-center gap-2 px-4 py-2 text-[#db4a2b] border border-[#db4a2b] rounded-lg hover:bg-[#db4a2b] hover:text-white transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      Download PDF
                    </button>
                    <button
                      onClick={() => onClearProperty(index)}
                      className="px-3 py-1 text-red-600 border border-red-600 rounded hover:bg-red-50"
                    >
                      Clear Property
                    </button>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {(propertyResults[property.propertyIndex] || []).map((result, idx) => (
                    <ResultBox key={idx} {...result} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {activeProperties.length < maxProperties && (
          <button
            onClick={onAddProperty}
            className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Property
          </button>
        )}
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
}