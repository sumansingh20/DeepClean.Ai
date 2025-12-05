'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks';

export const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [notifications] = useState(3); // Mock notification count

  const navigationLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'Analysis', href: '/analysis', icon: '🔍' },
    { name: 'Results', href: '/results', icon: '📈' },
    { name: 'Incidents', href: '/incidents', icon: '🚨' },
    { name: 'Reports', href: '/reports', icon: '📄' },
  ];

  const portalLinks = [
    { name: 'Admin Portal', href: '/admin', icon: '👮', badge: 'Gov' },
    { name: 'Victim Support', href: '/victim', icon: '🆘', badge: 'Help' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:shadow-xl transition transform group-hover:scale-105">
              DC
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent hidden sm:block">
              DeepClean AI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {isAuthenticated ? (
              <>
                {navigationLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition font-medium flex items-center gap-2"
                  >
                    <span>{link.icon}</span>
                    <span>{link.name}</span>
                  </Link>
                ))}
                <div className="w-px h-6 bg-gray-300 mx-2"></div>
                {portalLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="px-4 py-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition font-medium flex items-center gap-2 relative"
                  >
                    <span>{link.icon}</span>
                    <span>{link.name}</span>
                    <span className="px-2 py-0.5 bg-purple-600 text-white text-xs rounded-full font-bold">
                      {link.badge}
                    </span>
                  </Link>
                ))}
              </>
            ) : (
              <>
                <Link href="/#features" className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition font-medium">
                  Features
                </Link>
                <Link href="/#how-it-works" className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition font-medium">
                  How It Works
                </Link>
                <Link href="/admin" className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition font-medium">
                  Government
                </Link>
              </>
            )}
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <button
                  className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                  aria-label="Notifications"
                >
                  <span className="text-2xl">🔔</span>
                  {notifications > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                      {notifications}
                    </span>
                  )}
                </button>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg transition"
                    aria-label="User menu"
                  >
                    <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                      {user?.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="text-left hidden lg:block">
                      <p className="text-sm font-semibold text-gray-900">{user?.username || 'User'}</p>
                      <p className="text-xs text-gray-500">{user?.role || 'Analyst'}</p>
                    </div>
                    <span className="text-gray-400">▼</span>
                  </button>

                  {/* User Dropdown */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-200">
                        <p className="text-sm font-semibold text-gray-900">{user?.email || 'user@example.com'}</p>
                        <p className="text-xs text-gray-500">ID: {user?.id || 'N/A'}</p>
                      </div>
                      <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition">
                        📊 Dashboard
                      </Link>
                      <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition">
                        👤 Profile Settings
                      </Link>
                      <Link href="/api-keys" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition">
                        🔑 API Keys
                      </Link>
                      <div className="border-t border-gray-200 my-2"></div>
                      <button
                        onClick={logout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                      >
                        🚪 Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-6 py-2 text-gray-700 hover:text-blue-600 font-medium transition"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition transform hover:-translate-y-0.5 font-medium"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-4 py-4 space-y-2">
            {isAuthenticated ? (
              <>
                <div className="pb-3 mb-3 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                      {user?.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{user?.username || 'User'}</p>
                      <p className="text-sm text-gray-500">{user?.email || 'user@example.com'}</p>
                    </div>
                  </div>
                </div>
                {navigationLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="text-xl">{link.icon}</span>
                    <span>{link.name}</span>
                  </Link>
                ))}
                <div className="border-t border-gray-200 my-2"></div>
                {portalLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="text-xl">{link.icon}</span>
                    <span>{link.name}</span>
                    <span className="ml-auto px-2 py-0.5 bg-purple-600 text-white text-xs rounded-full font-bold">
                      {link.badge}
                    </span>
                  </Link>
                ))}
                <div className="border-t border-gray-200 my-2"></div>
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition font-medium w-full"
                >
                  <span className="text-xl">🚪</span>
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link href="/#features" className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition font-medium">
                  Features
                </Link>
                <Link href="/#how-it-works" className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition font-medium">
                  How It Works
                </Link>
                <Link href="/admin" className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition font-medium">
                  Government Portal
                </Link>
                <div className="border-t border-gray-200 my-2"></div>
                <Link
                  href="/login"
                  className="block px-4 py-3 text-center text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block px-4 py-3 text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
