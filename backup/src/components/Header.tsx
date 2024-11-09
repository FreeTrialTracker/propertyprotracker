import React, { useState } from 'react';
import { Bell, Menu, Share2, Facebook, Linkedin, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const handleShare = (platform: string) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('Check out this property calculation on Land and House Tracker!');
    
    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
        break;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  return (
    <header className="bg-white shadow-md">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <Bell className="h-8 w-8 text-[#db4a2b]" />
              <span className="ml-2 text-xl font-bold text-gray-900">landandhousetracker</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex sm:items-center sm:space-x-8">
            <Link to="/" className="text-gray-700 hover:text-[#db4a2b] px-3 py-2 rounded-md text-sm font-medium">
              Calculator
            </Link>
            <div className="relative">
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-[#db4a2b] rounded-md text-sm font-medium"
              >
                <Share2 className="h-4 w-4" />
                Share
              </button>
              {showShareMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border">
                  <button
                    onClick={() => handleShare('facebook')}
                    className="flex items-center w-full px-4 py-2 hover:bg-gray-50"
                  >
                    <Facebook className="h-4 w-4 mr-2" />
                    Facebook
                  </button>
                  <button
                    onClick={() => handleShare('linkedin')}
                    className="flex items-center w-full px-4 py-2 hover:bg-gray-50"
                  >
                    <Linkedin className="h-4 w-4 mr-2" />
                    LinkedIn
                  </button>
                  <button
                    onClick={() => handleShare('twitter')}
                    className="flex items-center w-full px-4 py-2 hover:bg-gray-50"
                  >
                    <Twitter className="h-4 w-4 mr-2" />
                    X (Twitter)
                  </button>
                </div>
              )}
            </div>
            <span className="text-[#db4a2b] text-sm">www.landandhousetracker.com</span>
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-[#db4a2b] hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#db4a2b]"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="sm:hidden">
            <div className="pt-2 pb-3 space-y-1">
              <Link
                to="/"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#db4a2b] hover:bg-gray-100"
              >
                Calculator
              </Link>
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="flex items-center w-full px-3 py-2 text-base font-medium text-gray-700 hover:text-[#db4a2b] hover:bg-gray-100"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </button>
              {showShareMenu && (
                <div className="pl-6 space-y-1">
                  <button
                    onClick={() => handleShare('facebook')}
                    className="flex items-center w-full px-3 py-2 text-sm text-gray-600 hover:text-[#db4a2b]"
                  >
                    <Facebook className="h-4 w-4 mr-2" />
                    Facebook
                  </button>
                  <button
                    onClick={() => handleShare('linkedin')}
                    className="flex items-center w-full px-3 py-2 text-sm text-gray-600 hover:text-[#db4a2b]"
                  >
                    <Linkedin className="h-4 w-4 mr-2" />
                    LinkedIn
                  </button>
                  <button
                    onClick={() => handleShare('twitter')}
                    className="flex items-center w-full px-3 py-2 text-sm text-gray-600 hover:text-[#db4a2b]"
                  >
                    <Twitter className="h-4 w-4 mr-2" />
                    X (Twitter)
                  </button>
                </div>
              )}
              <span className="block px-3 py-2 text-[#db4a2b] text-sm">
                www.landandhousetracker.com
              </span>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}