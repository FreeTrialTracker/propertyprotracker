import React from 'react';
import { Download } from 'lucide-react';
import { generatePDF } from '../utils/pdfGenerator';

export function PDFPreview() {
  const handleGeneratePDF = () => {
    const sampleData = {
      propertyType: 'land',
      transactionType: 'buy',
      landArea: {
        column1: { value: 2, unit: 'rai' },
        column2: { value: 1, unit: 'ngan' },
        column3: { value: 50, unit: 'wah' }
      },
      price: {
        value: 5000000,
        currency: 'THB'
      },
      valuation: {
        value: 5200000,
        currency: 'THB'
      }
    };

    generatePDF(sampleData);
  };

  return (
    <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">PDF Generation Test</h2>
      <button
        onClick={handleGeneratePDF}
        className="flex items-center gap-2 px-4 py-2 bg-[#db4a2b] text-white rounded-lg hover:bg-[#c43d21] transition-colors"
      >
        <Download className="w-4 h-4" />
        Generate Sample PDF
      </button>
    </div>
  );
}