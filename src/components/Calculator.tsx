import React, { useState } from 'react';
import { PropertyTypeSelector } from './PropertyTypeSelector';
import { TransactionTypeSelector } from './TransactionTypeSelector';
import { PropertyInputs } from './PropertyInputs';
import { TransactionInputs } from './TransactionInputs';
import { PageLinks } from './PageLinks';
import { AuthModal } from './auth/AuthModal';
import { useCalculatorStore } from '../store/calculatorStore';
import { PropertyResultsSection } from './results/PropertyResultsSection';
import { ReportHeader } from './ReportHeader';
import type { PropertyType, TransactionType } from '../types';

const Calculator = () => {
  const [propertyType, setPropertyType] = useState<PropertyType>('land');
  const [transactionType, setTransactionType] = useState<TransactionType>('buy-sell');
  const [reportName, setReportName] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showResultsMap, setShowResultsMap] = useState<{[key: number]: boolean}>({});

  const {
    properties,
    activeProperties,
    addProperty,
    clearProperty,
    resetStore,
    updateAllProperties,
    defaultUnits,
    toggleDefaultUnits
  } = useCalculatorStore();

  const handleNewReport = () => {
    setPropertyType('land');
    setTransactionType('buy-sell');
    setReportName('');
    setLocation('');
    setNotes('');
    setShowResultsMap({});

    if (defaultUnits?.isActive) {
      toggleDefaultUnits();
    }

    resetStore();

    updateAllProperties({
      landArea: {
        column1: { unit: 'sqm' },
        column2: { unit: 'sqm' },
        column3: { unit: 'sqm' }
      },
      buildingArea: {
        column1: { unit: 'sqm' },
        column2: { unit: 'sqm' },
        column3: { unit: 'sqm' }
      },
      price: {
        currency: 'USD',
        priceType: 'total',
        selectedUnit: 'sqm'
      },
      valuation: {
        currency: 'USD',
        priceType: 'total',
        selectedUnit: 'sqm'
      }
    });
  };

  const handlePropertyTypeChange = (newType: PropertyType) => {
    setPropertyType(newType);
    resetStore();
    setShowResultsMap({});
  };

  const handleAuthRequired = () => {
    setShowAuthModal(true);
  };

  const handleAddProperty = () => {
    if (activeProperties.length < 4) {
      addProperty();
    }
  };

  const handleClearProperty = (index: number) => {
    clearProperty(index);
    setShowResultsMap(prev => {
      const updated = { ...prev };
      delete updated[index];
      return updated;
    });
  };

  return (
    <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <ReportHeader
          reportName={reportName}
          location={location}
          notes={notes}
          onReportNameChange={setReportName}
          onLocationChange={setLocation}
          onNotesChange={setNotes}
          onNewReport={handleNewReport}
          onAuthRequired={handleAuthRequired}
        />

        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Property Calculator</h1>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">1. Select Property Type</h2>
              <PropertyTypeSelector value={propertyType} onChange={handlePropertyTypeChange} />
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">2. Select Transaction Type</h2>
              <TransactionTypeSelector value={transactionType} onChange={setTransactionType} />
            </section>

            {activeProperties.map((propertyIndex) => (
              <section key={`property-section-${propertyIndex}`} className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    3. Enter Property Details
                  </h2>
                  {propertyIndex === 0 && (
                    <button
                      onClick={() => toggleDefaultUnits()}
                      className="px-4 py-2 text-[#db4a2b] border border-[#db4a2b] rounded-lg hover:bg-[#db4a2b] hover:text-white transition-colors"
                    >
                      Set as Default Units
                    </button>
                  )}
                </div>
                <PropertyInputs
                  type={propertyType}
                  index={propertyIndex}
                />
                <TransactionInputs
                  type={transactionType}
                  propertyType={propertyType}
                  index={propertyIndex}
                  reportName={reportName}
                  location={location}
                  notes={notes}
                />

                {!showResultsMap[propertyIndex] && transactionType === 'buy-sell' && (
                  <button
                    onClick={() => setShowResultsMap(prev => ({ ...prev, [propertyIndex]: true }))}
                    className="w-full mt-6 bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    Generate Results - Property {propertyIndex + 1}
                  </button>
                )}

                {showResultsMap[propertyIndex] && transactionType === 'buy-sell' && (
                  <PropertyResultsSection
                    propertyType={propertyType}
                    propertyNumber={propertyIndex + 1}
                    landArea={properties[propertyIndex].landArea}
                    buildingArea={properties[propertyIndex].buildingArea}
                    price={{
                      ...properties[propertyIndex].price,
                      totalValue: properties[propertyIndex].price.totalValue
                    }}
                    valuation={properties[propertyIndex].valuation}
                    additionalExpenses={properties[propertyIndex].additionalExpenses}
                    onAuthRequired={handleAuthRequired}
                    onClearProperty={() => handleClearProperty(propertyIndex)}
                    reportName={reportName}
                    location={location}
                    notes={notes}
                  />
                )}
              </section>
            ))}

            {activeProperties.length < 4 && (
              <button
                onClick={handleAddProperty}
                className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Property
              </button>
            )}
          </div>
        </div>

        <PageLinks />
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </main>
  );
};

export default Calculator;