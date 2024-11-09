export const areaUnits = {
  land: [
    { id: 'sqm', name: 'Square Meters', shortName: 'm²', conversionToSqM: 1 },
    { id: 'sqkm', name: 'Square Kilometers', shortName: 'km²', conversionToSqM: 1000000 },
    { id: 'sqmi', name: 'Square Miles', shortName: 'sq mi', conversionToSqM: 2589988.11 },
    { id: 'hectare', name: 'Hectares', shortName: 'ha', conversionToSqM: 10000 },
    { id: 'acre', name: 'Acres', shortName: 'ac', conversionToSqM: 4046.856422 },
    { id: 'sqft', name: 'Square Feet', shortName: 'sq ft', conversionToSqM: 0.092903 },
    { id: 'sqyd', name: 'Square Yards', shortName: 'sq yd', conversionToSqM: 0.836127 },
    { id: 'sqin', name: 'Square Inches', shortName: 'sq in', conversionToSqM: 0.00064516 },
    { id: 'sqcm', name: 'Square Centimeters', shortName: 'cm²', conversionToSqM: 0.0001 },
    { id: 'sqmm', name: 'Square Millimeters', shortName: 'mm²', conversionToSqM: 0.000001 },
    { id: 'rai', name: 'Rai', shortName: 'Rai', conversionToSqM: 1600 },
    { id: 'ngan', name: 'Ngan', shortName: 'Ngan', conversionToSqM: 400 },
    { id: 'wah', name: 'Square Wah', shortName: 'Sq.wah', conversionToSqM: 4 }
  ],
  building: [
    { id: 'sqm', name: 'Square Meters', shortName: 'm²', conversionToSqM: 1 },
    { id: 'sqft', name: 'Square Feet', shortName: 'sq ft', conversionToSqM: 0.092903 },
    { id: 'sqyd', name: 'Square Yards', shortName: 'sq yd', conversionToSqM: 0.836127 },
    { id: 'sqin', name: 'Square Inches', shortName: 'sq in', conversionToSqM: 0.00064516 },
    { id: 'sqcm', name: 'Square Centimeters', shortName: 'cm²', conversionToSqM: 0.0001 },
    { id: 'sqmm', name: 'Square Millimeters', shortName: 'mm²', conversionToSqM: 0.000001 }
  ]
} as const;