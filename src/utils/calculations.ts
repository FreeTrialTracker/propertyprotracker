import { areaUnits } from '../constants/units';
import type { AreaUnit } from '../types';

export function convertToSquareMeters(
  primaryUnit: AreaUnit,
  secondaryUnit: AreaUnit,
  tertiaryUnit: AreaUnit
): number {
  const conversions = {
    sqm: 1,
    sqkm: 1000000,
    sqmi: 2589988.11,
    hectare: 10000,
    acre: 4046.856422,
    sqft: 0.092903,
    sqyd: 0.836127,
    sqin: 0.00064516,
    sqcm: 0.0001,
    sqmm: 0.000001,
    rai: 1600,
    ngan: 400,
    wah: 4
  };

  const primary = (primaryUnit?.value || 0) * (conversions[primaryUnit?.unit as keyof typeof conversions] || 1);
  const secondary = (secondaryUnit?.value || 0) * (conversions[secondaryUnit?.unit as keyof typeof conversions] || 1);
  const tertiary = (tertiaryUnit?.value || 0) * (conversions[tertiaryUnit?.unit as keyof typeof conversions] || 1);

  return primary + secondary + tertiary;
}

export function convertArea(value: number, fromUnit: string, toUnit: string): number {
  if (fromUnit === toUnit) return value;
  
  const fromUnitData = areaUnits.land.find(u => u.id === fromUnit);
  const toUnitData = areaUnits.land.find(u => u.id === toUnit);

  if (!fromUnitData || !toUnitData) {
    console.warn(`Unit conversion failed: ${fromUnit} to ${toUnit}`);
    return value;
  }

  const valueInSqm = value * fromUnitData.conversionToSqM;
  return valueInSqm / toUnitData.conversionToSqM;
}

export function calculatePricePerSqm(
  value: number,
  priceType: 'total' | 'per-unit',
  unit: string,
  totalArea: number
): number {
  if (!value || value <= 0) return 0;
  
  const conversions = {
    sqm: 1,
    sqkm: 1000000,
    sqmi: 2589988.11,
    hectare: 10000,
    acre: 4046.856422,
    sqft: 0.092903,
    sqyd: 0.836127,
    sqin: 0.00064516,
    sqcm: 0.0001,
    sqmm: 0.000001,
    rai: 1600,
    ngan: 400,
    wah: 4
  };

  if (priceType === 'per-unit') {
    const conversionRate = conversions[unit as keyof typeof conversions] || 1;
    return value / conversionRate;
  }
  
  return totalArea > 0 ? value / totalArea : 0;
}

export function calculateTotalPrice(
  value: number,
  priceType: 'total' | 'per-unit',
  unit: string,
  totalArea: number
): number {
  if (!value || value <= 0) return 0;

  if (priceType === 'per-unit') {
    const conversions = {
      sqm: 1,
      sqkm: 1000000,
      sqmi: 2589988.11,
      hectare: 10000,
      acre: 4046.856422,
      sqft: 0.092903,
      sqyd: 0.836127,
      sqin: 0.00064516,
      sqcm: 0.0001,
      sqmm: 0.000001,
      rai: 1600,
      ngan: 400,
      wah: 4
    };

    const conversionRate = conversions[unit as keyof typeof conversions] || 1;
    const pricePerSqm = value / conversionRate;
    return pricePerSqm * totalArea;
  }

  return value;
}

export function calculateMonthlyPayment(
  principal: number,
  interestRate: number,
  loanTermYears: number,
  isCompoundInterest: boolean
): number {
  if (!principal || !interestRate || !loanTermYears) return 0;

  if (isCompoundInterest) {
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTermYears * 12;
    const numerator = monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments);
    const denominator = Math.pow(1 + monthlyRate, numberOfPayments) - 1;
    return principal * (numerator / denominator);
  } else {
    const annualRate = interestRate / 100;
    const totalInterest = principal * annualRate * loanTermYears;
    const totalAmount = principal + totalInterest;
    return totalAmount / (loanTermYears * 12);
  }
}

export function calculateTotalInterest(
  principal: number,
  monthlyPayment: number,
  loanTermYears: number
): number {
  if (!principal || !monthlyPayment || !loanTermYears) return 0;
  const totalPayments = monthlyPayment * loanTermYears * 12;
  return totalPayments - principal;
}

export function formatCurrency(value: number, currency: string = 'USD'): string {
  if (isNaN(value) || value === undefined) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      currencyDisplay: 'narrowSymbol'
    }).format(0);
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    currencyDisplay: 'narrowSymbol'
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

export function calculateTotalValue(totalAreaSqm: number, pricePerSqm: number): number {
  if (!totalAreaSqm || !pricePerSqm || totalAreaSqm <= 0 || pricePerSqm <= 0) return 0;
  return totalAreaSqm * pricePerSqm;
}