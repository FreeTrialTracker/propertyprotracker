import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import { ResultBox } from '../ResultBox';
import { SaveCalculation } from '../SaveCalculation';
import { useAuthStore } from '../../store/authStore';
import { useCalculationsStore } from '../../store/calculationsStore';
import { convertCurrency } from '../../utils/currencyConversion';
import { generateLeasePDF } from '../../utils/generateLeasePDF';
import type { PropertyType } from '../../types';

interface LeaseResultCardProps {
  propertyType: PropertyType;
  propertyNumber: number;
  initialCurrency: string;
  totalPrice: number;
  monthlyPayment: number;
  totalLeaseCost: number;
  marketMonthlyPayment: number;
  duration: number;
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
  onAuthRequired: () => void;
  onClearInputs: () => void;
}

export function LeaseResultCard({
  propertyType,
  propertyNumber,
  initialCurrency,
  totalPrice,
  monthlyPayment,
  totalLeaseCost,
  marketMonthlyPayment,
  duration,
  reportName,
  location,
  notes,
  landArea,
  buildingArea,
  onAuthRequired,
  onClearInputs
}: LeaseResultCardProps) {
  const [selectedCurrency, setSelectedCurrency] = useState(initialCurrency);
  const { user } = useAuthStore();
  const { saveCalculation } = useCalculationsStore();

  const [convertedValues, setConvertedValues] = useState({
    totalPrice,
    monthlyPayment,
    totalLeaseCost,
    marketMonthlyPayment,
    marketTotalValue: marketMonthlyPayment * duration * 12
  });

  useEffect(() => {
    const updateConvertedValues = async () => {
      try {
        const [
          convertedTotalPrice,
          convertedMonthlyPayment,
          convertedTotalLeaseCost,
          convertedMarketMonthlyPayment
        ] = await Promise.all([
          convertCurrency(totalPrice, initialCurrency, selectedCurrency),
          convertCurrency(monthlyPayment, initialCurrency, selectedCurrency),
          convertCurrency(totalLeaseCost, initialCurrency, selectedCurrency),
          convertCurrency(marketMonthlyPayment, initialCurrency, selectedCurrency)
        ]);

        const convertedMarketTotalValue = convertedMarketMonthlyPayment * duration * 12;

        setConvertedValues({
          totalPrice: convertedTotalPrice,
          monthlyPayment: convertedMonthlyPayment,
          totalLeaseCost: convertedTotalLeaseCost,
          marketMonthlyPayment: convertedMarketMonthlyPayment,
          marketTotalValue: convertedMarketTotalValue
        });
      } catch (error) {
        console.error('Error converting currencies:', error);
      }
    };

    updateConvertedValues();
  }, [selectedCurrency, initialCurrency, totalPrice, monthlyPayment, totalLeaseCost, marketMonthlyPayment, duration]);

  const calculateResults = () => {
    // Calculate annual lease payment
    const annualLeasePayment = convertedValues.monthlyPayment * 12;
    // Calculate lease return as percentage of total price
    const leaseReturn = convertedValues.totalPrice > 0 
      ? (annualLeasePayment / convertedValues.totalPrice) * 100 
      : 0;
    
    const difference = convertedValues.totalLeaseCost - convertedValues.marketTotalValue;
    const percentageDiff = convertedValues.marketTotalValue > 0 
      ? (difference / convertedValues.marketTotalValue) * 100 
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
        title: 'Lease Return',
        value: `${leaseReturn.toFixed(2)}%`,
        info: 'Annual lease payment as percentage of total price',
        type: leaseReturn >= 100 ? 'negative' : 'positive'
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

  const handleSave = async () => {
    if (!user) {
      onAuthRequired();
      return;
    }

    try {
      await saveCalculation(user.uid, {
        propertyType,
        propertyNumber,
        transactionType: 'lease',
        landArea,
        buildingArea,
        price: {
          value: convertedValues.totalPrice,
          currency: selectedCurrency,
          priceType: 'total',
          selectedUnit: 'sqm'
        },
        results: calculateResults()
      });
    } catch (error) {
      console.error('Error saving calculation:', error);
    }
  };

  const handleDownload = () => {
    generateLeasePDF({
      propertyType,
      propertyNumber,
      totalLeaseCost: convertedValues.totalLeaseCost,
      totalMarketValue: convertedValues.marketTotalValue,
      currency: selectedCurrency,
      duration,
      monthlyPayment: convertedValues.monthlyPayment,
      marketMonthlyPayment: convertedValues.marketMonthlyPayment,
      totalPrice: convertedValues.totalPrice,
      reportName,
      location,
      notes,
      landArea,
      buildingArea
    });
  };

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">
          Property {propertyNumber} - Lease Results
        </h3>
        <div className="flex gap-4">
          <SaveCalculation
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
            onClick={onClearInputs}
            className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            Clear Inputs
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
}

// Add named export as default as well
export default LeaseResultCard;