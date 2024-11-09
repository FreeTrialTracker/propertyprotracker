import React from 'react';
import { AreaInput } from './AreaInput';
import { convertToSquareMeters } from '../utils/calculations';
import type { AreaUnit } from '../types';

interface PropertyInputsProps {
  type: 'land' | 'building' | 'both';
  landArea: {
    column1: { value: number; unit: string };
    column2: { value: number; unit: string };
    column3: { value: number; unit: string };
  };
  buildingArea: {
    column1: { value: number; unit: string };
    column2: { value: number; unit: string };
    column3: { value: number; unit: string };
  };
  onLandAreaChange: (area: any) => void;
  onBuildingAreaChange: (area: any) => void;
}

export function PropertyInputs({
  type,
  landArea,
  buildingArea,
  onLandAreaChange,
  onBuildingAreaChange
}: PropertyInputsProps) {
  const getLandTotalSqm = () => {
    return convertToSquareMeters(
      {
        value: landArea.column1.value || 0,
        unit: landArea.column1.unit
      },
      {
        value: landArea.column2.value || 0,
        unit: landArea.column2.unit
      },
      {
        value: landArea.column3.value || 0,
        unit: landArea.column3.unit
      }
    );
  };

  const getBuildingTotalSqm = () => {
    return convertToSquareMeters(
      {
        value: buildingArea.column1.value || 0,
        unit: buildingArea.column1.unit
      },
      {
        value: buildingArea.column2.value || 0,
        unit: buildingArea.column2.unit
      },
      {
        value: buildingArea.column3.value || 0,
        unit: buildingArea.column3.unit
      }
    );
  };

  return (
    <div className="space-y-6">
      {(type === 'land' || type === 'both') && (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Land Area</h3>
          <AreaInput
            type="land"
            primaryUnit={{
              value: landArea.column1.value,
              unit: landArea.column1.unit
            }}
            secondaryUnit={{
              value: landArea.column2.value,
              unit: landArea.column2.unit
            }}
            tertiaryUnit={{
              value: landArea.column3.value,
              unit: landArea.column3.unit
            }}
            onPrimaryUnitChange={(unit) => onLandAreaChange({
              ...landArea,
              column1: { value: unit.value, unit: unit.unit }
            })}
            onSecondaryUnitChange={(unit) => onLandAreaChange({
              ...landArea,
              column2: { value: unit.value, unit: unit.unit }
            })}
            onTertiaryUnitChange={(unit) => onLandAreaChange({
              ...landArea,
              column3: { value: unit.value, unit: unit.unit }
            })}
          />
          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <p className="text-sm font-medium text-gray-900">
              Total Area (A): {getLandTotalSqm().toFixed(2)} sqm
            </p>
          </div>
        </div>
      )}

      {(type === 'building' || type === 'both') && (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Building Area</h3>
          <AreaInput
            type="building"
            primaryUnit={{
              value: buildingArea.column1.value,
              unit: buildingArea.column1.unit
            }}
            secondaryUnit={{
              value: buildingArea.column2.value,
              unit: buildingArea.column2.unit
            }}
            tertiaryUnit={{
              value: buildingArea.column3.value,
              unit: buildingArea.column3.unit
            }}
            onPrimaryUnitChange={(unit) => onBuildingAreaChange({
              ...buildingArea,
              column1: { value: unit.value, unit: unit.unit }
            })}
            onSecondaryUnitChange={(unit) => onBuildingAreaChange({
              ...buildingArea,
              column2: { value: unit.value, unit: unit.unit }
            })}
            onTertiaryUnitChange={(unit) => onBuildingAreaChange({
              ...buildingArea,
              column3: { value: unit.value, unit: unit.unit }
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