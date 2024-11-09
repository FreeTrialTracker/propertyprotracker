import React from 'react';
import { formatCurrency } from '../../utils/calculations';
import { Download, Trash2, AlertCircle } from 'lucide-react';
import { useCalculationsStore } from '../../store/calculationsStore';
import { generatePDF } from '../../utils/pdfGenerator';
import { generateLeasePDF } from '../../utils/generateLeasePDF';
import { generateMortgagePDF } from '../../utils/generateMortgagePDF';

interface SavedCalculationsProps {
  calculations: any[];
}

export function SavedCalculations({ calculations }: SavedCalculationsProps) {
  const { deleteCalculation } = useCalculationsStore();
  const MAX_SAVED_CALCULATIONS = 10;

  if (!calculations.length) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <p className="text-gray-600">No saved calculations yet.</p>
      </div>
    );
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this calculation?')) {
      try {
        await deleteCalculation(id);
      } catch (error) {
        console.error('Error deleting calculation:', error);
      }
    }
  };

  const handleDownload = (calc: any) => {
    switch (calc.transactionType) {
      case 'lease':
        generateLeasePDF({
          propertyType: calc.propertyType,
          propertyNumber: calc.propertyNumber,
          totalLeaseCost: calc.totalLeaseCost || 0,
          totalMarketValue: calc.marketTotalValue || 0,
          currency: calc.price?.currency || 'USD',
          duration: calc.duration || 10,
          monthlyPayment: calc.monthlyPayment || 0,
          marketMonthlyPayment: calc.marketMonthlyPayment || 0,
          totalPrice: calc.price?.value || 0,
          landArea: calc.landArea,
          buildingArea: calc.buildingArea,
          reportName: calc.reportName,
          location: calc.location,
          notes: calc.notes
        });
        break;

      case 'mortgage':
        generateMortgagePDF({
          propertyType: calc.propertyType,
          propertyNumber: calc.propertyNumber,
          purchasePrice: calc.price?.value || 0,
          downPayment: calc.downPayment?.value || 0,
          principalLoanAmount: calc.principalLoanAmount || 0,
          interestRate: calc.interestRate || 0,
          loanTermYears: calc.loanTermYears || 30,
          isCompoundInterest: calc.isCompoundInterest || true,
          monthlyPayment: calc.monthlyPayment || 0,
          totalInterest: calc.totalInterest || 0,
          totalAmountPaid: calc.totalAmountPaid || 0,
          currency: calc.price?.currency || 'USD',
          landArea: calc.landArea,
          buildingArea: calc.buildingArea,
          reportName: calc.reportName,
          location: calc.location,
          notes: calc.notes
        });
        break;

      default: // buy-sell
        generatePDF({
          propertyType: calc.propertyType,
          transactionType: calc.transactionType,
          propertyNumber: calc.propertyNumber,
          landArea: calc.landArea,
          buildingArea: calc.buildingArea,
          price: calc.price,
          valuation: calc.valuation,
          propertyResults: [{
            propertyNumber: calc.propertyNumber,
            results: calc.results
          }],
          reportName: calc.reportName,
          location: calc.location,
          notes: calc.notes,
          isComparison: false
        });
        break;
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Date not available';
    
    // Handle Firestore Timestamp
    if (timestamp.seconds) {
      return new Date(timestamp.seconds * 1000).toLocaleDateString();
    }
    
    // Handle string timestamp
    if (typeof timestamp === 'string') {
      return new Date(timestamp).toLocaleDateString();
    }
    
    // Handle Date object
    if (timestamp instanceof Date) {
      return timestamp.toLocaleDateString();
    }
    
    return 'Invalid date';
  };

  const getResults = (calc: any) => {
    // Ensure results is an array
    if (!Array.isArray(calc.results)) {
      // If results is not an array, create a default array with basic information
      return [
        {
          title: 'Total Value',
          value: calc.price?.value || 0,
          currency: calc.price?.currency,
          info: `Total ${calc.propertyType} value`
        }
      ];
    }
    return calc.results;
  };

  return (
    <div className="space-y-4">
      {/* Limit Warning */}
      {calculations.length >= MAX_SAVED_CALCULATIONS && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-yellow-800">Storage Limit Reached</h4>
            <p className="text-sm text-yellow-700 mt-1">
              You have reached the maximum limit of {MAX_SAVED_CALCULATIONS} saved calculations. 
              Please delete some old calculations to save new ones.
            </p>
          </div>
        </div>
      )}

      {/* Calculations List */}
      {calculations.map((calc) => (
        <div key={calc.id} className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {calc.propertyType?.charAt(0).toUpperCase() + calc.propertyType?.slice(1) || 'Property'} - Property {calc.propertyNumber || 'N/A'}
              </h3>
              <p className="text-sm text-gray-500">
                {formatDate(calc.createdAt)}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleDownload(calc)}
                className="p-2 text-[#db4a2b] hover:bg-[#db4a2b]/10 rounded-lg"
                title="Download PDF"
              >
                <Download className="h-5 w-5" />
              </button>
              <button
                onClick={() => handleDelete(calc.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                title="Delete calculation"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {getResults(calc).map((result: any, index: number) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  result.type === 'positive'
                    ? 'border-green-200 bg-green-50'
                    : result.type === 'negative'
                    ? 'border-red-200 bg-red-50'
                    : 'border-gray-200'
                }`}
              >
                <h4 className="text-sm font-medium text-gray-500">{result.title || 'Result'}</h4>
                <p className="mt-1 text-lg font-semibold">
                  {result.currency 
                    ? formatCurrency(result.value || 0, result.currency)
                    : result.unit
                    ? `${result.value || 0} ${result.unit}`
                    : result.value || 0}
                </p>
                <p className="mt-1 text-sm text-gray-500">{result.info || 'No additional information'}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}