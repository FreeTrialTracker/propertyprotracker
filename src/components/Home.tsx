import React from 'react';
import { Calculator, DollarSign, Globe } from 'lucide-react';
import { PageLinks } from './PageLinks';
import { Link } from 'react-router-dom';
import { FeatureCard } from './FeatureCard';
import { AreaConverter } from './AreaConverter';

export default function Home() {
  const features = [
    {
      title: "Comprehensive Property Analysis",
      points: [
        { text: "**Comprehensive Calculation Tools**: Includes Land And Property Market Valuation, Buy/Sell Price Analysis, And Lease Analysis Functionalities." },
        { text: "**Multi-Property Comparison**: Allows Users To Compare Up To Four Properties Simultaneously Using The Business Property Loan Calculator." },
        { text: "**Unit Conversion Feature**: Enables Easy Conversion Between Different Units Of Measurement." },
        { text: "**ROI Calculation For Rental Properties**: Provides Tools To Determine Return On Investment For Rental Properties." },
        { text: "**Detailed Property Valuation Reports**: Offers In-Depth Reports For Comparing Market Valuations Of Different Properties." }
      ],
      summary: "When It Combines These Features, The Result Is A Very Useful And Powerful Tool For Real Estate Professionals And Investor Who Have To Make Informed Decision About Property Transactions.",
      icon: Calculator
    },
    {
      title: "Versatile Transaction Support",
      points: [
        { text: "**Scenario Analysis**: Provides In-Depth Analysis For Various Buy Or Sell Scenarios In Real Estate." },
        { text: "**Comprehensive Investment Calculator**: Compares Market Value, Price Differences, And Return On Investment Across Multiple Currencies." },
        { text: "**Long-Term Investment Tools**: Offers Analysis Capabilities From Initial Valuation To Long-Term Investment Projections." },
        { text: "**PDF Report Generation**: Creates Detailed Property Valuation Comparison Reports In PDF Format." },
        { text: "**Decision Support**: Equips Users With Comprehensive Data And Analysis To Facilitate Informed Decision-Making In Property Investments." }
      ],
      summary: "These Features Improve PropertyProTracker Functionality By Giving Users A Wide Variety Of Powerful Tools To Perform Detailed Property Investment Analysis And To Make Prudent Decisions Across Different Situations And Lookups.",
      icon: DollarSign
    },
    {
      title: "User-Centric Experience Features",
      points: [
        { text: "**Personalized User Experience**: Offers Customizable Accounts And Default Currency Settings To Cater To Individual Preferences." },
        { text: "**Sharing And Reporting Capabilities**: Allows Users To Share Results On Social Media And Download Comprehensive Property Valuation Reports." },
        { text: "**Global Accessibility**: Functions As An International Standard Platform, Providing Cost-Effective Solutions For Real Estate Transactions Worldwide." },
        { text: "**Versatile Application**: Designed For Both Personal And Professional Use, With A User-Friendly Interface Suitable For Various Types Of Users." },
        { text: "**Advanced Analytical Tools**: Includes Features Like The Rental Property Business Property Loan Calculator To Assist In Property Investment Decisions And ROI Estimations For Rental Properties." }
      ],
      summary: "These Features Also Demonstrate That PropertyProTracker Has Taken A User Centric Approach To Design, Flexibility And Comprehensive Analysis Tools, Which Will Be Attractive To A Variety Of Users Worldwide In The Global Real Estate Space.",
      icon: Globe
    }
  ];

  return (
    <div className="relative max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Content */}
      <div className="relative">
        {/* Hero Section */}
        <div className="text-center py-16 mb-12">
          <h1 className="text-5xl font-extrabold mb-4 text-[#db4a2b]">PropertyProTracker</h1>
          <p className="text-2xl font-light mb-6 text-[#db4a2b]">
            Unlock Your Property's Potential With The <span className="font-bold underline">ONLY</span> Calculator And Convertor You Ever Need
          </p>
          <div className="max-w-4xl mx-auto text-lg leading-relaxed mb-8">
            <p className="w-full mb-4">
              PropertyProTracker.com Is Your All-In-One Property Tracker, All In One Property Investment Calculator.
            </p>
            <p className="w-4/5 mx-auto mb-4">
              PropertyProTracker.com Is Dedicated To Helping Real Estate Professionals
            </p>
            <p className="w-3/5 mx-auto">
              And Investors With Comprehensive Valuation And Analysis Tools.
            </p>
          </div>
          <Link 
            to="/calculator" 
            className="inline-flex items-center px-8 py-3 bg-[#db4a2b] text-white rounded-lg font-semibold hover:bg-[#c43d21] transition-colors"
          >
            Explore More
          </Link>
        </div>

        {/* Area Converter */}
        <AreaConverter />

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              points={feature.points}
              summary={feature.summary}
              icon={feature.icon}
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link 
            to="/calculator" 
            className="inline-flex items-center px-8 py-3 bg-[#db4a2b] text-white rounded-lg font-semibold hover:bg-[#c43d21] transition-colors"
          >
            Explore More
          </Link>
        </div>
      </div>
    </div>
  );
}