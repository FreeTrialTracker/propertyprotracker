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

interface Step {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function HowToUse({ propertyType }: HowToUseProps) {
  const getSteps = (): Step[] => {
    switch (propertyType) {
      case 'land':
        return [
          {
            icon: <MapPin className="h-6 w-6" />,
            title: 'Enter Land Details',
            description: 'Use our **land purchase calculator** to input land measurements and specifications'
          },
          {
            icon: <DollarSign className="h-6 w-6" />,
            title: 'Calculate Value',
            description: 'Our **land lease calculator** helps determine fair market values'
          },
          {
            icon: <Calculator className="h-6 w-6" />,
            title: 'Review Terms',
            description: 'The **land mortgage payment calculator** provides detailed payment schedules'
          },
          {
            icon: <Share2 className="h-6 w-6" />,
            title: 'Generate Report',
            description: 'Get comprehensive land valuation analysis and documentation'
          }
        ];
      case 'building':
        return [
          {
            icon: <Building2 className="h-6 w-6" />,
            title: 'Property Details',
            description: 'Use our **Property payment calculator** to assess building specifications'
          },
          {
            icon: <DollarSign className="h-6 w-6" />,
            title: 'Lease Analysis',
            description: 'The **Property lease calculator** helps evaluate rental terms'
          },
          {
            icon: <Calculator className="h-6 w-6" />,
            title: 'Mortgage Options',
            description: 'Our **Property mortgage payment calculator** shows financing scenarios'
          },
          {
            icon: <Download className="h-6 w-6" />,
            title: 'Export Results',
            description: 'Download detailed property analysis reports'
          }
        ];
      case 'both':
        return [
          {
            icon: <Home className="h-6 w-6" />,
            title: 'Complete Assessment',
            description: 'Use our **land loans calculator** for comprehensive property evaluation'
          },
          {
            icon: <DollarSign className="h-6 w-6" />,
            title: 'Combined Analysis',
            description: 'The **land lease calculator** provides total property insights'
          },
          {
            icon: <Calculator className="h-6 w-6" />,
            title: 'Financial Planning',
            description: 'Our **mortgage calculator land** tool shows complete payment details'
          },
          {
            icon: <Share2 className="h-6 w-6" />,
            title: 'Full Report',
            description: 'Generate comprehensive property and land analysis'
          }
        ];
      default:
        return [];
    }
  };

  const getTitle = (): string => {
    switch (propertyType) {
      case 'land':
        return 'How to Use - Land Calculator';
      case 'building':
        return 'How to Use - Property Calculator';
      case 'both':
        return 'How to Use - Land & Property Calculator';
      default:
        return 'How to Use';
    }
  };

  const formatDescription = (description: string): string => {
    return description.replace(/\*\*(.*?)\*\*/g, '$1');
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
              <p className="text-sm text-gray-500 text-center">{formatDescription(step.description)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}