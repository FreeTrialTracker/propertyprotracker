import { jsPDF } from 'jspdf';
import type { PropertyType, TransactionType } from '../types';

interface ComparisonPDFData {
  properties: any[];
  propertyType: PropertyType;
  transactionType: TransactionType;
}

export function generateComparisonPDF({ properties, propertyType, transactionType }: ComparisonPDFData) {
  const doc = new jsPDF();
  const margin = 10;
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const contentWidth = pageWidth - (margin * 2);
  const boxWidth = contentWidth / 4 - 3;
  const boxHeight = 20;
  const boxGap = 3;

  // Title
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Property Pro Tracker - Comparison Report', margin, margin);

  // Subtitle
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, margin, margin + 5);
  doc.text(`Type: ${propertyType.charAt(0).toUpperCase() + propertyType.slice(1)}`, margin, margin + 9);
  doc.text(`Transaction: ${transactionType.charAt(0).toUpperCase() + transactionType.slice(1)}`, margin, margin + 13);

  let startY = margin + 18;

  properties.forEach((property, propertyIndex) => {
    let results = [];

    if (transactionType === 'buy-sell') {
      const totalArea = property.totalArea || 0;
      const pricePerUnit = property.pricePerUnit || 0;
      const totalValue = property.totalValue || 0;
      const marketValue = property.marketValue || 0;
      const valueDifference = marketValue - totalValue;
      const percentageDiff = totalValue > 0 ? (valueDifference / totalValue) * 100 : 0;

      results = [
        {
          title: 'Total Area',
          value: `${totalArea} sqm`,
          info: `Total ${propertyType} area`
        },
        {
          title: 'Price per Unit',
          value: formatCurrency(pricePerUnit, property.price?.currency || 'USD'),
          info: 'Price per square meter'
        },
        {
          title: 'Total Price',
          value: formatCurrency(property.price?.value || 0, property.price?.currency || 'USD'),
          info: `Total ${propertyType} price`
        },
        {
          title: 'Total Value',
          value: formatCurrency(totalValue, property.price?.currency || 'USD'),
          info: `Total ${propertyType} value`
        },
        {
          title: 'Market Value',
          value: formatCurrency(marketValue, property.valuation?.currency || property.price?.currency || 'USD'),
          info: 'Market value based on current rates'
        },
        {
          title: 'Value Difference',
          value: `${formatCurrency(Math.abs(valueDifference), property.price?.currency || 'USD')} (${Math.abs(percentageDiff).toFixed(1)}%)`,
          info: valueDifference > 0 ? 'Above market value' : 'Below market value',
          type: valueDifference > 0 ? 'positive' : 'negative'
        }
      ];
    } else if (transactionType === 'lease') {
      const totalPrice = property.totalPrice || 0;
      const monthlyPayment = property.monthlyPayment || 0;
      const totalLeaseCost = property.totalLeaseCost || 0;
      const marketMonthlyRate = property.marketMonthlyRate || 0;
      const leaseReturn = totalPrice > 0 ? (totalLeaseCost / totalPrice) * 100 : 0;
      const valueDifference = totalLeaseCost - (marketMonthlyRate * 12);
      const percentageDiff = marketMonthlyRate > 0 ? (valueDifference / (marketMonthlyRate * 12)) * 100 : 0;

      results = [
        {
          title: 'Total Price',
          value: formatCurrency(totalPrice, property.price?.currency || 'USD'),
          info: 'Total property price'
        },
        {
          title: 'Monthly Payment',
          value: formatCurrency(monthlyPayment, property.price?.currency || 'USD'),
          info: 'Your monthly lease payment'
        },
        {
          title: 'Total Lease Cost',
          value: formatCurrency(totalLeaseCost, property.price?.currency || 'USD'),
          info: 'Total cost over lease term'
        },
        {
          title: 'Market Monthly Rate',
          value: formatCurrency(marketMonthlyRate, property.price?.currency || 'USD'),
          info: 'Current market monthly rate'
        },
        {
          title: 'Lease Return',
          value: `${leaseReturn.toFixed(1)}%`,
          info: 'Lease cost as percentage of property price',
          type: leaseReturn >= 100 ? 'negative' : 'positive'
        },
        {
          title: 'Value Difference',
          value: `${formatCurrency(Math.abs(valueDifference), property.price?.currency || 'USD')} (${Math.abs(percentageDiff).toFixed(1)}%)`,
          info: valueDifference > 0 ? 'Above market value' : 'Below market value',
          type: valueDifference > 0 ? 'negative' : 'positive'
        }
      ];
    } else if (transactionType === 'mortgage') {
      const purchasePrice = property.purchasePrice || 0;
      const downPayment = property.downPayment || 0;
      const principalLoanAmount = property.principalLoanAmount || 0;
      const monthlyPayment = property.monthlyPayment || 0;
      const totalInterest = property.totalInterest || 0;
      const interestRate = property.interestRate || 0;
      const loanTermYears = property.loanTermYears || 0;

      results = [
        {
          title: 'Purchase Price',
          value: formatCurrency(purchasePrice, property.price?.currency || 'USD'),
          info: 'Total property purchase price'
        },
        {
          title: 'Down Payment',
          value: formatCurrency(downPayment, property.price?.currency || 'USD'),
          info: 'Initial payment amount'
        },
        {
          title: 'Principal Loan Amount',
          value: formatCurrency(principalLoanAmount, property.price?.currency || 'USD'),
          info: 'Purchase price minus down payment'
        },
        {
          title: 'Monthly Payment',
          value: formatCurrency(monthlyPayment, property.price?.currency || 'USD'),
          info: `Based on ${property.isCompoundInterest ? 'compound' : 'simple'} interest`
        },
        {
          title: 'Interest/Term',
          value: `${interestRate}% / ${loanTermYears} years`,
          info: `${property.isCompoundInterest ? 'Compound' : 'Simple'} interest over loan term`
        },
        {
          title: 'Total Interest',
          value: formatCurrency(totalInterest, property.price?.currency || 'USD'),
          info: `Total interest over ${loanTermYears} years`,
          type: 'negative'
        }
      ];
    }

    // Property Header
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(`Property ${propertyIndex + 1}`, margin, startY);
    startY += 5;

    // Draw results
    results.forEach((result, index) => {
      const col = index % 4;
      const row = Math.floor(index / 4);
      const x = margin + (col * (boxWidth + boxGap));
      const y = startY + (row * (boxHeight + 3));

      // Box outline
      doc.setDrawColor(220);
      doc.setLineWidth(0.1);

      // Background for positive/negative values
      if (result.type) {
        doc.setFillColor(
          result.type === 'positive' ? 240 : 255,
          result.type === 'positive' ? 255 : 240,
          result.type === 'positive' ? 240 : 240
        );
        doc.rect(x, y, boxWidth, boxHeight, 'F');
      }

      doc.rect(x, y, boxWidth, boxHeight);

      // Title
      doc.setFontSize(6);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0);
      doc.text(result.title, x + 2, y + 4);

      // Value
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.text(result.value.toString(), x + 2, y + 10);

      // Info
      doc.setFontSize(5);
      doc.setTextColor(100);
      doc.text(result.info, x + 2, y + 15);
      doc.setTextColor(0);
    });

    startY += Math.ceil(results.length / 4) * (boxHeight + 3) + 8;

    // Add separator line between properties
    if (propertyIndex < properties.length - 1) {
      doc.setDrawColor(200);
      doc.setLineWidth(0.5);
      doc.line(margin, startY - 4, pageWidth - margin, startY - 4);
    }
  });

  // Footer
  doc.setFontSize(6);
  doc.setFont('helvetica', 'normal');
  doc.text('Generated by Property Pro Tracker', margin, pageHeight - 5);
  doc.text(new Date().toLocaleString(), pageWidth - margin - 40, pageHeight - 5, { align: 'right' });

  // Generate filename
  const prefix = propertyType === 'land' ? 'Land' : 'Property';
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `${prefix}-${transactionType}-Comparison-${timestamp}.pdf`;

  // Save the PDF
  doc.save(filename);
}

function formatCurrency(value: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}