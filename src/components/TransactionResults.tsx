import React, { useState, useEffect } from 'react';
import { Share2, Download } from 'lucide-react';
import { ResultBox } from './ResultBox';
import { CurrencySelector } from './CurrencySelector';
import { convertCurrency } from '../utils/currencyConversion';
import { useCurrency } from '../contexts/CurrencyContext';
import type { PropertyType, TransactionType } from '../types';

interface TransactionResultsProps {
  type: TransactionType;
  propertyType: PropertyType;
  propertyNumber: number;
  initialValues: {
    price: number;
    currency: string;
    [key: string]: any;
  };
  onGeneratePDF: (currency: string) => void;
}

export function TransactionResults({
  type,
  propertyType,
  propertyNumber,
  initialValues,
  onGeneratePDF
}: TransactionResultsProps) {
  const { currency: contextCurrency, setCurrency } = useCurrency();
  const [showResults, setShowResults] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(initialValues.currency);
  const [convertedValues, setConvertedValues] = useState(initialValues);

  useEffect(() => {
    setSelectedCurrency(initialValues.currency);
  }, [initialValues.currency]);

  useEffect(() => {
    const updateConvertedValues = async () => {
      const newValues: { [key: string]: number } = {};
      for (const [key, value] of Object.entries(initialValues)) {
        if (typeof value === 'number') {
          newValues[key] = await convertCurrency(value, initialValues.currency, selectedCurrency);
        }
      }
      setConvertedValues({ ...initialValues, ...newValues, currency: selectedCurrency });
    };

    updateConvertedValues();
  }, [selectedCurrency, initialValues]);

  const handleCurrencyChange = (newCurrency: string) => {
    setSelectedCurrency(newCurrency);
    setCurrency(newCurrency);
  };

  const handleShare = (platform: string) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Check out this ${type} calculation on PropertyProTracker!`);
    
    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
        break;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const handleDownload = () => {
    onGeneratePDF(selectedCurrency);
  };

  return (
    <div className="mt-8">
      <button
        onClick={() => setShowResults(true)}
        className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors"
      >
        Generate Results - {type.charAt(0).toUpperCase() + type.slice(1)}
      </button>

      {showResults && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">
              Property {propertyNumber} - {type.charAt(0).toUpperCase() + type.slice(1)} Results
            </h3>
            <div className="flex gap-4">
              <div className="relative">
                <button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="flex items-center gap-2 px-4 py-2 text-[#db4a2b] border border-[#db4a2b] rounded-lg hover:bg-[#db4a2b] hover:text-white transition-colors"
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </button>
                {showShareMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border">
                    <button
                      onClick={() => handleShare('facebook')}
                      className="flex items-center w-full px-4 py-2 hover:bg-gray-50"
                    >
                      Facebook
                    </button>
                    <button
                      onClick={() => handleShare('linkedin')}
                      className="flex items-center w-full px-4 py-2 hover:bg-gray-50"
                    >
                      LinkedIn
                    </button>
                    <button
                      onClick={() => handleShare('twitter')}
                      className="flex items-center w-full px-4 py-2 hover:bg-gray-50"
                    >
                      X (Twitter)
                    </button>
                  </div>
                )}
              </div>
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
            {Object.entries(convertedValues).map(([key, value], index) => {
              if (key === 'currency') return null;
              return (
                <ResultBox
                  key={index}
                  title={key.split(/(?=[A-Z])/).join(' ')}
                  value={value}
                  currency={selectedCurrency}
                  info={`${key} for ${propertyType}`}
                  showCurrencyConverter={index === 0}
                  onCurrencyChange={handleCurrencyChange}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}