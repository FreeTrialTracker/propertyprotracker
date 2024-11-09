import React from 'react';
import { MapPin, RefreshCw } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

interface ReportHeaderProps {
  reportName: string;
  location: string;
  notes: string;
  onReportNameChange: (name: string) => void;
  onLocationChange: (location: string) => void;
  onNotesChange: (notes: string) => void;
  onNewReport: () => void;
  onAuthRequired: () => void;
}

export function ReportHeader({ 
  reportName, 
  location,
  notes,
  onReportNameChange, 
  onLocationChange,
  onNotesChange,
  onNewReport,
  onAuthRequired
}: ReportHeaderProps) {
  const { user } = useAuthStore();
  const MAX_NOTES_LENGTH = 500;

  const handleNewReport = () => {
    if (!user) {
      onAuthRequired();
      return;
    }
    onNewReport();
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newNotes = e.target.value;
    if (newNotes.length <= MAX_NOTES_LENGTH) {
      onNotesChange(newNotes);
    }
  };

  return (
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
            Location/ GPS
          </label>
          <div className="relative">
            <input
              type="text"
              value={location}
              onChange={(e) => onLocationChange(e.target.value)}
              className="w-full h-12 px-4 pl-10 rounded-md border-gray-300 shadow-sm focus:border-[#db4a2b] focus:ring-[#db4a2b]"
              placeholder="Enter location"
            />
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Notes Section */}
      <div className="mt-6">
        <label className="block text-lg font-bold text-gray-900 mb-2">
          Notes
          <span className="ml-2 text-sm font-normal text-gray-500">
            ({notes.length}/{MAX_NOTES_LENGTH} characters)
          </span>
        </label>
        <textarea
          value={notes}
          onChange={handleNotesChange}
          className="w-full h-24 px-4 py-2 rounded-md border-gray-300 shadow-sm focus:border-[#db4a2b] focus:ring-[#db4a2b] resize-none"
          placeholder="Add notes about this calculation (optional)"
        />
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleNewReport}
          className="flex items-center gap-2 px-4 py-2 text-[#db4a2b] border border-[#db4a2b] rounded-lg hover:bg-[#db4a2b] hover:text-white transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          {user ? 'Start New Report' : 'Sign in to Start New Report'}
        </button>
      </div>
    </div>
  );
}