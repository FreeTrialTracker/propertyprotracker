export interface AreaUnit {
  value: number;
  unit: string;
}

export function convertToSquareMeters(
  primaryUnit: AreaUnit,
  secondaryUnit: AreaUnit,
  tertiaryUnit: AreaUnit
): number {
  const conversions = {
    rai: 1600,
    ngan: 400,
    wah: 4,
    sqm: 1
  };

  const primary = (primaryUnit?.value || 0) * (conversions[primaryUnit?.unit as keyof typeof conversions] || 1);
  const secondary = (secondaryUnit?.value || 0) * (conversions[secondaryUnit?.unit as keyof typeof conversions] || 1);
  const tertiary = (tertiaryUnit?.value || 0) * (conversions[tertiaryUnit?.unit as keyof typeof conversions] || 1);

  return primary + secondary + tertiary;
}

export function calculatePricePerSqm(
  value: number,
  priceType: 'total' | 'per-unit',
  unit: string,
  totalArea: number
): number {
  if (!value || value <= 0) return 0;
  
  const conversions = {
    rai: 1600,
    ngan: 400,
    wah: 4,
    sqm: 1
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
      rai: 1600,
      ngan: 400,
      wah: 4,
      sqm: 1
    };

    const conversionRate = conversions[unit as keyof typeof conversions] || 1;
    const pricePerSqm = value / conversionRate;
    return pricePerSqm * totalArea;
  }

  return value;
}

export function formatCurrency(value: number, currency: string = 'THB'): string {
  if (isNaN(value) || !value) return `${currency} 0.00`;
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

export function calculateTotalValue(totalAreaSqm: number, pricePerSqm: number): number {
  if (!totalAreaSqm || !pricePerSqm || totalAreaSqm <= 0 || pricePerSqm <= 0) return 0;
  return totalAreaSqm * pricePerSqm;
}

export function calculateMonthlyPayment(
  principal: number,
  interestRate: number,
  loanTermYears: number,
  isCompoundInterest: boolean
): number {
  if (!principal || !interestRate || !loanTermYears) return 0;

  if (isCompoundInterest) {
    // Compound Interest (Amortizing Loan)
    const monthlyRate = interestRate / 12 / 100;
    const numberOfPayments = loanTermYears * 12;
    const factor = Math.pow(1 + monthlyRate, numberOfPayments);
    return principal * (monthlyRate * factor) / (factor - 1);
  } else {
    // Simple Interest
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