import React, { useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useCalculationsStore } from '../../store/calculationsStore';
import { UserSettings } from './UserSettings';
import { SavedCalculations } from './SavedCalculations';
import { PageLinks } from '../PageLinks';

export default function Dashboard() {
  const { user } = useAuthStore();
  const { loadCalculations, savedCalculations } = useCalculationsStore();

  useEffect(() => {
    if (user) {
      loadCalculations(user.uid);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="p-8 text-center">
        <p>Please sign in to view your dashboard.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Settings Section */}
        <div className="lg:col-span-1">
          <UserSettings />
        </div>

        {/* Saved Calculations Section */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">My Calculations</h2>
          <SavedCalculations calculations={savedCalculations} />
        </div>
      </div>

      {/* Page Links */}
      <div className="mt-8">
        <PageLinks />
      </div>
    </div>
  );
}