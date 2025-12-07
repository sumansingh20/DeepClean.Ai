'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks';
import Link from 'next/link';
import OAuthButtons from '@/components/OAuthButtons';
import PasswordStrengthMeter from '@/components/PasswordStrengthMeter';
import { validatePassword, type PasswordStrength } from '@/lib/passwordValidator';

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength | null>(null);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!email || !username || !password || !confirmPassword) {
      setLocalError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    const validation = validatePassword(password);
    if (!validation.valid) {
      setLocalError(validation.errors.join('. '));
      return;
    }

    if (passwordStrength?.breached) {
      setLocalError('This password has been found in data breaches. Please choose a different password.');
      return;
    }

    if (!acceptTerms) {
      setLocalError('You must accept the Terms of Service and Privacy Policy');
      return;
    }

    try {
      await register(email, username, password);
      router.push('/dashboard');
    } catch (err: any) {
      setLocalError(err.response?.data?.detail || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-2xl border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 text-gray-700 hover:text-gray-900 transition font-bold">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-bold">Back</span>
          </Link>
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-md">
              <span className="text-white font-black text-lg">DC</span>
            </div>
            <span className="font-black text-gray-900 text-xl tracking-tight">DeepClean.AI</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-6 pt-44 pb-20">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black text-gray-900 mb-4 tracking-tight">Create account</h1>
          <p className="text-gray-600 text-lg font-medium">Start protecting against deepfakes</p>
        </div>

        {/* OAuth Buttons */}
        <div className="mb-8">
          <OAuthButtons />
        </div>

        {/* Divider */}
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500 font-medium">Or continue with email</span>
          </div>
        </div>

        {/* Error Display */}
        {(error || localError) && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium shadow-soft">
            {error || localError}
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 shadow-soft"
              placeholder="you@company.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 shadow-soft"
              placeholder="username"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 shadow-soft"
                placeholder="Create a strong password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {showPassword ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  )}
                </svg>
              </button>
            </div>
            <PasswordStrengthMeter 
              password={password} 
              onStrengthChange={setPasswordStrength}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 shadow-soft"
                placeholder="Confirm your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {showConfirmPassword ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          <div className="flex items-start gap-3 pt-2">
            <input
              type="checkbox"
              id="terms"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              required
            />
            <label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
              I agree to the{' '}
              <Link href="/terms" className="text-blue-600 hover:text-blue-700 font-medium">
                Terms of Service
              </Link>
              {' '}and{' '}
              <Link href="/privacy" className="text-blue-600 hover:text-blue-700 font-medium">
                Privacy Policy
              </Link>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-medium hover:shadow-large"
          >
            {isLoading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-10 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
