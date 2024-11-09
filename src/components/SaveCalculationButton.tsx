import React from 'react';
import { Save } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useCalculationsStore } from '../store/calculationsStore';

interface SaveCalculationButtonProps {
  onSave: () => Promise<void>;
  onAuthRequired: () => void;
}

export function SaveCalculationButton({ onSave, onAuthRequired }: SaveCalculationButtonProps) {
  const { user } = useAuthStore();
  const [isSaving, setIsSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const handleSave = async () => {
    if (!user) {
      onAuthRequired();
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccess(false);
    
    try {
      await onSave();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save calculation');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleSave}
        disabled={isSaving}
        className="flex items-center gap-2 px-4 py-2 bg-[#db4a2b] text-white rounded-lg hover:bg-[#c43d21] transition-colors disabled:opacity-50"
      >
        <Save className="h-4 w-4" />
        {isSaving ? 'Saving...' : 'Save Calculation'}
      </button>
      {error && (
        <div className="absolute top-full mt-2 left-0 w-48 bg-red-50 text-red-600 text-sm p-2 rounded border border-red-200">
          {error}
        </div>
      )}
      {success && (
        <div className="absolute top-full mt-2 left-0 w-48 bg-green-50 text-green-600 text-sm p-2 rounded border border-green-200">
          Calculation saved successfully!
        </div>
      )}
    </div>
  );
}