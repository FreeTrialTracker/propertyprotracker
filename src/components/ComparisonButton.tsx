import React from 'react';
import { Plus, ArrowLeftRight } from 'lucide-react';

interface ComparisonButtonProps {
  isComparing: boolean;
  onCompareClick: () => void;
  onAddPropertyClick: () => void;
}

export function ComparisonButton({ isComparing, onCompareClick, onAddPropertyClick }: ComparisonButtonProps) {
  return (
    <div className="flex justify-end space-x-4 mt-6">
      {!isComparing ? (
        <button
          onClick={onAddPropertyClick}
          className="flex items-center gap-2 px-4 py-2 text-[#db4a2b] border border-[#db4a2b] rounded-lg hover:bg-[#db4a2b] hover:text-white transition-colors"
        >
          <Plus className="h-4 w-4" />
          Enter Next To Compare
        </button>
      ) : (
        <button
          onClick={onCompareClick}
          className="flex items-center gap-2 px-4 py-2 bg-[#db4a2b] text-white rounded-lg hover:bg-[#c43d21] transition-colors"
        >
          <ArrowLeftRight className="h-4 w-4" />
          Compare Properties
        </button>
      )}
    </div>
  );
}