import React from 'react';
import { Globe, Facebook, Linkedin, Twitter, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#f8f9fa] border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <div className="flex items-center">
              <img src="/logo.svg" alt="Logo" className="h-8 w-8 text-[#db4a2b]" />
              <span className="ml-2 text-xl font-bold text-[#db4a2b]">PROPERTYPROTRACKER</span>
            </div>
            <p className="text-gray-600">
              Your comprehensive solution for property value calculations and tracking.
            </p>
            <p className="text-[#db4a2b]">
              www.propertyprotracker.com
            </p>
            <div className="pt-4 space-y-1">
              <p className="text-gray-600 font-medium">Check out our other Apps:</p>
              <a href="https://www.softwareroiapp.com" target="_blank" rel="noopener noreferrer" className="block text-[#db4a2b] hover:text-[#c43d21]">
                www.softwareroiapp.com
              </a>
              <a href="https://www.freetrialtracker.com" target="_blank" rel="noopener noreferrer" className="block text-[#db4a2b] hover:text-[#c43d21]">
                www.freetrialtracker.com
              </a>
            </div>
          </div>

          {/* Connect With Us */}
          <div>
            <h3 className="text-sm font-semibold text-[#db4a2b] uppercase tracking-wider mb-4">
              Connect With Us
            </h3>
            <div className="space-y-3">
              <a
                href="mailto:contact@freetrialtracker.com"
                className="flex items-center text-gray-600 hover:text-[#db4a2b]"
              >
                <Mail className="h-5 w-5 mr-2" />
                Email Us
              </a>
              <a
                href="https://freetrialtracker.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-600 hover:text-[#db4a2b]"
              >
                <Globe className="h-5 w-5 mr-2" />
                Website
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61566411686381"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-600 hover:text-[#db4a2b]"
              >
                <Facebook className="h-5 w-5 mr-2" />
                Facebook
              </a>
              <a
                href="https://www.linkedin.com/company/freetrialtracker/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-600 hover:text-[#db4a2b]"
              >
                <Linkedin className="h-5 w-5 mr-2" />
                LinkedIn
              </a>
              <a
                href="https://twitter.com/freetrialtrack"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-600 hover:text-[#db4a2b]"
              >
                <Twitter className="h-5 w-5 mr-2" />
                X (Twitter)
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-400">
            © 2024 PROPERTYPROTRACKER. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}