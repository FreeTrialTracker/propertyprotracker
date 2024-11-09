import React from 'react';
import type { PropertyType } from '../types';

interface FAQProps {
  propertyType: PropertyType;
}

export function FAQ({ propertyType }: FAQProps) {
  const getFAQs = () => {
    switch (propertyType) {
      case 'land':
        return [
          {
            question: 'How do I convert between different land units?',
            answer: 'Our calculator automatically converts between Rai (1600 sqm), Ngan (400 sqm), and Square Wah (4 sqm). Simply enter your measurements in any unit.'
          },
          {
            question: 'What factors affect land valuation?',
            answer: 'Land value is influenced by location, zoning regulations, accessibility, infrastructure development, and market demand.'
          },
          {
            question: 'How accurate are the land price calculations?',
            answer: 'Our calculations are based on your input values and current market rates. For the most accurate assessment, ensure your measurements and market prices are up-to-date.'
          },
          {
            question: 'Can I calculate land lease values?',
            answer: 'Yes, select the "Lease" transaction type to calculate both rental payments and total lease values for your land.'
          },
          {
            question: 'How do I determine market value for my land?',
            answer: 'Research recent sales of similar properties in your area, consult local real estate agents, or use official land valuation data from government sources.'
          },
          {
            question: 'What documentation do I need for land valuation?',
            answer: 'Land title deed, official survey documents, zoning certificates, and recent comparable sales data in your area.'
          },
          {
            question: 'How does location affect land value?',
            answer: 'Prime locations, proximity to amenities, infrastructure development, and future growth potential significantly impact land values.'
          },
          {
            question: 'Can I save my land calculations?',
            answer: 'Yes, you can download detailed reports of your calculations in PDF format or share them directly through various platforms.'
          },
          {
            question: 'How often should I update land valuations?',
            answer: 'It\'s recommended to review land values annually or when significant market changes occur in your area.'
          },
          {
            question: 'What are common land valuation mistakes?',
            answer: 'Overlooking zoning restrictions, ignoring market trends, and incorrect unit conversions are common pitfalls to avoid.'
          }
        ];
      case 'building':
        return [
          {
            question: 'How is building value calculated?',
            answer: 'Building value is calculated based on built-up area, construction quality, age, and current market rates per square meter.'
          },
          {
            question: 'What area measurements are needed?',
            answer: 'Enter the total built-up area including all floors. Our calculator supports various units including square meters and square feet.'
          },
          {
            question: 'Does age affect building value?',
            answer: 'Yes, building age typically affects value through depreciation. Consider this when entering market values.'
          },
          {
            question: 'How do I account for renovations?',
            answer: 'Include recent renovation costs and improvements when calculating the current building value.'
          },
          {
            question: 'What is the depreciation rate for buildings?',
            answer: 'Building depreciation typically ranges from 2-4% annually, depending on construction type and maintenance.'
          },
          {
            question: 'How do I value different building types?',
            answer: 'Different building types (residential, commercial, industrial) have varying valuation methods based on usage and market demands.'
          },
          {
            question: 'What affects building maintenance costs?',
            answer: 'Age, construction quality, usage intensity, and local climate all impact maintenance costs and overall building value.'
          },
          {
            question: 'How to compare building values?',
            answer: 'Compare similar buildings in terms of size, age, location, and specifications for accurate valuations.'
          },
          {
            question: 'What documentation is needed?',
            answer: 'Building permits, floor plans, maintenance records, and recent renovation documentation help in accurate valuation.'
          },
          {
            question: 'How often should I update building values?',
            answer: 'Annual updates are recommended, especially after major renovations or significant market changes.'
          }
        ];
      case 'both':
        return [
          {
            question: 'How is combined property value calculated?',
            answer: 'We calculate separate values for land and building, then combine them while considering market factors and property synergies.'
          },
          {
            question: 'Can I enter different units for land and building?',
            answer: 'Yes, you can use different measurement units for land (Rai, Ngan, Wah) and building (square meters, square feet).'
          },
          {
            question: 'How do I compare with market values?',
            answer: 'Enter current market rates for both land and building separately to get a comprehensive comparison.'
          },
          {
            question: 'What affects total property value?',
            answer: 'Location, land size, building condition, market trends, and property development potential all impact total value.'
          },
          {
            question: 'How to calculate property appreciation?',
            answer: 'Track both land and building values separately, as land typically appreciates while buildings depreciate.'
          },
          {
            question: 'What documentation is required?',
            answer: 'Land title, building permits, floor plans, and recent property assessments are essential for accurate valuation.'
          },
          {
            question: 'How to optimize property value?',
            answer: 'Consider land development potential and building improvements that maximize overall property value.'
          },
          {
            question: 'What reports are available?',
            answer: 'Generate detailed reports showing individual and combined valuations for land and building components.'
          },
          {
            question: 'How often should values be updated?',
            answer: 'Regular updates are recommended, especially when market conditions change or improvements are made.'
          },
          {
            question: 'What are key valuation factors?',
            answer: 'Location, property condition, market trends, development potential, and local regulations all affect total value.'
          }
        ];
    }
  };

  const getTitle = () => {
    switch (propertyType) {
      case 'land':
        return 'Frequently Asked Questions - Land';
      case 'building':
        return 'Frequently Asked Questions - Building';
      case 'both':
        return 'Frequently Asked Questions - Land & Building';
    }
  };

  const faqs = getFAQs();
  const midPoint = Math.ceil(faqs.length / 2);
  const leftColumnFaqs = faqs.slice(0, midPoint);
  const rightColumnFaqs = faqs.slice(midPoint);

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          {getTitle()}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-8">
            {leftColumnFaqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-200 pb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-500">{faq.answer}</p>
              </div>
            ))}
          </div>
          <div className="space-y-8">
            {rightColumnFaqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-200 pb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-500">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}