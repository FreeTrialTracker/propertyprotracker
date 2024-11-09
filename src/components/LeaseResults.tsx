import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import { formatCurrency } from '../utils/calculations';
import { generateLeasePDF } from '../utils/generateLeasePDF';
import { ResultBox } from './ResultBox';
import { SaveCalculation } from './SaveCalculation';
import { useAuthStore } from '../store/authStore';
import { useCalculationsStore } from '../store/calculationsStore';
import { convertCurrency } from '../utils/currencyConversion';
import type { PropertyType } from '../types';

interface LeaseResultsProps {
  totalLeaseCost: number;
  totalMarketValue: number;
  currency: string;
  propertyType: PropertyType;
  duration: number;
  monthlyPayment: number;
  marketMonthlyPayment: number;
  totalPrice: number;
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

export function LeaseResults({
  totalLeaseCost,
  totalMarketValue,
  currency,
  propertyType,
  duration,
  monthlyPayment,
  marketMonthlyPayment,
  totalPrice,
  propertyNumber,
  landArea,
  buildingArea
}: LeaseResultsProps) {
  const [showResults, setShowResults] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(currency);
  const { user } = useAuthStore();
  const { saveCalculation } = useCalculationsStore();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const [convertedValues, setConvertedValues] = useState({
    totalPrice: totalPrice,
    monthlyPayment: monthlyPayment,
    totalLeaseCost: totalLeaseCost,
    totalMarketValue: totalMarketValue,
    marketMonthlyPayment: marketMonthlyPayment
  });

  useEffect(() => {
    const updateConvertedValues = async () => {
      try {
        // Convert all monetary values to selected currency
        const convertedTotalPrice = await convertCurrency(totalPrice, currency, selectedCurrency);
        const convertedMonthlyPayment = await convertCurrency(monthlyPayment, currency, selectedCurrency);
        const convertedTotalLeaseCost = await convertCurrency(totalLeaseCost, currency, selectedCurrency);
        const convertedTotalMarketValue = await convertCurrency(totalMarketValue, currency, selectedCurrency);
        const convertedMarketMonthlyPayment = await convertCurrency(marketMonthlyPayment, currency, selectedCurrency);

        setConvertedValues({
          totalPrice: convertedTotalPrice,
          monthlyPayment: convertedMonthlyPayment,
          totalLeaseCost: convertedTotalLeaseCost,
          totalMarketValue: convertedTotalMarketValue,
          marketMonthlyPayment: convertedMarketMonthlyPayment
        });
      } catch (error) {
        console.error('Error converting currencies:', error);
      }
    };

    updateConvertedValues();
  }, [selectedCurrency, currency, totalPrice, monthlyPayment, totalLeaseCost, totalMarketValue, marketMonthlyPayment]);

  const calculateResults = () => {
    const leaseReturn = convertedValues.totalPrice > 0 
      ? (convertedValues.totalLeaseCost / convertedValues.totalPrice) * 100 
      : 0;
    
    const difference = convertedValues.totalLeaseCost - convertedValues.totalMarketValue;
    const percentageDiff = convertedValues.totalMarketValue > 0 
      ? ((convertedValues.totalLeaseCost - convertedValues.totalMarketValue) / convertedValues.totalMarketValue) * 100 
      : 0;

    return [
      {
        title: 'Total Price',
        value: convertedValues.totalPrice,
        currency: selectedCurrency,
        info: 'Total property price',
        showCurrencyConverter: true,
        onCurrencyChange: setSelectedCurrency
      },
      {
        title: 'Monthly Payment',
        value: convertedValues.monthlyPayment,
        currency: selectedCurrency,
        info: 'Your monthly lease payment'
      },
      {
        title: 'Total Lease Cost',
        value: convertedValues.totalLeaseCost,
        currency: selectedCurrency,
        info: `Total cost over ${duration} years`
      },
      {
        title: 'Market Monthly Rate',
        value: convertedValues.marketMonthlyPayment,
        currency: selectedCurrency,
        info: 'Current market monthly rate'
      },
      {
        title: 'Total Market Value',
        value: convertedValues.totalMarketValue,
        currency: selectedCurrency,
        info: 'Total market value over lease period'
      },
      {
        title: 'Value Difference',
        value: Math.abs(difference),
        currency: selectedCurrency,
        percentage: Math.abs(percentageDiff),
        info: `${difference > 0 ? 'Above' : 'Below'} market value`,
        type: difference > 0 ? 'negative' : 'positive'
      }
    ];
  };

  const handleSaveCalculation = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    const calculationData = {
      propertyType,
      propertyNumber,
      transactionType: 'lease',
      landArea,
      buildingArea,
      price: {
        value: totalPrice,
        currency: selectedCurrency,
        priceType: 'total',
        selectedUnit: 'sqm'
      },
      results: calculateResults(),
      duration,
      monthlyPayment,
      marketMonthlyPayment,
      totalLeaseCost,
      totalMarketValue
    };

    try {
      await saveCalculation(user.uid, calculationData);
    } catch (error) {
      console.error('Error saving calculation:', error);
    }
  };

  const handleDownload = () => {
    generateLeasePDF({
      propertyType,
      propertyNumber,
      totalLeaseCost: convertedValues.totalLeaseCost,
      totalMarketValue: convertedValues.totalMarketValue,
      currency: selectedCurrency,
      duration,
      monthlyPayment: convertedValues.monthlyPayment,
      marketMonthlyPayment: convertedValues.marketMonthlyPayment,
      totalPrice: convertedValues.totalPrice,
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
        Generate Results - Lease
      </button>

      {showResults && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">
              Property {propertyNumber} - Lease Results
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
            {calculateResults().map((result, index) => (
              <ResultBox key={index} {...result} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}