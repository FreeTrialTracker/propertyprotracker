import { jsPDF } from 'jspdf';
import type { PropertyType } from '../types';

interface LeasePDFData {
  propertyType: PropertyType;
  propertyNumber: number;
  totalLeaseCost: number;
  totalMarketValue: number;
  currency: string;
  duration: number;
  monthlyPayment: number;
  marketMonthlyPayment: number;
  totalPrice: number;
  reportName?: string;
  location?: string;
  notes?: string;
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
}

export function generateLeasePDF(data: LeasePDFData) {
  const doc = new jsPDF();
  const margin = 20;
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const contentWidth = pageWidth - (margin * 2);
  const boxWidth = contentWidth / 3 - 5;
  const boxHeight = 30;
  const boxGap = 10;

  // Title
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Property Pro Tracker - Lease Report', margin, margin);
  
  // Report Details
  let currentY = margin + 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, margin, currentY);
  currentY += 6;

  if (data.reportName) {
    doc.text(`Report Name: ${data.reportName}`, margin, currentY);
    currentY += 6;
  }

  if (data.location) {
    doc.text(`Location: ${data.location}`, margin, currentY);
    currentY += 6;
  }

  doc.text(`Type: ${data.propertyType.charAt(0).toUpperCase() + data.propertyType.slice(1)}`, margin, currentY);
  currentY += 6;

  // Notes section (if provided)
  if (data.notes) {
    currentY += 4; // Add some extra spacing before notes
    doc.setFont('helvetica', 'bold');
    doc.text('Notes:', margin, currentY);
    currentY += 6;
    
    doc.setFont('helvetica', 'normal');
    const noteLines = doc.splitTextToSize(data.notes, contentWidth);
    doc.text(noteLines, margin, currentY);
    currentY += (noteLines.length * 6) + 4;
  }

  // Property Header
  currentY += 4;
  doc.setFont('helvetica', 'bold');
  doc.text(`Property ${data.propertyNumber} Results`, margin, currentY);
  currentY += 8;

  const results = [
    {
      title: 'Total Price',
      value: formatCurrency(data.totalPrice, data.currency),
      info: 'Total property price'
    },
    {
      title: 'Monthly Payment',
      value: formatCurrency(data.monthlyPayment, data.currency),
      info: 'Your monthly lease payment'
    },
    {
      title: 'Total Lease Cost',
      value: formatCurrency(data.totalLeaseCost, data.currency),
      info: `Total cost over ${data.duration} years`
    },
    {
      title: 'Market Monthly Rate',
      value: formatCurrency(data.marketMonthlyPayment, data.currency),
      info: 'Current market monthly rate'
    },
    {
      title: 'Total Market Value',
      value: formatCurrency(data.totalMarketValue, data.currency),
      info: 'Total market value over lease period'
    }
  ];

  // Calculate value difference
  const difference = data.totalLeaseCost - data.totalMarketValue;
  const percentageDiff = data.totalMarketValue > 0 ? (difference / data.totalMarketValue) * 100 : 0;
  
  results.push({
    title: 'Value Difference',
    value: formatCurrency(Math.abs(difference), data.currency),
    info: `${difference > 0 ? 'Above' : 'Below'} market value`,
    type: difference > 0 ? 'negative' : 'positive'
  });

  // Draw results
  results.forEach((result, index) => {
    const col = index % 3;
    const row = Math.floor(index / 3);
    const x = margin + (col * (boxWidth + boxGap));
    const y = currentY + (row * (boxHeight + 5));

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
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0);
    doc.text(result.title, x + 5, y + 7);

    // Value
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text(result.value.toString(), x + 5, y + 17);

    // Info
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text(result.info, x + 5, y + 25);
    doc.setTextColor(0);
  });

  // Footer
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Generated by Property Pro Tracker', margin, pageHeight - 10);
  doc.text(new Date().toLocaleString(), pageWidth - margin - 40, pageHeight - 10, { align: 'right' });

  // Generate filename
  const prefix = data.propertyType === 'land' ? 'Land' : 'Property';
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `${prefix}-Lease-Property${data.propertyNumber}-${timestamp}.pdf`;
  
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