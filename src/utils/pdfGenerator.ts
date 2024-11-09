import { jsPDF } from 'jspdf';
import type { PropertyType, TransactionType } from '../types';

interface PDFData {
  propertyType: PropertyType;
  transactionType: TransactionType;
  isComparison: boolean;
  propertyNumber?: number;
  reportName?: string;
  location?: string;
  notes?: string;
  propertyResults: Array<{
    propertyNumber: number;
    results: Array<{
      title: string;
      value: number | string;
      currency?: string;
      info: string;
      type?: 'positive' | 'negative';
    }>;
  }>;
}

export function generatePDF(data: PDFData) {
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
  doc.text(`Property Pro Tracker - ${data.transactionType.charAt(0).toUpperCase() + data.transactionType.slice(1)}`, margin, margin);

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

  if (data.isComparison && data.propertyResults) {
    // Multiple properties layout with adjusted spacing
    const propertyWidth = (contentWidth - margin) / 2;
    const boxHeight = 12;
    const boxMargin = 2;
    const lineSpacing = 3;
    const rowSpacing = 15;

    data.propertyResults.forEach((property, index) => {
      if (index < 4) {
        const col = index % 2;
        const row = Math.floor(index / 2);
        const x = margin + (col * (propertyWidth + margin));
        const y = currentY + (row * (boxHeight * 6 + margin + (row === 1 ? rowSpacing : 0)));

        // Property header
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(`Property ${property.propertyNumber}`, x, y);
        
        // Results
        let currentBoxY = y + 8;
        property.results.forEach(result => {
          // Background for positive/negative
          if (result.type) {
            doc.setFillColor(result.type === 'positive' ? 240 : 255, 
                           result.type === 'positive' ? 255 : 240, 
                           result.type === 'positive' ? 240 : 240);
            doc.rect(x - 2, currentBoxY - 2, propertyWidth - boxMargin, boxHeight + 4, 'F');
          }

          // Title
          doc.setFontSize(9);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(0);
          doc.text(result.title, x, currentBoxY);

          // Value
          doc.setFont('helvetica', 'normal');
          const displayValue = formatCurrency(result.value, result.currency);
          doc.text(displayValue, x, currentBoxY + lineSpacing);

          // Info
          doc.setFontSize(7);
          doc.setTextColor(100);
          doc.text(result.info, x, currentBoxY + (lineSpacing * 2));
          doc.setTextColor(0);

          currentBoxY += boxHeight + 2;
        });
      }
    });
  } else {
    // Single property layout
    let currentBoxY = currentY + 10;

    if (data.propertyNumber) {
      doc.setFont('helvetica', 'bold');
      doc.text(`Property ${data.propertyNumber} Results`, margin, currentBoxY);
      currentBoxY += 12;
    }

    if (data.propertyResults && data.propertyResults[0]) {
      const results = data.propertyResults[0].results;

      results.forEach((result, index) => {
        const col = index % 3;
        const row = Math.floor(index / 3);
        const x = margin + (col * (boxWidth + boxGap));
        const y = currentBoxY + (row * (boxHeight + 5));

        // Box outline
        doc.setDrawColor(220);
        doc.setLineWidth(0.1);

        // Background for positive/negative
        if (result.type) {
          doc.setFillColor(result.type === 'positive' ? 240 : 255, 
                         result.type === 'positive' ? 255 : 240, 
                         result.type === 'positive' ? 240 : 240);
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
        const displayValue = formatCurrency(result.value, result.currency);
        doc.text(displayValue, x + 5, y + 17);

        // Info
        doc.setFontSize(8);
        doc.setTextColor(100);
        doc.text(result.info, x + 5, y + 25);
        doc.setTextColor(0);
      });
    }
  }

  // Footer
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Generated by Property Pro Tracker', margin, pageHeight - 10);
  doc.text(new Date().toLocaleString(), pageWidth - margin - 40, pageHeight - 10, { align: 'right' });

  // Generate filename
  const prefix = data.propertyType === 'land' ? 'Land' : 'Property';
  const propertyNum = data.propertyNumber ? `-Property${data.propertyNumber}` : '';
  const comparison = data.isComparison ? '-Comparison' : '';
  const timestamp = new Date().toISOString().split('T')[0];
  
  const filename = `${prefix}-${data.transactionType}${propertyNum}${comparison}-${timestamp}.pdf`;
  
  // Save the PDF
  doc.save(filename);
}

function formatCurrency(value: number | string, currency?: string): string {
  if (typeof value === 'string') return value;
  
  if (!currency) return value.toLocaleString('en-US', { maximumFractionDigits: 2 });

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}