'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import apiClient from '@/lib/apiClient';
import { setToken } from '@/lib/tokenStorage';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await apiClient.login(email, password);
      
      if (response.data && response.data.access_token) {
        // Store tokens
        setToken(response.data.access_token);
        if (response.data.refresh_token) {
          localStorage.setItem('refresh_token', response.data.refresh_token);
        }
        
        // Fetch user data
        try {
          const userResponse = await apiClient.getCurrentUser();
          localStorage.setItem('user', JSON.stringify(userResponse.data));
        } catch (userErr) {
          console.error('Failed to fetch user data:', userErr);
        }
        
        // Redirect to dashboard
        router.push('/dashboard');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      const errorMessage = err.response?.data?.detail || err.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = async (testEmail: string, testPassword: string) => {
    setEmail(testEmail);
    setPassword(testPassword);
    setError('');
    setLoading(true);

    try {
      const response = await apiClient.login(testEmail, testPassword);
      
      if (response.data && response.data.access_token) {
        setToken(response.data.access_token);
        if (response.data.refresh_token) {
          localStorage.setItem('refresh_token', response.data.refresh_token);
        }
        
        try {
          const userResponse = await apiClient.getCurrentUser();
          localStorage.setItem('user', JSON.stringify(userResponse.data));
        } catch (userErr) {
          console.error('Failed to fetch user data:', userErr);
        }
        
        router.push('/dashboard');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Login failed';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <nav className="bg-white/95 backdrop-blur-2xl border-b border-purple-100 sticky top-0 z-50 shadow-xl">
        <div className="max-w-6xl mx-auto px-4 h-20">
          <div className="flex justify-between items-center h-full">
            <Link href="/" className="flex items-center gap-2 transform hover:scale-105 transition-transform">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 via-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-black text-lg">DC</span>
              </div>
              <div>
                <span className="font-black text-xl text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600">DeepClean.AI</span>
                <span className="block text-xs text-green-600 font-bold -mt-1">100% FREE</span>
              </div>
            </Link>
            <Link href="/" className="px-6 py-2.5 text-sm text-gray-700 hover:text-purple-600 font-bold transition border-2 border-transparent hover:border-purple-200 rounded-xl">
              ← Back to Home
            </Link>
          </div>
        </div>
      </nav>

      {/* Login Form */}
      <div className="flex items-center justify-center py-20 px-4 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-2xl hover:shadow-purple-200/50 p-10 border-2 border-purple-100 transform hover:scale-[1.01] transition-all duration-300">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 mb-3">Welcome Back</h2>
              <p className="text-base text-gray-600 font-medium">Sign in to access your dashboard</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="font-medium">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition text-gray-900 placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition text-gray-900 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500 focus:ring-2" 
                  />
                  <span className="ml-2 text-gray-700 font-medium">Remember me</span>
                </label>
                <Link 
                  href="/forgot-password" 
                  className="text-pink-600 hover:text-pink-700 font-semibold hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-4 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 hover:from-pink-700 hover:via-purple-700 hover:to-blue-700 text-white font-bold text-lg rounded-xl shadow-2xl hover:shadow-purple-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing in...
                  </span>
                ) : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link 
                  href="/register" 
                  className="text-pink-600 hover:text-pink-700 font-semibold hover:underline"
                >
                  Create free account
                </Link>
              </p>
            </div>

            {/* Quick Test Login */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-xs font-semibold text-gray-500 mb-4 text-center uppercase tracking-wide">
                Quick Test Access
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => quickLogin('admin@deepclean.ai', 'admin123')}
                  className="px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 text-gray-700 text-sm font-semibold rounded-lg border border-gray-300 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow"
                >
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => quickLogin('suman@deepclean.ai', 'suman123')}
                  className="px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 text-blue-700 text-sm font-semibold rounded-lg border border-blue-300 hover:border-blue-400 transition-all duration-200 shadow-sm hover:shadow"
                >
                  Suman
                </button>
              </div>
            </div>

            {/* Security Badge */}
            <div className="mt-8 flex items-center justify-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                Secure Login
              </span>
              <span className="text-gray-300">•</span>
              <span>256-bit Encryption</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
