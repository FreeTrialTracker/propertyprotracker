import { areaUnits } from '../constants/units';

export function convertArea(value: number, fromUnit: string, toUnit: string): number {
  if (fromUnit === toUnit) return value;
  
  const fromUnitData = areaUnits.land.find(u => u.id === fromUnit);
  const toUnitData = areaUnits.land.find(u => u.id === toUnit);

  if (!fromUnitData || !toUnitData) {
    console.warn(`Unit conversion failed: ${fromUnit} to ${toUnit}`);
    return value;
  }

  // Convert to square meters first
  const valueInSqm = value * fromUnitData.conversionToSqM;
  
  // Then convert to target unit
  return valueInSqm / toUnitData.conversionToSqM;
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
  }).format(value);
}