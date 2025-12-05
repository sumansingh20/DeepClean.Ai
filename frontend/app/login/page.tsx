'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!email || !password) {
      setLocalError('Please fill in all fields');
      return;
    }

    try {
      console.log('=== LOGIN ATTEMPT ===');
      console.log('Email:', email);
      console.log('API URL:', 'http://localhost:8001/api/v1/auth/login');
      
      // Direct fetch with more error handling
      const response = await fetch('http://localhost:8001/api/v1/auth/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password }),
        mode: 'cors',
        credentials: 'include'
      });
      
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✓ Login successful!', data);
        
        // Store auth data
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Redirect based on role
        const role = data.user.role;
        if (role === 'admin') {
          router.push('/dashboard/admin');
        } else if (role === 'moderator') {
          router.push('/dashboard/moderator');
        } else {
          router.push('/dashboard');
        }
        return;
      }
      
      // Handle error response
      const errorData = await response.json().catch(() => ({ detail: 'Login failed' }));
      console.error('✗ Login failed:', errorData);
      setLocalError(errorData.detail || 'Invalid credentials');
      
    } catch (err: any) {
      console.error('✗ Network/Connection error:', err);
      setLocalError(`Connection failed: ${err.message}. Make sure backend is running on port 8001.`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Back to home */}
      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-white/80 hover:text-white transition group">
        <span className="text-2xl group-hover:-translate-x-1 transition-transform">←</span>
        <span className="font-semibold">Back to Home</span>
      </Link>

      <div className="max-w-md w-full relative">
        {/* Login Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-white/20">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-xl opacity-50"></div>
              <div className="relative w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <span className="text-4xl font-black text-white">DC</span>
              </div>
            </div>
          </div>

          <h1 className="text-4xl font-black text-center mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-center text-gray-600 mb-8 text-sm">
            Sign in to access India&apos;s National Deepfake Shield
          </p>

          {/* Error Message */}
          {(error || localError) && (
            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-5 py-4 rounded-2xl mb-6 flex items-start gap-3 shadow-sm animate-shake">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="font-semibold text-sm">Login Failed</p>
                <p className="text-xs mt-1">{error || localError}</p>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-gray-400 text-xl">📧</span>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-gray-900 font-medium"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-gray-400 text-xl">🔒</span>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-14 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-gray-900 font-medium"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <span className="text-xl">{showPassword ? '👁️' : '👁️‍🗨️'}</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span className="text-gray-600 font-medium">Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400 opacity-0 group-hover:opacity-20 transition-opacity"></span>
              <span className="relative flex items-center justify-center gap-3">
                {isLoading ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </>
                )}
              </span>
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-semibold">OR</span>
            </div>
          </div>

          {/* Register Link */}
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Don&apos;t have an account?
            </p>
            <Link 
              href="/register" 
              className="inline-block w-full py-4 border-2 border-blue-600 text-blue-600 rounded-2xl font-black hover:bg-blue-50 transition-all duration-300 transform hover:scale-105"
            >
              Create Free Account
            </Link>
          </div>

          {/* Test Accounts */}
          <div className="mt-8 p-5 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border-2 border-blue-100">
            <p className="text-xs text-blue-900 font-black mb-3 flex items-center gap-2">
              <span>🔐</span>
              <span>TEST ACCOUNTS (Development Only)</span>
            </p>
            <div className="space-y-2 text-xs">
              <button
                onClick={() => {
                  setEmail('admin@deepclean.ai');
                  setPassword('admin123');
                }}
                className="w-full text-left p-3 bg-white rounded-xl hover:bg-blue-50 transition border border-blue-200 hover:border-blue-400 group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-black text-blue-900">👮 Admin:</span>
                    <span className="ml-2 text-gray-700">admin@deepclean.ai / admin123</span>
                  </div>
                  <span className="text-blue-600 opacity-0 group-hover:opacity-100 transition">Click to fill →</span>
                </div>
              </button>
              <button
                onClick={() => {
                  setEmail('moderator@deepclean.ai');
                  setPassword('mod123');
                }}
                className="w-full text-left p-3 bg-white rounded-xl hover:bg-purple-50 transition border border-purple-200 hover:border-purple-400 group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-black text-purple-900">🛡️ Moderator:</span>
                    <span className="ml-2 text-gray-700">moderator@deepclean.ai / mod123</span>
                  </div>
                  <span className="text-purple-600 opacity-0 group-hover:opacity-100 transition">Click to fill →</span>
                </div>
              </button>
            </div>
          </div>

          {/* Security Badge */}
          <div className="mt-6 flex items-center justify-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <span>🔒</span>
              <span className="font-semibold">256-bit SSL</span>
            </div>
            <div className="w-px h-4 bg-gray-300"></div>
            <div className="flex items-center gap-1">
              <span>✓</span>
              <span className="font-semibold">2FA Protected</span>
            </div>
            <div className="w-px h-4 bg-gray-300"></div>
            <div className="flex items-center gap-1">
              <span>🇮🇳</span>
              <span className="font-semibold">Gov Certified</span>
            </div>
          </div>
        </div>

        {/* Footer Text */}
        <p className="text-center mt-6 text-sm text-white/60">
          Protected by DeepClean AI • Ministry of Electronics & IT, Govt of India
        </p>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
}
