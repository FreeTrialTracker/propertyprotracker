import React from 'react';
import { Share2, Facebook, Linkedin, Twitter } from 'lucide-react';

interface ShareMenuProps {
  title: string;
  url?: string;
}

export function ShareMenu({ title, url = window.location.href }: ShareMenuProps) {
  const [showMenu, setShowMenu] = React.useState(false);

  const handleShare = (platform: 'facebook' | 'linkedin' | 'twitter') => {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    
    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
        break;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 px-4 py-2 text-[#db4a2b] border border-[#db4a2b] rounded-lg hover:bg-[#db4a2b] hover:text-white transition-colors"
      >
        <Share2 className="h-4 w-4" />
        Share
      </button>

      {showMenu && (
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
  );
}