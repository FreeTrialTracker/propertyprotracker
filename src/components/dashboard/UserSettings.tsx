import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useUserStore } from '../../store/userStore';
import { updateProfile, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { Eye, EyeOff } from 'lucide-react';

export function UserSettings() {
  const { user } = useAuthStore();
  const { settings, loadSettings, updateSettings, loading } = useUserStore();
  const [newDisplayName, setNewDisplayName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (user) {
      loadSettings(user.uid);
    }
  }, [user]);

  useEffect(() => {
    if (settings) {
      setNewDisplayName(settings.displayName || '');
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      // Update Firebase Auth display name
      if (newDisplayName !== user.displayName) {
        await updateProfile(user, { displayName: newDisplayName });
      }

      // Update Firestore settings
      await updateSettings(user.uid, {
        displayName: newDisplayName
      });

      // Reload settings to ensure everything is in sync
      await loadSettings(user.uid);
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');
    setIsChangingPassword(true);

    try {
      if (!user?.email) throw new Error('No user email found');
      if (newPassword !== confirmPassword) {
        throw new Error('Passwords do not match');
      }
      if (newPassword.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      // Reauthenticate user before changing password
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, newPassword);

      // Clear form and show success message
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordSuccess('Password updated successfully');
    } catch (error: any) {
      setPasswordError(
        error.code === 'auth/wrong-password' 
          ? 'Current password is incorrect'
          : error.message || 'Failed to update password'
      );
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (!user) return null;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">User Settings</h2>

      {/* Display Name Form */}
      <form onSubmit={handleSubmit} className="space-y-6 mb-8">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Display Name
            </label>
            <div className="px-4 py-2 bg-gray-50 rounded-md border border-gray-200">
              {settings?.displayName || user.email?.split('@')[0] || 'Not set'}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Change User Name
            </label>
            <input
              type="text"
              value={newDisplayName}
              onChange={(e) => setNewDisplayName(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:ring-[#db4a2b] focus:border-[#db4a2b]"
              placeholder="Enter new display name"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !newDisplayName}
          className="w-full bg-[#db4a2b] text-white py-2 rounded-md hover:bg-[#c43d21] transition-colors disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Settings'}
        </button>
      </form>

      {/* Password Change Form */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:ring-[#db4a2b] focus:border-[#db4a2b]"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:ring-[#db4a2b] focus:border-[#db4a2b]"
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:ring-[#db4a2b] focus:border-[#db4a2b]"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {passwordError && (
            <p className="text-sm text-red-600">{passwordError}</p>
          )}

          {passwordSuccess && (
            <p className="text-sm text-green-600">{passwordSuccess}</p>
          )}

          <button
            type="submit"
            disabled={isChangingPassword || !currentPassword || !newPassword || !confirmPassword}
            className="w-full bg-[#db4a2b] text-white py-2 rounded-md hover:bg-[#c43d21] transition-colors disabled:opacity-50"
          >
            {isChangingPassword ? 'Updating Password...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}