import React, { useState, useEffect } from 'react';
import { MapPin, RefreshCw } from 'lucide-react';

interface ReportHeaderProps {
  reportName: string;
  location: string;
  onReportNameChange: (name: string) => void;
  onLocationChange: (location: string) => void;
  onNewReport: () => void;
}

export function ReportHeader({ 
  reportName, 
  location, 
  onReportNameChange, 
  onLocationChange,
  onNewReport 
}: ReportHeaderProps) {
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubscribed, setHasSubscribed] = useState(false);

  useEffect(() => {
    const subscribed = localStorage.getItem('hasSubscribed');
    if (subscribed) {
      setHasSubscribed(true);
    }
  }, []);

  const handleNewReport = () => {
    if (!hasSubscribed) {
      setShowEmailModal(true);
    } else {
      onNewReport();
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('https://freetrialtracker.us10.list-manage.com/subscribe/post?u=fb041bf3da8c81f1579904e64&id=cefb038d40', {
        method: 'POST',
        body: new FormData(e.target as HTMLFormElement),
      });

      if (response.ok) {
        setShowEmailModal(false);
        setEmail('');
        setHasSubscribed(true);
        localStorage.setItem('hasSubscribed', 'true');
        onNewReport();
      } else {
        console.error('Failed to subscribe');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-lg font-bold text-gray-900 mb-2">
              Report Name *
            </label>
            <input
              type="text"
              value={reportName}
              onChange={(e) => onReportNameChange(e.target.value)}
              className="w-full h-12 px-4 rounded-md border-gray-300 shadow-sm focus:border-[#db4a2b] focus:ring-[#db4a2b]"
              placeholder="Enter report name"
              required
            />
          </div>

          <div>
            <label className="block text-lg font-bold text-gray-900 mb-2">
              GPS Location (Optional)
            </label>
            <div className="relative">
              <input
                type="text"
                value={location}
                onChange={(e) => onLocationChange(e.target.value)}
                className="w-full h-12 px-4 pl-10 rounded-md border-gray-300 shadow-sm focus:border-[#db4a2b] focus:ring-[#db4a2b]"
                placeholder="Enter GPS location"
              />
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleNewReport}
            className="flex items-center gap-2 px-4 py-2 text-[#db4a2b] border border-[#db4a2b] rounded-lg hover:bg-[#db4a2b] hover:text-white transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Start New Report
          </button>
        </div>
      </div>

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-semibold mb-6 text-left">Enter Your Email To Start A New Report</h2>
            <form 
              action="https://freetrialtracker.us10.list-manage.com/subscribe/post?u=fb041bf3da8c81f1579904e64&id=cefb038d40"
              method="post"
              id="mc-embedded-subscribe-form"
              name="mc-embedded-subscribe-form"
              onSubmit={handleEmailSubmit}
              className="space-y-6"
            >
              <div>
                <label htmlFor="mce-EMAIL" className="block text-sm font-medium text-gray-700 mb-2 text-left">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="EMAIL"
                  id="mce-EMAIL"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 px-4 rounded-md border-gray-300 shadow-sm focus:border-[#db4a2b] focus:ring-[#db4a2b]"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <p className="text-sm text-gray-600 text-left">
                We Value Your Privacy. By Entering Your Email Address, You Agree To Receive Updates And Promotions From LandAndHouseTracker.com. Your Information Will Not Be Shared With Third Parties.
              </p>

              {/* Honeypot field */}
              <div style={{ position: 'absolute', left: '-5000px' }} aria-hidden="true">
                <input type="text" name="b_fb041bf3da8c81f1579904e64_cefb038d40" tabIndex={-1} />
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowEmailModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-[#db4a2b] text-white rounded-lg hover:bg-[#c43d21] transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}