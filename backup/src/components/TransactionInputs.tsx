import React from 'react';
import { PriceInput } from './PriceInput';
import { MortgageInputs } from './MortgageInputs';
import { LeaseInputs } from './LeaseInputs';
import { convertToSquareMeters, calculatePricePerSqm, calculateTotalPrice, formatCurrency } from '../utils/calculations';
import type { PropertyType, TransactionType } from '../types';

interface TransactionInputsProps {
  type: TransactionType;
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
  price: {
    value: number;
    currency: string;
    priceType: 'total' | 'per-unit';
    selectedUnit: string;
  };
  valuation: {
    value: number;
    currency: string;
    priceType: 'total' | 'per-unit';
    selectedUnit: string;
  };
  reportName: string;
  location: string;
  onPriceChange: (value: number) => void;
  onPriceCurrencyChange: (currency: string) => void;
  onPriceTypeChange: (type: 'total' | 'per-unit') => void;
  onPriceUnitChange: (unit: string) => void;
  onValuationChange: (value: number) => void;
  onValuationCurrencyChange: (currency: string) => void;
  onValuationTypeChange: (type: 'total' | 'per-unit') => void;
  onValuationUnitChange: (unit: string) => void;
}

export function TransactionInputs({
  type,
  propertyType,
  landArea,
  buildingArea,
  price,
  valuation,
  reportName,
  location,
  onPriceChange,
  onPriceCurrencyChange,
  onPriceTypeChange,
  onPriceUnitChange,
  onValuationChange,
  onValuationCurrencyChange,
  onValuationTypeChange,
  onValuationUnitChange
}: TransactionInputsProps) {
  const totalLandAreaSqm = React.useMemo(() => 
    landArea ? convertToSquareMeters(landArea.column1, landArea.column2, landArea.column3) : 0,
    [landArea]
  );

  const totalBuildingAreaSqm = React.useMemo(() => 
    buildingArea ? convertToSquareMeters(buildingArea.column1, buildingArea.column2, buildingArea.column3) : 0,
    [buildingArea]
  );

  // Get the appropriate total area based on property type
  const getTotalArea = () => {
    switch (propertyType) {
      case 'land':
        return totalLandAreaSqm;
      case 'building':
        return totalBuildingAreaSqm;
      case 'both':
        return totalLandAreaSqm + totalBuildingAreaSqm;
      default:
        return 0;
    }
  };

  const availableUnits = [
    { value: 'rai', label: 'Rai' },
    { value: 'ngan', label: 'Ngan' },
    { value: 'wah', label: 'Sq.wah' },
    { value: 'sqm', label: 'Sq.m' }
  ];

  const renderPriceSection = (
    title: string,
    totalArea: number,
    priceValue: number,
    valuationValue: number,
    sectionKey: string
  ) => {
    const totalPrice = calculateTotalPrice(priceValue, price.priceType, price.selectedUnit, totalArea);
    const pricePerSqm = calculatePricePerSqm(priceValue, price.priceType, price.selectedUnit, totalArea);

    return (
      <div key={sectionKey} className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
        <div className="space-y-6">
          <div>
            <PriceInput
              label="Purchase Price"
              value={priceValue}
              currency={price.currency}
              priceType={price.priceType}
              selectedUnit={price.selectedUnit}
              availableUnits={availableUnits}
              showPricePerUnit={true}
              onChange={onPriceChange}
              onCurrencyChange={onPriceCurrencyChange}
              onPriceTypeChange={onPriceTypeChange}
              onUnitChange={onPriceUnitChange}
            />
            <div className="mt-2 p-3 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-600">
                Total Area: {totalArea.toFixed(2)} sqm
              </p>
              <p className="text-sm text-gray-600">
                Price per sqm: {formatCurrency(pricePerSqm, price.currency)}/sqm
              </p>
              <p className="text-sm text-gray-600">
                Total Price (B): {formatCurrency(totalPrice, price.currency)}
              </p>
            </div>
          </div>

          <div>
            <PriceInput
              label="Current Market Value"
              value={valuationValue}
              currency={valuation.currency}
              priceType={valuation.priceType}
              selectedUnit={valuation.selectedUnit}
              availableUnits={availableUnits}
              showPricePerUnit={true}
              onChange={onValuationChange}
              onCurrencyChange={onValuationCurrencyChange}
              onPriceTypeChange={onValuationTypeChange}
              onUnitChange={onValuationUnitChange}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {propertyType === 'land' && (
        renderPriceSection(
          'Enter Price Details - Land',
          totalLandAreaSqm,
          price.value,
          valuation.value,
          'land-section'
        )
      )}

      {propertyType === 'building' && (
        renderPriceSection(
          'Enter Price Details - Building',
          totalBuildingAreaSqm,
          price.value,
          valuation.value,
          'building-section'
        )
      )}

      {propertyType === 'both' && (
        <>
          {renderPriceSection(
            'Enter Price Details - Land',
            totalLandAreaSqm,
            price.value,
            valuation.value,
            'land-section'
          )}
          {renderPriceSection(
            'Enter Price Details - Building',
            totalBuildingAreaSqm,
            price.value,
            valuation.value,
            'building-section'
          )}
        </>
      )}

      {type === 'mortgage' && (
        <MortgageInputs
          purchasePrice={calculateTotalPrice(
            price.value,
            price.priceType,
            price.selectedUnit,
            propertyType === 'building' ? totalBuildingAreaSqm : totalLandAreaSqm
          )}
          downPayment={{ value: 0, currency: price.currency }}
          interestRate={0}
          loanTermYears={30}
          isCompoundInterest={true}
          onDownPaymentChange={() => {}}
          onDownPaymentCurrencyChange={() => {}}
          onInterestRateChange={() => {}}
          onLoanTermChange={() => {}}
          onInterestTypeChange={() => {}}
          propertyType={propertyType}
          landArea={landArea}
          buildingArea={buildingArea}
          reportName={reportName}
          location={location}
        />
      )}
      
      {type === 'lease' && (
        <LeaseInputs 
          totalArea={getTotalArea()} 
          propertyType={propertyType}
          landArea={landArea}
          buildingArea={buildingArea}
          reportName={reportName}
          location={location}
        />
      )}
    </div>
  );
}