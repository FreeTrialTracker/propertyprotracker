import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Calculator, HelpCircle, UserCircle } from 'lucide-react';

export function PageLinks() {
  return (
    <div className="mt-16 border-t border-gray-200 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Explore More</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link 
            to="/" 
            className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <Home className="h-6 w-6 text-[#db4a2b] mr-3" />
            <div>
              <h3 className="font-medium text-gray-900">Home</h3>
              <p className="text-sm text-gray-500">Return to homepage</p>
            </div>
          </Link>

          <Link 
            to="/calculator" 
            className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <Calculator className="h-6 w-6 text-[#db4a2b] mr-3" />
            <div>
              <h3 className="font-medium text-gray-900">Property Calculator</h3>
              <p className="text-sm text-gray-500">Calculate property values</p>
            </div>
          </Link>

          <Link 
            to="/faq" 
            className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <HelpCircle className="h-6 w-6 text-[#db4a2b] mr-3" />
            <div>
              <h3 className="font-medium text-gray-900">FAQ</h3>
              <p className="text-sm text-gray-500">Find answers to common questions</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}