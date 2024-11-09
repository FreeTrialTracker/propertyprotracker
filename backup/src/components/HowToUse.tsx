import React from 'react';
import {
  MapPin,
  Building2,
  Home,
  DollarSign,
  Calculator,
  Share2,
  Download,
  HelpCircle
} from 'lucide-react';
import type { PropertyType } from '../types';

interface HowToUseProps {
  propertyType: PropertyType;
}

export function HowToUse({ propertyType }: HowToUseProps) {
  const getSteps = () => {
    switch (propertyType) {
      case 'land':
        return [
          {
            icon: <MapPin className="h-6 w-6" />,
            title: 'Enter Land Area',
            description: 'Input area in Rai, Ngan, and Square Wah'
          },
          {
            icon: <DollarSign className="h-6 w-6" />,
            title: 'Set Price Details',
            description: 'Enter total price or price per unit'
          },
          {
            icon: <Calculator className="h-6 w-6" />,
            title: 'Market Valuation',
            description: 'Compare with current market prices'
          },
          {
            icon: <Share2 className="h-6 w-6" />,
            title: 'Generate Report',
            description: 'View detailed land valuation analysis'
          }
        ];
      case 'building':
        return [
          {
            icon: <Building2 className="h-6 w-6" />,
            title: 'Enter Building Area',
            description: 'Input built-up area measurements'
          },
          {
            icon: <DollarSign className="h-6 w-6" />,
            title: 'Building Value',
            description: 'Enter construction or purchase cost'
          },
          {
            icon: <Calculator className="h-6 w-6" />,
            title: 'Compare Values',
            description: 'Assess against market rates'
          },
          {
            icon: <Download className="h-6 w-6" />,
            title: 'Save Results',
            description: 'Download detailed building report'
          }
        ];
      case 'both':
        return [
          {
            icon: <Home className="h-6 w-6" />,
            title: 'Property Details',
            description: 'Enter both land and building measurements'
          },
          {
            icon: <DollarSign className="h-6 w-6" />,
            title: 'Combined Valuation',
            description: 'Set prices for land and structure'
          },
          {
            icon: <Calculator className="h-6 w-6" />,
            title: 'Total Assessment',
            description: 'Get combined property valuation'
          },
          {
            icon: <Share2 className="h-6 w-6" />,
            title: 'Complete Report',
            description: 'View comprehensive property analysis'
          }
        ];
    }
  };

  const getTitle = () => {
    switch (propertyType) {
      case 'land':
        return 'How to Use - Land';
      case 'building':
        return 'How to Use - Building';
      case 'both':
        return 'How to Use - Land & Building';
    }
  };

  const steps = getSteps();

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">{getTitle()}</h2>
          <p className="mt-4 text-lg text-gray-600">
            Follow these steps to calculate your property values
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative flex flex-col items-center p-6 bg-white rounded-lg shadow-sm"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#db4a2b]/10 text-[#db4a2b] mb-4">
                {step.icon}
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">{step.title}</h3>
              <p className="text-sm text-gray-500 text-center">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}