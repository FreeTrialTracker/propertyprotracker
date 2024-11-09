import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Share2, Facebook, Linkedin, Twitter, UserCircle, Home, Calculator, HelpCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useUserStore } from '../store/userStore';
import { AuthModal } from './auth/AuthModal';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const { user, signOut } = useAuthStore();
  const { settings, loadSettings } = useUserStore();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) {
      loadSettings(user.uid);
    }
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    setShowUserMenu(false);
    navigate('/');
  };

  const handleShare = (platform: string) => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent('Check out PropertyProTracker - Your comprehensive property calculator!');
    const description = encodeURIComponent('Calculate and track land, building, and property values with our comprehensive real estate calculator.');
    
    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}&summary=${description}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
        break;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const displayName = settings?.displayName || user?.displayName || user?.email?.split('@')[0] || 'User';

  return (
    <header className="bg-[#f8f9fa]">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <img src="/logo.svg" alt="Logo" className="h-8 w-8 text-[#db4a2b]" />
              <span className="ml-2 text-xl font-bold text-[#db4a2b]">PROPERTYPROTRACKER</span>
            </Link>
          </div>

          <div className="hidden sm:flex sm:items-center sm:space-x-8">
            <Link to="/" className="flex items-center text-gray-700 hover:text-[#db4a2b] px-3 py-2 rounded-md text-sm font-medium">
              <Home className="h-4 w-4 mr-2" />
              Home
            </Link>
            <Link to="/calculator" className="flex items-center text-gray-700 hover:text-[#db4a2b] px-3 py-2 rounded-md text-sm font-medium">
              <Calculator className="h-4 w-4 mr-2" />
              Calculator
            </Link>
            <Link to="/faq" className="flex items-center text-gray-700 hover:text-[#db4a2b] px-3 py-2 rounded-md text-sm font-medium">
              <HelpCircle className="h-4 w-4 mr-2" />
              FAQ
            </Link>

            {/* Share Button */}
            <div className="relative">
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-[#db4a2b] rounded-md text-sm font-medium"
              >
                <Share2 className="h-4 w-4" />
                Share
              </button>
              {showShareMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">
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

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-[#db4a2b] rounded-md text-sm font-medium"
                >
                  <UserCircle className="h-6 w-6" />
                  <span>{displayName}</span>
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border">
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="text-[#db4a2b] hover:bg-[#db4a2b] hover:text-white px-4 py-2 rounded-md text-sm font-medium border border-[#db4a2b] transition-colors"
              >
                Sign In
              </button>
            )}
          </div>

          <div className="sm:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-[#db4a2b] hover:bg-gray-100"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="sm:hidden">
            <div className="pt-2 pb-3 space-y-1">
              <Link
                to="/"
                className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#db4a2b] hover:bg-gray-100"
              >
                <Home className="h-4 w-4 mr-2" />
                Home
              </Link>
              <Link
                to="/calculator"
                className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#db4a2b] hover:bg-gray-100"
              >
                <Calculator className="h-4 w-4 mr-2" />
                Calculator
              </Link>
              <Link
                to="/faq"
                className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#db4a2b] hover:bg-gray-100"
              >
                <HelpCircle className="h-4 w-4 mr-2" />
                FAQ
              </Link>

              {/* Mobile Share Menu */}
              <div className="relative">
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
              </div>

              {user ? (
                <>
                  <div className="px-3 py-2 text-base font-medium text-gray-700">
                    Signed in as: {displayName}
                  </div>
                  <Link
                    to="/dashboard"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#db4a2b] hover:bg-gray-100"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#db4a2b] hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-[#db4a2b] hover:bg-[#db4a2b] hover:text-white"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </header>
  );
}