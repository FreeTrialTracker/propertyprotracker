import jsPDF from 'jspdf';
import type { PropertyType, TransactionType } from '../types';

interface PDFData {
  reportName?: string;
  location?: string;
  propertyType: PropertyType;
  transactionType: TransactionType;
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
    priceType?: 'total' | 'per-unit';
    selectedUnit?: string;
  };
  valuation?: {
    value: number;
    currency: string;
    priceType?: 'total' | 'per-unit';
    selectedUnit?: string;
  };
  mortgageConfig?: {
    downPayment: {
      value: number;
      currency: string;
    };
    interestRate: number;
    loanTermYears: number;
    isCompoundInterest: boolean;
    monthlyPayment: number;
    totalInterest: number;
    totalAmount: number;
    principalAmount: number;
  };
  leaseConfig?: {
    duration: number;
    totalCost: number;
    marketTotalCost: number;
    monthlyPayment: number;
    marketMonthlyPayment: number;
  };
}

function formatAreaMeasurement(area: { value: number; unit: string }) {
  return `${area.value} ${area.unit}`;
}

function formatCurrency(value: number, currency: string) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

export function generatePDF(data: PDFData) {
  const doc = new jsPDF();
  const lineHeight = 10;
  let yPosition = 20;
  const leftColumn = 20;
  const rightColumn = 110;
  const maxWidth = 80;

  // Helper function to add text with word wrap
  const addText = (text: string, x: number, y: number, maxWidth: number) => {
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, x, y);
    return lines.length * lineHeight;
  };

  // Title and Date
  doc.setFontSize(16);
  doc.text('Land and House Tracker Report', leftColumn, yPosition);
  yPosition += lineHeight;
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, leftColumn, yPosition);
  yPosition += lineHeight * 2;

  // Reset font size
  doc.setFontSize(12);

  // Report Info
  if (data.reportName) {
    doc.text(`Report Name: ${data.reportName}`, leftColumn, yPosition);
    yPosition += lineHeight;
  }
  if (data.location) {
    doc.text(`GPS Location: ${data.location}`, leftColumn, yPosition);
    yPosition += lineHeight;
  }

  yPosition += lineHeight;

  // Property Details
  doc.text('Property Details:', leftColumn, yPosition);
  yPosition += lineHeight;
  doc.text(`Type: ${data.propertyType.charAt(0).toUpperCase() + data.propertyType.slice(1)}`, leftColumn, yPosition);
  yPosition += lineHeight;
  doc.text(`Transaction: ${data.transactionType.charAt(0).toUpperCase() + data.transactionType.slice(1)}`, leftColumn, yPosition);
  yPosition += lineHeight * 1.5;

  // Area Information
  if (data.propertyType === 'land' || data.propertyType === 'both') {
    doc.text('Land Area:', leftColumn, yPosition);
    yPosition += lineHeight;
    doc.text(`Primary: ${formatAreaMeasurement(data.landArea!.column1)}`, leftColumn, yPosition);
    yPosition += lineHeight;
    doc.text(`Secondary: ${formatAreaMeasurement(data.landArea!.column2)}`, leftColumn, yPosition);
    yPosition += lineHeight;
    doc.text(`Tertiary: ${formatAreaMeasurement(data.landArea!.column3)}`, leftColumn, yPosition);
    yPosition += lineHeight * 1.5;
  }

  if (data.propertyType === 'building' || data.propertyType === 'both') {
    const xPos = data.propertyType === 'both' ? rightColumn : leftColumn;
    const startY = data.propertyType === 'both' ? yPosition - (lineHeight * 6) : yPosition;
    
    doc.text('Building Area:', xPos, startY);
    doc.text(`Primary: ${formatAreaMeasurement(data.buildingArea!.column1)}`, xPos, startY + lineHeight);
    doc.text(`Secondary: ${formatAreaMeasurement(data.buildingArea!.column2)}`, xPos, startY + (lineHeight * 2));
    doc.text(`Tertiary: ${formatAreaMeasurement(data.buildingArea!.column3)}`, xPos, startY + (lineHeight * 3));
    
    if (data.propertyType !== 'both') {
      yPosition += lineHeight * 4.5;
    }
  }

  yPosition += lineHeight;

  // Transaction Details
  doc.text('Transaction Details:', leftColumn, yPosition);
  yPosition += lineHeight;

  if (data.price.priceType && data.price.selectedUnit) {
    doc.text(`Price Type: ${data.price.priceType === 'total' ? 'Total Price' : 'Price per Unit'}`, leftColumn, yPosition);
    yPosition += lineHeight;
    if (data.price.priceType === 'per-unit') {
      doc.text(`Unit: ${data.price.selectedUnit}`, leftColumn, yPosition);
      yPosition += lineHeight;
    }
  }

  // Financial Details
  doc.text('Financial Details:', leftColumn, yPosition);
  yPosition += lineHeight;

  switch (data.transactionType) {
    case 'mortgage':
      if (data.mortgageConfig) {
        const mortgageDetails = [
          `Purchase Price: ${formatCurrency(data.price.value, data.price.currency)}`,
          `Principal Loan Amount: ${formatCurrency(data.mortgageConfig.principalAmount, data.price.currency)}`,
          `Down Payment: ${formatCurrency(data.mortgageConfig.downPayment.value, data.mortgageConfig.downPayment.currency)}`,
          `Interest Rate: ${data.mortgageConfig.interestRate}%`,
          `Loan Term: ${data.mortgageConfig.loanTermYears} years`,
          `Interest Type: ${data.mortgageConfig.isCompoundInterest ? 'Compound' : 'Simple'}`,
          `Monthly Payment: ${formatCurrency(data.mortgageConfig.monthlyPayment, data.price.currency)}`,
          `Total Interest: ${formatCurrency(data.mortgageConfig.totalInterest, data.price.currency)}`,
          `Total Amount: ${formatCurrency(data.mortgageConfig.totalAmount, data.price.currency)}`
        ];

        mortgageDetails.forEach(detail => {
          yPosition += addText(detail, leftColumn, yPosition, maxWidth);
        });
      }
      break;

    case 'lease':
      if (data.leaseConfig) {
        const leaseDetails = [
          `Monthly Payment: ${formatCurrency(data.leaseConfig.monthlyPayment, data.price.currency)}`,
          `Market Monthly Rate: ${formatCurrency(data.leaseConfig.marketMonthlyPayment, data.price.currency)}`,
          `Lease Duration: ${data.leaseConfig.duration} years`,
          `Total Lease Cost: ${formatCurrency(data.leaseConfig.totalCost, data.price.currency)}`,
          `Total Market Value: ${formatCurrency(data.leaseConfig.marketTotalCost, data.price.currency)}`
        ];

        leaseDetails.forEach(detail => {
          yPosition += addText(detail, leftColumn, yPosition, maxWidth);
        });
      }
      break;

    default:
      doc.text(`Price: ${formatCurrency(data.price.value, data.price.currency)}`, leftColumn, yPosition);
      yPosition += lineHeight;
      if (data.valuation) {
        doc.text(`Market Value: ${formatCurrency(data.valuation.value, data.valuation.currency)}`, leftColumn, yPosition);
        yPosition += lineHeight;
        
        const difference = data.valuation.value - data.price.value;
        const percentageDiff = (difference / data.price.value) * 100;
        doc.text(`Difference: ${formatCurrency(Math.abs(difference), data.price.currency)} (${Math.abs(percentageDiff).toFixed(2)}%)`, leftColumn, yPosition);
        yPosition += lineHeight;
        doc.text(`Status: ${difference > 0 ? 'Above' : 'Below'} market value`, leftColumn, yPosition);
      }
  }

  // Footer
  yPosition = doc.internal.pageSize.height - 20;
  doc.setFontSize(10);
  doc.text('Generated by Land and House Tracker', leftColumn, yPosition);
  doc.text('www.landandhousetracker.com', leftColumn, yPosition + lineHeight);

  // Save the PDF
  doc.save(`property-${data.transactionType}-report.pdf`);
}