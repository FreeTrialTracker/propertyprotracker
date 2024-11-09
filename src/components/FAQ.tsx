import React from 'react';
import { 
  Map, 
  Building2, 
  DollarSign, 
  Calculator, 
  Key, 
  Clock, 
  FileText, 
  TrendingUp,
  Ruler,
  Home,
  BarChart2,
  RefreshCw
} from 'lucide-react';
import { PageLinks } from './PageLinks';

export function FAQ() {
  const faqSections = [
    {
      title: "Land Valuation",
      icon: <Map className="h-6 w-6 text-[#db4a2b]" />,
      questions: [
        {
          question: "How do I convert between different land units?",
          answer: "Our calculator automatically converts between various units including Rai (1600 sqm), Ngan (400 sqm), Square Wah (4 sqm), and international units like square meters, square feet, etc. Simply enter your measurements in any supported unit."
        },
        {
          question: "What factors affect land value?",
          answer: "Land value is influenced by location, zoning regulations, accessibility, infrastructure development, market demand, and future development potential."
        },
        {
          question: "How accurate are the land price calculations?",
          answer: "Our calculations are based on your input values and current market rates. For the most accurate assessment, ensure your measurements and market prices are up-to-date."
        },
        {
          question: "What documentation is needed for land valuation?",
          answer: "Land title deed, official survey documents, zoning certificates, and recent comparable sales data in your area are essential for accurate valuation."
        }
      ]
    },
    {
      title: "Building Valuation",
      icon: <Building2 className="h-6 w-6 text-[#db4a2b]" />,
      questions: [
        {
          question: "How is building value calculated?",
          answer: "Building value is calculated based on built-up area, construction quality, age, and current market rates per square meter."
        },
        {
          question: "What area measurements are needed?",
          answer: "Enter the total built-up area including all floors. Our calculator supports various units including square meters and square feet."
        },
        {
          question: "Does age affect building value?",
          answer: "Yes, building age typically affects value through depreciation, which usually ranges from 2-4% annually depending on construction type and maintenance."
        },
        {
          question: "How do I account for renovations?",
          answer: "Include recent renovation costs and improvements when calculating the current building value. This helps provide a more accurate current market value."
        }
      ]
    },
    {
      title: "Lease Calculations",
      icon: <Key className="h-6 w-6 text-[#db4a2b]" />,
      questions: [
        {
          question: "How are lease rates determined?",
          answer: "Lease rates are calculated based on property value, market conditions, lease duration, and location factors."
        },
        {
          question: "What affects lease prices?",
          answer: "Lease prices are influenced by location, property condition, market trends, and lease term length."
        },
        {
          question: "How often should lease rates be reviewed?",
          answer: "We recommend reviewing lease rates annually or when significant market changes occur."
        },
        {
          question: "What documentation is needed for leasing?",
          answer: "Property ownership documents, condition reports, and current market rate comparisons are essential."
        }
      ]
    },
    {
      title: "Mortgage Calculations",
      icon: <Calculator className="h-6 w-6 text-[#db4a2b]" />,
      questions: [
        {
          question: "How is the mortgage payment calculated?",
          answer: "Monthly payments are calculated based on loan amount, interest rate, loan term, and whether interest is simple or compound."
        },
        {
          question: "What affects mortgage rates?",
          answer: "Interest rates depend on market conditions, loan term, credit history, and down payment amount."
        },
        {
          question: "How does compound interest work?",
          answer: "Compound interest calculates interest on both the principal and previously accumulated interest, while simple interest only applies to the principal amount."
        },
        {
          question: "What documentation is needed for mortgages?",
          answer: "Property valuation, income verification, credit history, and property insurance documents are typically required."
        }
      ]
    },
    {
      title: "Market Analysis",
      icon: <TrendingUp className="h-6 w-6 text-[#db4a2b]" />,
      questions: [
        {
          question: "How to determine market value?",
          answer: "Research recent sales of similar properties in your area, consult local real estate agents, or use official land valuation data from government sources."
        },
        {
          question: "How often should I update valuations?",
          answer: "It's recommended to review property values annually or when significant market changes occur in your area."
        },
        {
          question: "What are common valuation mistakes?",
          answer: "Common pitfalls include overlooking zoning restrictions, ignoring market trends, and incorrect unit conversions."
        },
        {
          question: "How to compare property values?",
          answer: "Compare similar properties in terms of size, age, location, and specifications for accurate valuations."
        }
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Frequently Asked Questions
        </h1>
        <p className="text-xl text-gray-600">
          Find answers to common questions about property calculations and valuations
        </p>
      </div>

      {/* FAQ Sections */}
      <div className="space-y-12">
        {faqSections.map((section, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              {section.icon}
              <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              {section.questions.map((faq, faqIndex) => (
                <div 
                  key={faqIndex}
                  className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Still Have Questions Section */}
      <div className="mt-12 bg-[#db4a2b]/10 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Still Have Questions?
        </h2>
        <p className="text-gray-600 mb-6">
          Can't find the answer you're looking for? Check out our comprehensive guides or contact our support team.
        </p>
        <div className="flex justify-center gap-4">
          <a
            href="https://freetrialtracker.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-[#db4a2b] text-white rounded-lg hover:bg-[#c43d21] transition-colors"
          >
            <FileText className="h-5 w-5 mr-2" />
            View Guides
          </a>
          <a
            href="mailto:support@propertyprotracker.com"
            className="inline-flex items-center px-6 py-3 border border-[#db4a2b] text-[#db4a2b] rounded-lg hover:bg-[#db4a2b] hover:text-white transition-colors"
          >
            <Home className="h-5 w-5 mr-2" />
            Contact Support
          </a>
        </div>
      </div>

      {/* Page Links */}
      <PageLinks />
    </div>
  );
}