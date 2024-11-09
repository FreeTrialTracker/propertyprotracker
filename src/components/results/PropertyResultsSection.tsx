import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { ResultBox } from '../ResultBox';
import { SaveCalculationButton } from '../SaveCalculationButton';
import { useCalculationsStore } from '../../store/calculationsStore';
import { generatePDF } from '../../utils/pdfGenerator';
import { convertToSquareMeters, calculatePricePerSqm, formatCurrency } from '../../utils/calculations';
import { convertCurrency } from '../../utils/currencyConversion';
import { useAuthStore } from '../../store/authStore';
import type { PropertyType } from '../../types';

interface PropertyResultsSectionProps {
  propertyType: PropertyType;
  propertyNumber: number;
  reportName: string;
  location: string;
  notes: string;
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
    totalValue?: number; // Add this to receive the total value including additional expenses
  };
  valuation?: {
    value: number;
    currency: string;
    priceType: 'total' | 'per-unit';
    selectedUnit: string;
  };
  additionalExpenses?: number; // Add this to receive additional expenses
  onAuthRequired: () => void;
  onClearProperty: () => void;
}

export const PropertyResultsSection: React.FC<PropertyResultsSectionProps> = ({
  propertyType,
  propertyNumber,
  reportName,
  location,
  notes,
  landArea,
  buildingArea,
  price,
  valuation,
  additionalExpenses = 0, // Default to 0 if not provided
  onAuthRequired,
  onClearProperty
}) => {
  const [selectedCurrency, setSelectedCurrency] = useState(price.currency);
  const { user } = useAuthStore();
  const { saveCalculation } = useCalculationsStore();

  const totalArea = propertyType === 'building' 
    ? convertToSquareMeters(
        buildingArea!.column1,
        buildingArea!.column2,
        buildingArea!.column3
      )
    : convertToSquareMeters(
        landArea!.column1,
        landArea!.column2,
        landArea!.column3
      );

  const [convertedValues, setConvertedValues] = useState({
    price: price.value,
    pricePerUnit: 0,
    totalValue: price.totalValue || (price.value + additionalExpenses), // Use totalValue if provided
    marketValue: valuation?.value || 0,
    additionalExpenses
  });

  React.useEffect(() => {
    const updateConvertedValues = async () => {
      try {
        const convertedPrice = await convertCurrency(price.value, price.currency, selectedCurrency);
        const pricePerUnit = calculatePricePerSqm(
          price.value,
          price.priceType,
          price.selectedUnit,
          totalArea
        );
        const convertedPricePerUnit = await convertCurrency(pricePerUnit, price.currency, selectedCurrency);
        const convertedAdditionalExpenses = await convertCurrency(additionalExpenses, price.currency, selectedCurrency);
        const totalValue = price.totalValue 
          ? await convertCurrency(price.totalValue, price.currency, selectedCurrency)
          : convertedPrice + convertedAdditionalExpenses;

        let convertedMarketValue = 0;
        if (valuation) {
          const marketValuePerUnit = calculatePricePerSqm(
            valuation.value,
            valuation.priceType,
            valuation.selectedUnit,
            totalArea
          );
          const convertedMarketValuePerUnit = await convertCurrency(
            marketValuePerUnit,
            valuation.currency,
            selectedCurrency
          );
          convertedMarketValue = totalArea * convertedMarketValuePerUnit;
        }

        setConvertedValues({
          price: convertedPrice,
          pricePerUnit: convertedPricePerUnit,
          totalValue,
          marketValue: convertedMarketValue,
          additionalExpenses: convertedAdditionalExpenses
        });
      } catch (error) {
        console.error('Error converting currencies:', error);
      }
    };

    updateConvertedValues();
  }, [selectedCurrency, price, valuation, totalArea, additionalExpenses]);

  const calculateResults = () => {
    const results = [];

    results.push({
      title: 'Total Area',
      value: totalArea.toFixed(2),
      info: `Total ${propertyType} area`,
      unit: 'sqm'
    });

    results.push({
      title: 'Price per Unit',
      value: convertedValues.pricePerUnit,
      currency: selectedCurrency,
      info: 'Price per square meter'
    });

    results.push({
      title: 'Base Price',
      value: convertedValues.price,
      currency: selectedCurrency,
      info: `Base ${propertyType} price`
    });

    if (convertedValues.additionalExpenses > 0) {
      results.push({
        title: 'Additional Expenses',
        value: convertedValues.additionalExpenses,
        currency: selectedCurrency,
        info: 'Total additional expenses'
      });
    }

    results.push({
      title: 'Total Value',
      value: convertedValues.totalValue,
      currency: selectedCurrency,
      info: `Total ${propertyType} value including additional expenses`,
      showCurrencyConverter: true,
      onCurrencyChange: setSelectedCurrency
    });

    if (valuation) {
      results.push({
        title: 'Market Value',
        value: convertedValues.marketValue,
        currency: selectedCurrency,
        info: 'Market value based on current rates'
      });

      const difference = convertedValues.marketValue - convertedValues.totalValue;
      const percentageDiff = convertedValues.totalValue > 0 
        ? (difference / convertedValues.totalValue) * 100 
        : 0;

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

  const handleSave = async () => {
    if (!user) {
      onAuthRequired();
      return;
    }

    const calculationData = {
      propertyType,
      propertyNumber,
      transactionType: 'buy-sell',
      landArea,
      buildingArea,
      price: {
        ...price,
        totalValue: convertedValues.totalValue
      },
      valuation,
      additionalExpenses,
      results: calculateResults()
    };

    try {
      await saveCalculation(user.uid, calculationData);
    } catch (error) {
      console.error('Error saving calculation:', error);
    }
  };

  const handleDownload = () => {
    const results = calculateResults();
    generatePDF({
      reportName,
      location,
      notes,
      propertyType,
      propertyNumber,
      transactionType: 'buy-sell',
      isComparison: false,
      propertyResults: [{
        propertyNumber,
        results
      }]
    });
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">
          Property {propertyNumber} Results
        </h3>
        <div className="flex gap-4">
          <SaveCalculationButton
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
          <button
            onClick={onClearProperty}
            className="px-3 py-1 text-red-600 border border-red-600 rounded hover:bg-red-50"
          >
            Clear Property
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {calculateResults().map((result, index) => (
          <ResultBox key={index} {...result} />
        ))}
      </div>
    </div>
  );
};

export default PropertyResultsSection;