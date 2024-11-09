import { currencies } from '../constants/currencies';

export function formatNumber(value: number | string, decimals: number = 2): string {
  const numValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
  return Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    useGrouping: true,
    style: 'decimal'
  }).format(numValue);
}

export function parseFormattedNumber(value: string): number {
  return parseFloat(value.replace(/,/g, '')) || 0;
}

export function formatCurrencyWithSymbol(value: number | string, currencyCode: string): string {
  const numValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
  const currency = currencies.find(c => c.code === currencyCode);
  const symbol = currencyCode === 'THB' ? 'THB ' : (currency?.symbol || currencyCode);
  
  const formattedNumber = Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true,
    style: 'decimal'
  }).format(numValue);
  
  return `${symbol}${formattedNumber}`;
}

export function formatAreaValue(value: number | string, unit: string): string {
  const numValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
  const formattedNumber = Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true,
    style: 'decimal'
  }).format(numValue);
  
  return `${formattedNumber} ${unit}`;
}

export function formatCurrencyLocale(value: number | string, currencyCode: string): string {
  const numValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
  return Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true
  }).format(numValue);
}