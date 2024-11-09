import React, { useState, useEffect } from 'react';
import { PriceInput } from './PriceInput';
import { MortgageInputs } from './MortgageInputs';
import { LeaseInputs } from './LeaseInputs';
import { convertToSquareMeters, calculatePricePerSqm, calculateTotalPrice, formatCurrency } from '../utils/calculations';
import { priceUnits } from '../constants/units';
import type { PropertyType, TransactionType } from '../types';
import { useCalculatorStore } from '../store/calculatorStore';

interface TransactionInputsProps {
  type: TransactionType;
  propertyType: PropertyType;
  index: number;
  reportName: string;
  location: string;
  notes: string;
}

export function TransactionInputs({
  type,
  propertyType,
  index,
  reportName,
  location,
  notes
}: TransactionInputsProps) {
  const property = useCalculatorStore(state => state.properties[index]);
  const updateProperty = useCalculatorStore(state => state.updateProperty);
  const activeProperties = useCalculatorStore(state => state.activeProperties);

  const [leaseDuration, setLeaseDuration] = useState(10);
  const [showLeaseResults, setShowLeaseResults] = useState(false);
  const [additionalExpenses, setAdditionalExpenses] = useState([0, 0, 0, 0, 0, 0]);

  const propertyNumber = activeProperties.indexOf(index) + 1;

  if (!property) return null;

  const totalLandAreaSqm = React.useMemo(() => 
    property.landArea ? convertToSquareMeters(
      property.landArea.column1,
      property.landArea.column2,
      property.landArea.column3
    ) : 0,
    [property.landArea]
  );

  const totalBuildingAreaSqm = React.useMemo(() => 
    property.buildingArea ? convertToSquareMeters(
      property.buildingArea.column1,
      property.buildingArea.column2,
      property.buildingArea.column3
    ) : 0,
    [property.buildingArea]
  );

  const getTotalArea = () => {
    switch (propertyType) {
      case 'land':
        return totalLandAreaSqm;
      case 'building':
        return totalBuildingAreaSqm;
      default:
        return 0;
    }
  };

  const handlePriceCurrencyChange = (newCurrency: string) => {
    updateProperty(index, {
      price: { ...property.price, currency: newCurrency }
    });
  };

  const totalAdditionalExpenses = additionalExpenses.reduce((sum, expense) => sum + expense, 0);

  const handleExpenseChange = (index: number, value: number) => {
    const newExpenses = [...additionalExpenses];
    newExpenses[index] = value;
    setAdditionalExpenses(newExpenses);
  };

  // Update total value in property store whenever price or additional expenses change
  useEffect(() => {
    const totalArea = getTotalArea();
    const basePrice = calculateTotalPrice(
      property.price.value,
      property.price.priceType,
      property.price.selectedUnit,
      totalArea
    );
    const totalValue = basePrice + totalAdditionalExpenses;

    updateProperty(index, {
      price: {
        ...property.price,
        totalValue: totalValue // Store the total value including additional expenses
      }
    });
  }, [property.price.value, property.price.priceType, property.price.selectedUnit, totalAdditionalExpenses]);

  const renderPriceSection = (title: string, totalArea: number) => {
    const pricePerSqm = calculatePricePerSqm(
      property.price.value,
      property.price.priceType,
      property.price.selectedUnit,
      totalArea
    );

    const totalPrice = calculateTotalPrice(
      property.price.value,
      property.price.priceType,
      property.price.selectedUnit,
      totalArea
    );

    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
        <div className="space-y-6">
          <div>
            <PriceInput
              label="Purchase Price"
              value={property.price.value}
              currency={property.price.currency}
              priceType={property.price.priceType}
              selectedUnit={property.price.selectedUnit}
              availableUnits={priceUnits[propertyType]}
              showPricePerUnit={true}
              onChange={(value) => updateProperty(index, {
                price: { ...property.price, value }
              })}
              onCurrencyChange={handlePriceCurrencyChange}
              onPriceTypeChange={(priceType) => updateProperty(index, {
                price: { ...property.price, priceType }
              })}
              onUnitChange={(selectedUnit) => updateProperty(index, {
                price: { ...property.price, selectedUnit }
              })}
            />
            <div className="mt-2 p-3 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-600">
                Total Area: {totalArea.toFixed(2)} sqm
              </p>
              <p className="text-sm text-gray-600">
                Price per sqm: {formatCurrency(pricePerSqm, property.price.currency)}/sqm
              </p>
              <p className="text-sm text-gray-600">
                Base Price: {formatCurrency(totalPrice, property.price.currency)}
              </p>
            </div>
          </div>

          <div>
            <PriceInput
              label="Current Market Value"
              value={property.valuation.value}
              currency={property.valuation.currency}
              priceType={property.valuation.priceType}
              selectedUnit={property.valuation.selectedUnit}
              availableUnits={priceUnits[propertyType]}
              showPricePerUnit={true}
              onChange={(value) => updateProperty(index, {
                valuation: { ...property.valuation, value }
              })}
              onCurrencyChange={(currency) => updateProperty(index, {
                valuation: { ...property.valuation, currency }
              })}
              onPriceTypeChange={(priceType) => updateProperty(index, {
                valuation: { ...property.valuation, priceType }
              })}
              onUnitChange={(selectedUnit) => updateProperty(index, {
                valuation: { ...property.valuation, selectedUnit }
              })}
            />
          </div>

          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">Additional Estimated Expenses</h4>
            <div className="grid grid-cols-3 gap-4">
              {additionalExpenses.slice(0, 3).map((expense, idx) => (
                <div key={idx}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expense {idx + 1}
                  </label>
                  <PriceInput
                    label=""
                    value={expense}
                    currency={property.price.currency}
                    onChange={(value) => handleExpenseChange(idx, value)}
                    onCurrencyChange={() => {}} // Currency follows Purchase Price
                    showPricePerUnit={false}
                  />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4">
              {additionalExpenses.slice(3, 6).map((expense, idx) => (
                <div key={idx + 3}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expense {idx + 4}
                  </label>
                  <PriceInput
                    label=""
                    value={expense}
                    currency={property.price.currency}
                    onChange={(value) => handleExpenseChange(idx + 3, value)}
                    onCurrencyChange={() => {}} // Currency follows Purchase Price
                    showPricePerUnit={false}
                  />
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-gray-50 rounded-md">
              <p className="text-sm font-medium text-gray-900">
                Total Additional Expenses: {formatCurrency(totalAdditionalExpenses, property.price.currency)}
              </p>
              <p className="text-sm font-medium text-gray-900">
                Total Value: {formatCurrency(totalPrice + totalAdditionalExpenses, property.price.currency)}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {propertyType === 'land' && (
        renderPriceSection(
          `Enter Price Details - Land ${propertyNumber}`,
          totalLandAreaSqm
        )
      )}

      {propertyType === 'building' && (
        renderPriceSection(
          `Enter Price Details - Property ${propertyNumber}`,
          totalBuildingAreaSqm
        )
      )}

      {type === 'mortgage' && (
        <MortgageInputs
          purchasePrice={property.price.totalValue || (calculateTotalPrice(
            property.price.value,
            property.price.priceType,
            property.price.selectedUnit,
            getTotalArea()
          ) + totalAdditionalExpenses)}
          propertyType={propertyType}
          propertyNumber={propertyNumber}
          initialCurrency={property.price.currency}
          landArea={property.landArea}
          buildingArea={property.buildingArea}
          reportName={reportName}
          location={location}
          notes={notes}
        />
      )}
      
      {type === 'lease' && (
        <LeaseInputs 
          totalArea={getTotalArea()}
          propertyType={propertyType}
          totalPrice={property.price.totalValue || (calculateTotalPrice(
            property.price.value,
            property.price.priceType,
            property.price.selectedUnit,
            getTotalArea()
          ) + totalAdditionalExpenses)}
          propertyNumber={propertyNumber}
          initialCurrency={property.price.currency}
          landArea={property.landArea}
          buildingArea={property.buildingArea}
          duration={leaseDuration}
          onDurationChange={setLeaseDuration}
          showResults={showLeaseResults}
          onShowResults={setShowLeaseResults}
          reportName={reportName}
          location={location}
          notes={notes}
        />
      )}
    </div>
  );
}

export default TransactionInputs;