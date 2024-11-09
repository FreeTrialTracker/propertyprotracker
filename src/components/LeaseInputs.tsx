import React, { useState, useEffect } from 'react';
import { Info } from 'lucide-react';
import { PriceInput } from './PriceInput';
import { LeaseResultCard } from './results/LeaseResultCard';
import { formatCurrency } from '../utils/calculations';
import { useCalculatorStore } from '../store/calculatorStore';

interface LeaseInputsProps {
  totalArea: number;
  propertyType: PropertyType;
  totalPrice: number;
  propertyNumber: number;
  initialCurrency: string;
  duration: number;
  onDurationChange: (duration: number) => void;
  showResults: boolean;
  onShowResults: (show: boolean) => void;
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
  reportName: string;
  location: string;
  notes: string;
}

export function LeaseInputs({
  totalArea,
  propertyType,
  totalPrice,
  propertyNumber,
  initialCurrency,
  duration,
  onDurationChange,
  showResults,
  onShowResults,
  landArea,
  buildingArea,
  reportName,
  location,
  notes
}: LeaseInputsProps) {
  const property = useCalculatorStore(state => state.properties[propertyNumber - 1]);
  const updateProperty = useCalculatorStore(state => state.updateProperty);

  const [leasePrice, setLeasePrice] = useState({
    value: 0,
    currency: initialCurrency, // Initialize with purchase price currency
    priceType: 'monthly' as 'monthly' | 'yearly'
  });

  const [marketLeasePrice, setMarketLeasePrice] = useState({
    value: 0,
    currency: initialCurrency, // Initialize with purchase price currency
    priceType: 'monthly' as 'monthly' | 'yearly'
  });

  // Update lease price currencies when purchase price currency changes
  useEffect(() => {
    setLeasePrice(prev => ({
      ...prev,
      currency: initialCurrency
    }));
    setMarketLeasePrice(prev => ({
      ...prev,
      currency: initialCurrency
    }));
  }, [initialCurrency]);

  useEffect(() => {
    // Update store when lease inputs change
    updateProperty(propertyNumber - 1, {
      lease: {
        leasePrice,
        marketLeasePrice,
        duration
      }
    });
  }, [leasePrice, marketLeasePrice, duration, propertyNumber, updateProperty]);

  const calculateMonthlyAmount = (amount: number | string, type: 'monthly' | 'yearly') => {
    const numericAmount = typeof amount === 'string' ? parseFloat(amount) || 0 : amount;
    return type === 'yearly' ? numericAmount / 12 : numericAmount;
  };

  const calculateYearlyAmount = (amount: number | string, type: 'monthly' | 'yearly') => {
    const numericAmount = typeof amount === 'string' ? parseFloat(amount) || 0 : amount;
    return type === 'monthly' ? numericAmount * 12 : numericAmount;
  };

  const calculatePricePerSqm = (amount: number | string, type: 'monthly' | 'yearly') => {
    const numericAmount = typeof amount === 'string' ? parseFloat(amount) || 0 : amount;
    if (!numericAmount || !totalArea) return 0;
    const monthlyAmount = calculateMonthlyAmount(numericAmount, type);
    return monthlyAmount / totalArea;
  };

  const totalLeaseCost = calculateYearlyAmount(leasePrice.value, leasePrice.priceType) * duration;
  const totalMarketValue = calculateYearlyAmount(marketLeasePrice.value, marketLeasePrice.priceType) * duration;
  const monthlyPayment = calculateMonthlyAmount(leasePrice.value, leasePrice.priceType);
  const marketMonthlyPayment = calculateMonthlyAmount(marketLeasePrice.value, marketLeasePrice.priceType);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Enter Lease Details - Property {propertyNumber}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Lease Price Input */}
        <div>
          <div className="flex gap-2 items-start">
            <div className="flex-1">
              <PriceInput
                label="Lease Price"
                value={leasePrice.value}
                currency={leasePrice.currency}
                onChange={(value) => setLeasePrice({ ...leasePrice, value })}
                onCurrencyChange={(currency) => setLeasePrice({ ...leasePrice, currency })}
                showPricePerUnit={false}
              />
            </div>
            <div className="mt-8">
              <select
                value={leasePrice.priceType}
                onChange={(e) => setLeasePrice({ ...leasePrice, priceType: e.target.value as 'monthly' | 'yearly' })}
                className="h-12 w-32 rounded-md border-gray-300 shadow-sm focus:border-[#db4a2b] focus:ring-[#db4a2b] text-base"
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>
          <div className="mt-2 p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-600">
              Price per sqm: {formatCurrency(calculatePricePerSqm(leasePrice.value, leasePrice.priceType), leasePrice.currency)}/sqm/month
            </p>
          </div>
        </div>

        {/* Market Lease Price Input */}
        <div>
          <div className="flex gap-2 items-start">
            <div className="flex-1">
              <PriceInput
                label="Market Lease Price"
                value={marketLeasePrice.value}
                currency={marketLeasePrice.currency}
                onChange={(value) => setMarketLeasePrice({ ...marketLeasePrice, value })}
                onCurrencyChange={(currency) => setMarketLeasePrice({ ...marketLeasePrice, currency })}
                showPricePerUnit={false}
              />
            </div>
            <div className="mt-8">
              <select
                value={marketLeasePrice.priceType}
                onChange={(e) => setMarketLeasePrice({ ...marketLeasePrice, priceType: e.target.value as 'monthly' | 'yearly' })}
                className="h-12 w-32 rounded-md border-gray-300 shadow-sm focus:border-[#db4a2b] focus:ring-[#db4a2b] text-base"
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>
          <div className="mt-2 p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-600">
              Price per sqm: {formatCurrency(calculatePricePerSqm(marketLeasePrice.value, marketLeasePrice.priceType), marketLeasePrice.currency)}/sqm/month
            </p>
          </div>
        </div>
      </div>

      {/* Lease Duration Input */}
      <div className="space-y-2">
        <label className="flex items-center text-sm font-medium text-gray-700">
          Lease Duration (Years)
          <button
            type="button"
            className="ml-1 text-gray-400 hover:text-gray-500"
            title="Duration of the lease in years"
          >
            <Info className="h-4 w-4" />
          </button>
        </label>
        <input
          type="number"
          min="1"
          value={duration}
          onChange={(e) => onDurationChange(parseInt(e.target.value) || 1)}
          className="block w-full h-12 rounded-md border-gray-300 shadow-sm focus:border-[#db4a2b] focus:ring-[#db4a2b] text-base"
          placeholder="Enter duration"
        />
      </div>

      <button
        onClick={() => onShowResults(true)}
        className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors"
      >
        Generate Results - Lease
      </button>

      {showResults && (
        <LeaseResultCard
          propertyType={propertyType}
          propertyNumber={propertyNumber}
          initialCurrency={initialCurrency}
          totalPrice={totalPrice}
          monthlyPayment={monthlyPayment}
          totalLeaseCost={totalLeaseCost}
          totalMarketValue={totalMarketValue}
          marketMonthlyPayment={marketMonthlyPayment}
          duration={duration}
          landArea={landArea}
          buildingArea={buildingArea}
          reportName={reportName}
          location={location}
          notes={notes}
          onAuthRequired={() => {}}
          onClearInputs={() => {
            setLeasePrice({ ...leasePrice, value: 0 });
            setMarketLeasePrice({ ...marketLeasePrice, value: 0 });
            onDurationChange(10);
            onShowResults(false);
          }}
        />
      )}
    </div>
  );
}