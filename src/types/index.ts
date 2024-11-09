export type PropertyType = 'land' | 'building';
export type TransactionType = 'buy-sell' | 'lease' | 'mortgage';

export interface AreaUnit {
  id: string;
  name: string;
  shortName: string;
  type: 'metric' | 'imperial' | 'thai';
  conversionToSqM: number;
}

export interface Currency {
  code: string;
  symbol: string;
  name: string;
}

export interface PropertyData {
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
    priceType: 'total' | 'per-unit';
    selectedUnit: string;
  };
  valuation?: {
    value: number;
    currency: string;
    priceType: 'total' | 'per-unit';
    selectedUnit: string;
  };
  mortgageConfig?: {
    downPayment: {
      value: number;
      currency: string;
    };
    interestRate: number;
    loanTermYears: number;
    isCompoundInterest: boolean;
  };
  leaseConfig?: {
    duration: number;
    frequency: 'monthly' | 'quarterly' | 'yearly';
    totalCost: number;
    marketTotalCost: number;
  };
}