import React from 'react';
import { Info } from 'lucide-react';
import { PriceInput } from './PriceInput';
import { formatCurrency } from '../utils/calculations';
import { LeaseResults } from './LeaseResults';
import type { PropertyType } from '../types';

interface LeaseInputsProps {
  totalArea: number;
  propertyType: PropertyType;
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

export function LeaseInputs({ totalArea, propertyType, landArea, buildingArea }: LeaseInputsProps) {
  const [leaseDuration, setLeaseDuration] = React.useState(1);
  const [leasePrice, setLeasePrice] = React.useState({
    value: 0,
    currency: 'THB',
    priceType: 'monthly' as 'monthly' | 'yearly'
  });
  const [marketLeasePrice, setMarketLeasePrice] = React.useState({
    value: 0,
    currency: 'THB',
    priceType: 'monthly' as 'monthly' | 'yearly'
  });

  const calculateMonthlyAmount = (amount: number, type: 'monthly' | 'yearly') => {
    return type === 'yearly' ? amount / 12 : amount;
  };

  const calculateYearlyAmount = (amount: number, type: 'monthly' | 'yearly') => {
    return type === 'monthly' ? amount * 12 : amount;
  };

  const calculatePricePerSqm = (amount: number, type: 'monthly' | 'yearly') => {
    if (!amount || !totalArea) return 0;
    const monthlyAmount = calculateMonthlyAmount(amount, type);
    return monthlyAmount / totalArea;
  };

  const totalLeaseCost = calculateYearlyAmount(leasePrice.value, leasePrice.priceType) * leaseDuration;
  const totalMarketValue = calculateYearlyAmount(marketLeasePrice.value, marketLeasePrice.priceType) * leaseDuration;
  const monthlyPayment = calculateMonthlyAmount(leasePrice.value, leasePrice.priceType);
  const marketMonthlyPayment = calculateMonthlyAmount(marketLeasePrice.value, marketLeasePrice.priceType);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Enter Lease Details</h2>
      
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
          value={leaseDuration}
          onChange={(e) => setLeaseDuration(parseInt(e.target.value) || 1)}
          className="block w-full h-12 rounded-md border-gray-300 shadow-sm focus:border-[#db4a2b] focus:ring-[#db4a2b] text-base"
          placeholder="1"
        />
      </div>

      {/* Summary */}
      <div className="bg-gray-50 p-4 rounded-lg space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Lease Summary</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <p>
                {leasePrice.priceType === 'monthly' ? 'Monthly' : 'Yearly'} Payment:{' '}
                {formatCurrency(leasePrice.value, leasePrice.currency)}
              </p>
              <p>
                Total Lease Cost:{' '}
                {formatCurrency(totalLeaseCost, leasePrice.currency)}
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Market Summary</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <p>
                {marketLeasePrice.priceType === 'monthly' ? 'Monthly' : 'Yearly'} Market Rate:{' '}
                {formatCurrency(marketLeasePrice.value, marketLeasePrice.currency)}
              </p>
              <p>
                Total Market Value:{' '}
                {formatCurrency(totalMarketValue, marketLeasePrice.currency)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <LeaseResults
        totalLeaseCost={totalLeaseCost}
        totalMarketValue={totalMarketValue}
        currency={leasePrice.currency}
        propertyType={propertyType}
        duration={leaseDuration}
        monthlyPayment={monthlyPayment}
        marketMonthlyPayment={marketMonthlyPayment}
        landArea={landArea}
        buildingArea={buildingArea}
      />
    </div>
  );
}