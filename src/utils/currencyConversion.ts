import { currencies } from '../constants/currencies';

// Create conversion rates for all currencies relative to USD as base
const createConversionRates = () => {
  const rates: { [key: string]: number } = {};
  
  // Define base rates relative to USD
  const baseRates = {
    USD: 1,
    EUR: 0.85,
    GBP: 0.73,
    JPY: 110.0,
    CNY: 6.45,
    SGD: 1.35,
    HKD: 7.78,
    AUD: 1.36,
    KRW: 1175.0,
    THB: 35.0,
    CAD: 1.25,
    CHF: 0.92,
    NZD: 1.44,
    INR: 74.5,
    MYR: 4.2,
    AED: 3.67,
    SAR: 3.75,
    BRL: 5.2,
    MXN: 20.0,
    PHP: 50.0
  };

  // Generate all currency pair combinations
  currencies.forEach(fromCurr => {
    currencies.forEach(toCurr => {
      const key = `${fromCurr.code}_${toCurr.code}`;
      // Convert through USD as base
      rates[key] = baseRates[toCurr.code as keyof typeof baseRates] / baseRates[fromCurr.code as keyof typeof baseRates];
    });
  });

  return rates;
};

const conversionRates = createConversionRates();

export async function convertCurrency(amount: number, fromCurrency: string, toCurrency: string): Promise<number> {
  if (fromCurrency === toCurrency) return amount;

  const key = `${fromCurrency}_${toCurrency}`;
  const rate = conversionRates[key] || 1;
  
  return amount * rate;
}