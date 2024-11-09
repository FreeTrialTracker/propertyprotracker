import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { X, Eye, EyeOff } from 'lucide-react';
import { updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const { signIn, signUp, loading, error } = useAuthStore();

  if (!isOpen) return null;

  const validatePassword = () => {
    if (!isSignIn && password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return false;
    }
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePassword()) return;

    try {
      if (isSignIn) {
        await signIn(email, password);
      } else {
        const userCredential = await signUp(email, password);
        if (userCredential.user) {
          // Update display name
          await updateProfile(userCredential.user, {
            displayName: displayName || email.split('@')[0]
          });

          // Create user document with preferences
          await setDoc(doc(db, 'users', userCredential.user.uid), {
            email: userCredential.user.email,
            displayName: displayName || email.split('@')[0],
            preferences: {
              defaultCurrency: 'USD'
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        }
      }
      onClose();
    } catch (error) {
      console.error('Authentication error:', error);
    }
  };

  const togglePasswordVisibility = (field: 'password' | 'confirm') => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-6 w-6" />
        </button>

        <h2 className="text-2xl font-semibold mb-6">
          {isSignIn ? 'Sign In' : 'Create Account'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isSignIn && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:ring-[#db4a2b] focus:border-[#db4a2b]"
                placeholder="Enter your name"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:ring-[#db4a2b] focus:border-[#db4a2b]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:ring-[#db4a2b] focus:border-[#db4a2b]"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('password')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {!isSignIn && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
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
                  onClick={() => togglePasswordVisibility('confirm')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          )}

          {(passwordError || error) && (
            <p className="text-red-500 text-sm">
              {passwordError || error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#db4a2b] text-white py-2 rounded-md hover:bg-[#c43d21] transition-colors disabled:opacity-50"
          >
            {loading ? 'Processing...' : isSignIn ? 'Sign In' : 'Create Account'}
          </button>

          <button
            type="button"
            onClick={() => {
              setIsSignIn(!isSignIn);
              setPassword('');
              setConfirmPassword('');
              setPasswordError('');
            }}
            className="w-full text-sm text-gray-600 hover:text-[#db4a2b]"
          >
            {isSignIn ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}