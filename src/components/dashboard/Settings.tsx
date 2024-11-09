import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { currencies } from '../../constants/currencies';
import { useAuthStore } from '../../store/authStore';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { updateProfile } from 'firebase/auth';

interface SettingsProps {
  userPreferences: {
    defaultCurrency: string;
  };
  onUpdate: () => void;
}

export function Settings({ userPreferences, onUpdate }: SettingsProps) {
  const { user } = useAuthStore();
  const [currency, setCurrency] = useState(userPreferences.defaultCurrency || 'USD');
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      // Update display name in Firebase Auth
      if (displayName !== user.displayName) {
        await updateProfile(user, { displayName });
      }

      // Update preferences in Firestore
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        displayName,
        'preferences.defaultCurrency': currency,
        updatedAt: new Date().toISOString()
      });
      
      onUpdate();
    } catch (error) {
      console.error('Error updating settings:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Settings</h2>
      
      <div className="space-y-6">
        <div>
          <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
            Display Name
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#db4a2b] focus:ring-[#db4a2b]"
              placeholder="Enter your name"
            />
          </div>
        </div>

        <div>
          <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
            Default Currency
          </label>
          <div className="mt-1">
            <select
              id="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#db4a2b] focus:ring-[#db4a2b]"
            >
              {currencies.map((curr) => (
                <option key={curr.code} value={curr.code}>
                  {curr.code} - {curr.name} ({curr.symbol})
                </option>
              ))}
            </select>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            This will be the default currency for all your new calculations.
          </p>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving || (currency === userPreferences.defaultCurrency && displayName === user?.displayName)}
            className="flex items-center gap-2 px-4 py-2 bg-[#db4a2b] text-white rounded-lg hover:bg-[#c43d21] transition-colors disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}