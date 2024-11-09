import React, { useState, useEffect } from 'react';
import { areaUnits } from '../constants/units';
import { currencies } from '../constants/currencies';
import { convertArea } from '../utils/calculations';
import { convertCurrency } from '../utils/currencyConversion';

interface AreaInput {
  value: number;
  unit: string;
}

interface Price {
  value: number;
  currency: string;
  priceType: 'total' | 'per-unit';
  selectedUnit: string;
}

export function AreaConverter() {
  // Area conversion state
  const [areaInputs, setAreaInputs] = useState<AreaInput[]>([
    { value: 0, unit: 'sqm' },
    { value: 0, unit: 'sqm' },
    { value: 0, unit: 'sqm' }
  ]);
  const [totalSqm, setTotalSqm] = useState(0);
  const [convertToUnit, setConvertToUnit] = useState('sqm');
  const [convertedArea, setConvertedArea] = useState(0);

  // Price calculation state
  const [price, setPrice] = useState<Price>({
    value: 0,
    currency: 'USD',
    priceType: 'total',
    selectedUnit: 'sqm'
  });
  const [convertedCurrency, setConvertedCurrency] = useState('USD');
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [convertedPrice, setConvertedPrice] = useState(0);

  // Calculate total area and converted values
  useEffect(() => {
    const total = areaInputs.reduce((sum, input) => {
      const areaInSqm = convertArea(input.value, input.unit, 'sqm');
      return sum + areaInSqm;
    }, 0);
    setTotalSqm(total);

    const converted = convertArea(total, 'sqm', convertToUnit);
    setConvertedArea(converted);
  }, [areaInputs, convertToUnit]);

  // Calculate prices
  useEffect(() => {
    if (price.priceType === 'total') {
      setCalculatedPrice(price.value);
    } else {
      const areaInSelectedUnit = convertArea(totalSqm, 'sqm', price.selectedUnit);
      setCalculatedPrice(price.value * areaInSelectedUnit);
    }
  }, [price, totalSqm]);

  // Convert currency
  useEffect(() => {
    const convert = async () => {
      const converted = await convertCurrency(calculatedPrice, price.currency, convertedCurrency);
      setConvertedPrice(converted);
    };
    convert();
  }, [calculatedPrice, price.currency, convertedCurrency]);

  const handleAreaInputChange = (index: number, value: number) => {
    const newInputs = [...areaInputs];
    newInputs[index] = { ...newInputs[index], value };
    setAreaInputs(newInputs);
  };

  const handleAreaUnitChange = (index: number, unit: string) => {
    const newInputs = [...areaInputs];
    newInputs[index] = { ...newInputs[index], unit };
    setAreaInputs(newInputs);
  };

  const handleReset = () => {
    setAreaInputs([
      { value: 0, unit: 'sqm' },
      { value: 0, unit: 'sqm' },
      { value: 0, unit: 'sqm' }
    ]);
    setPrice({
      value: 0,
      currency: 'USD',
      priceType: 'total',
      selectedUnit: 'sqm'
    });
    setConvertToUnit('sqm');
    setConvertedCurrency('USD');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8 mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#db4a2b]">Quick Area And Currency Conversion</h2>
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-[#db4a2b] text-white rounded-lg hover:bg-[#c43d21] transition-colors"
        >
          Reset Converter
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column - Area Inputs */}
        <div className="space-y-6">
          {/* Area Input Fields */}
          {areaInputs.map((input, index) => (
            <div key={index} className="flex gap-4">
              <input
                type="number"
                value={input.value || ''}
                onChange={(e) => handleAreaInputChange(index, parseFloat(e.target.value) || 0)}
                className="flex-1 px-4 py-2 border rounded-md focus:ring-[#db4a2b] focus:border-[#db4a2b]"
                placeholder={`Area ${index + 1}`}
              />
              <select
                value={input.unit}
                onChange={(e) => handleAreaUnitChange(index, e.target.value)}
                className="w-32 px-4 py-2 border rounded-md focus:ring-[#db4a2b] focus:border-[#db4a2b]"
              >
                {areaUnits.land.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.shortName}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        {/* Right Column - Price Inputs */}
        <div className="space-y-6">
          <div className="flex gap-4">
            <select
              value={price.priceType}
              onChange={(e) => setPrice({ ...price, priceType: e.target.value as 'total' | 'per-unit' })}
              className="w-40 px-4 py-2 border rounded-md focus:ring-[#db4a2b] focus:border-[#db4a2b]"
            >
              <option value="total">Total Price</option>
              <option value="per-unit">Price per Unit</option>
            </select>
            <select
              value={price.currency}
              onChange={(e) => setPrice({ ...price, currency: e.target.value })}
              className="w-32 px-4 py-2 border rounded-md focus:ring-[#db4a2b] focus:border-[#db4a2b]"
            >
              {currencies.map((curr) => (
                <option key={curr.code} value={curr.code}>
                  {curr.code}
                </option>
              ))}
            </select>
            {price.priceType === 'per-unit' && (
              <select
                value={price.selectedUnit}
                onChange={(e) => setPrice({ ...price, selectedUnit: e.target.value })}
                className="w-32 px-4 py-2 border rounded-md focus:ring-[#db4a2b] focus:border-[#db4a2b]"
              >
                {areaUnits.land.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.shortName}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={price.value.toLocaleString() || ''}
              onChange={(e) => {
                const value = parseFloat(e.target.value.replace(/,/g, '')) || 0;
                setPrice({ ...price, value });
              }}
              className="flex-1 px-4 py-2 border rounded-md focus:ring-[#db4a2b] focus:border-[#db4a2b]"
              placeholder="Enter price"
            />
            {price.priceType === 'per-unit' && (
              <span className="text-gray-600 whitespace-nowrap">
                per {areaUnits.land.find(u => u.id === price.selectedUnit)?.shortName}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        {/* Left Column - Area Results */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold">Total Area: {totalSqm.toFixed(2)} sqm</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Convert Area to:</span>
              <select
                value={convertToUnit}
                onChange={(e) => setConvertToUnit(e.target.value)}
                className="w-32 px-4 py-2 border rounded-md focus:ring-[#db4a2b] focus:border-[#db4a2b]"
              >
                {areaUnits.land.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.shortName}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <p className="text-lg">
            Converted Area: {convertedArea.toFixed(2)} {convertToUnit}
          </p>
        </div>

        {/* Right Column - Price Results */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold">
              Calculated Price: {calculatedPrice.toLocaleString()} {price.currency}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Convert Price to:</span>
              <select
                value={convertedCurrency}
                onChange={(e) => setConvertedCurrency(e.target.value)}
                className="w-32 px-4 py-2 border rounded-md focus:ring-[#db4a2b] focus:border-[#db4a2b]"
              >
                {currencies.map((curr) => (
                  <option key={curr.code} value={curr.code}>
                    {curr.code}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <p className="text-lg">
            Converted Price: {convertedPrice.toLocaleString()} {convertedCurrency}
          </p>
        </div>
      </div>
    </div>
  );
}