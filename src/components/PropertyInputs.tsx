import React from 'react';
import { AreaInput } from './AreaInput';
import { convertToSquareMeters } from '../utils/calculations';
import type { AreaUnit } from '../types';
import { useCalculatorStore } from '../store/calculatorStore';

interface PropertyInputsProps {
  type: 'land' | 'building';
  index: number;
}

export function PropertyInputs({ type, index }: PropertyInputsProps) {
  const property = useCalculatorStore(state => state.properties[index]);
  const updateProperty = useCalculatorStore(state => state.updateProperty);
  const activeProperties = useCalculatorStore(state => state.activeProperties);

  if (!property) return null;

  const getLandTotalSqm = () => {
    return convertToSquareMeters(
      {
        value: property.landArea.column1.value || 0,
        unit: property.landArea.column1.unit
      },
      {
        value: property.landArea.column2.value || 0,
        unit: property.landArea.column2.unit
      },
      {
        value: property.landArea.column3.value || 0,
        unit: property.landArea.column3.unit
      }
    );
  };

  const getBuildingTotalSqm = () => {
    return convertToSquareMeters(
      {
        value: property.buildingArea.column1.value || 0,
        unit: property.buildingArea.column1.unit
      },
      {
        value: property.buildingArea.column2.value || 0,
        unit: property.buildingArea.column2.unit
      },
      {
        value: property.buildingArea.column3.value || 0,
        unit: property.buildingArea.column3.unit
      }
    );
  };

  const propertyNumber = activeProperties.indexOf(index) + 1;

  return (
    <div className="space-y-6">
      {type === 'land' && (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Enter Property Details - Land {propertyNumber}</h3>
          <AreaInput
            type="land"
            primaryUnit={{
              value: property.landArea.column1.value,
              unit: property.landArea.column1.unit
            }}
            secondaryUnit={{
              value: property.landArea.column2.value,
              unit: property.landArea.column2.unit
            }}
            tertiaryUnit={{
              value: property.landArea.column3.value,
              unit: property.landArea.column3.unit
            }}
            pricePerUnit={{
              value: property.price.value,
              unit: property.price.selectedUnit
            }}
            onPrimaryUnitChange={(unit) => updateProperty(index, {
              landArea: {
                ...property.landArea,
                column1: { value: unit.value, unit: unit.unit }
              }
            })}
            onSecondaryUnitChange={(unit) => updateProperty(index, {
              landArea: {
                ...property.landArea,
                column2: { value: unit.value, unit: unit.unit }
              }
            })}
            onTertiaryUnitChange={(unit) => updateProperty(index, {
              landArea: {
                ...property.landArea,
                column3: { value: unit.value, unit: unit.unit }
              }
            })}
            onPriceUnitChange={(unit) => updateProperty(index, {
              price: { ...property.price, selectedUnit: unit }
            })}
          />
          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <p className="text-sm font-medium text-gray-900">
              Total Area (A): {getLandTotalSqm().toFixed(2)} sqm
            </p>
          </div>
        </div>
      )}

      {type === 'building' && (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Enter Property Details - Property {propertyNumber}</h3>
          <AreaInput
            type="building"
            primaryUnit={{
              value: property.buildingArea.column1.value,
              unit: property.buildingArea.column1.unit
            }}
            secondaryUnit={{
              value: property.buildingArea.column2.value,
              unit: property.buildingArea.column2.unit
            }}
            tertiaryUnit={{
              value: property.buildingArea.column3.value,
              unit: property.buildingArea.column3.unit
            }}
            pricePerUnit={{
              value: property.price.value,
              unit: property.price.selectedUnit
            }}
            onPrimaryUnitChange={(unit) => updateProperty(index, {
              buildingArea: {
                ...property.buildingArea,
                column1: { value: unit.value, unit: unit.unit }
              }
            })}
            onSecondaryUnitChange={(unit) => updateProperty(index, {
              buildingArea: {
                ...property.buildingArea,
                column2: { value: unit.value, unit: unit.unit }
              }
            })}
            onTertiaryUnitChange={(unit) => updateProperty(index, {
              buildingArea: {
                ...property.buildingArea,
                column3: { value: unit.value, unit: unit.unit }
              }
            })}
            onPriceUnitChange={(unit) => updateProperty(index, {
              price: { ...property.price, selectedUnit: unit }
            })}
          />
          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <p className="text-sm font-medium text-gray-900">
              Total Area (A1): {getBuildingTotalSqm().toFixed(2)} sqm
            </p>
          </div>
        </div>
      )}
    </div>
  );
}