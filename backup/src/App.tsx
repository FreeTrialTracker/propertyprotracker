import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { PropertyTypeSelector } from './components/PropertyTypeSelector';
import { TransactionTypeSelector } from './components/TransactionTypeSelector';
import { PropertyInputs } from './components/PropertyInputs';
import { TransactionInputs } from './components/TransactionInputs';
import { ResultsSection } from './components/ResultsSection';
import { HowToUse } from './components/HowToUse';
import { FAQ } from './components/FAQ';
import { ReportHeader } from './components/ReportHeader';
import type { PropertyType, TransactionType } from './types';

function Calculator() {
  const [propertyType, setPropertyType] = useState<PropertyType>('land');
  const [transactionType, setTransactionType] = useState<TransactionType>('buy');
  const [reportName, setReportName] = useState('');
  const [location, setLocation] = useState('');
  const [landArea, setLandArea] = useState({
    column1: { value: 0, unit: 'rai' },
    column2: { value: 0, unit: 'ngan' },
    column3: { value: 0, unit: 'wah' }
  });
  const [buildingArea, setBuildingArea] = useState({
    column1: { value: 0, unit: 'sqm' },
    column2: { value: 0, unit: 'meters-cm' },
    column3: { value: 0, unit: 'meters-cm-mm' }
  });
  const [price, setPrice] = useState({
    value: 0,
    currency: 'THB',
    priceType: 'total' as const,
    selectedUnit: 'rai'
  });
  const [valuation, setValuation] = useState({
    value: 0,
    currency: 'THB',
    priceType: 'total' as const,
    selectedUnit: 'rai'
  });

  const handleNewReport = () => {
    setPropertyType('land');
    setTransactionType('buy');
    setReportName('');
    setLocation('');
    setLandArea({
      column1: { value: 0, unit: 'rai' },
      column2: { value: 0, unit: 'ngan' },
      column3: { value: 0, unit: 'wah' }
    });
    setBuildingArea({
      column1: { value: 0, unit: 'sqm' },
      column2: { value: 0, unit: 'meters-cm' },
      column3: { value: 0, unit: 'meters-cm-mm' }
    });
    setPrice({
      value: 0,
      currency: 'THB',
      priceType: 'total',
      selectedUnit: 'rai'
    });
    setValuation({
      value: 0,
      currency: 'THB',
      priceType: 'total',
      selectedUnit: 'rai'
    });
  };

  return (
    <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <ReportHeader 
          reportName={reportName}
          location={location}
          onReportNameChange={setReportName}
          onLocationChange={setLocation}
          onNewReport={handleNewReport}
        />
        
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Property Calculator</h1>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">1. Select Property Type</h2>
              <PropertyTypeSelector
                value={propertyType}
                onChange={setPropertyType}
              />
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">2. Select Transaction Type</h2>
              <TransactionTypeSelector
                value={transactionType}
                onChange={setTransactionType}
              />
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">3. Enter Property Details</h2>
              <PropertyInputs
                type={propertyType}
                landArea={landArea}
                buildingArea={buildingArea}
                onLandAreaChange={setLandArea}
                onBuildingAreaChange={setBuildingArea}
              />
            </section>

            <section className="mb-8">
              <TransactionInputs
                type={transactionType}
                propertyType={propertyType}
                landArea={landArea}
                buildingArea={buildingArea}
                price={price}
                valuation={valuation}
                onPriceChange={(value) => setPrice({ ...price, value })}
                onPriceCurrencyChange={(currency) => setPrice({ ...price, currency })}
                onPriceTypeChange={(priceType) => setPrice({ ...price, priceType })}
                onPriceUnitChange={(selectedUnit) => setPrice({ ...price, selectedUnit })}
                onValuationChange={(value) => setValuation({ ...valuation, value })}
                onValuationCurrencyChange={(currency) => setValuation({ ...valuation, currency })}
                onValuationTypeChange={(priceType) => setValuation({ ...valuation, priceType })}
                onValuationUnitChange={(selectedUnit) => setValuation({ ...valuation, selectedUnit })}
                reportName={reportName}
                location={location}
              />
            </section>

            {transactionType !== 'lease' && (
              <ResultsSection
                data={{
                  reportName,
                  location,
                  propertyType,
                  transactionType,
                  landArea,
                  buildingArea,
                  price,
                  valuation
                }}
              />
            )}
          </div>
        </div>

        <HowToUse propertyType={propertyType} />
        <FAQ propertyType={propertyType} />
      </div>
    </main>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Calculator />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;