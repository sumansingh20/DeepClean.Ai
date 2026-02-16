'use client';

import React from 'react';
import Link from 'next/link';

export default function Sitemap() {
  const routes = [
    {
      category: '🏠 Main Pages',
      links: [
        { href: '/', label: 'Home', description: 'Landing page' },
        { href: '/about', label: 'About', description: 'About DeepClean AI' },
        { href: '/contact', label: 'Contact', description: 'Get in touch' },
        { href: '/help', label: 'Help Center', description: 'Support & guides' },
        { href: '/pricing', label: 'Pricing', description: 'Plans & pricing' },
      ],
    },
    {
      category: '🔐 Authentication',
      links: [
        { href: '/login', label: 'Login', description: 'Sign in to your account' },
        { href: '/register', label: 'Register', description: 'Create new account' },
        { href: '/forgot-password', label: 'Forgot Password', description: 'Reset password' },
        { href: '/reset-password', label: 'Reset Password', description: 'Set new password' },
        { href: '/verify-email', label: 'Verify Email', description: 'Email verification' },
        { href: '/two-factor', label: 'Two-Factor Auth', description: '2FA setup' },
      ],
    },
    {
      category: '📊 Dashboard & Analysis',
      links: [
        { href: '/dashboard', label: 'Dashboard', description: 'User dashboard' },
        { href: '/analysis', label: 'Analysis', description: 'Start new analysis' },
        { href: '/advanced-analysis', label: 'Advanced Analysis', description: 'Deep scan tools' },
        { href: '/results', label: 'Results', description: 'View results' },
        { href: '/live-deepfake', label: 'Live Detection', description: 'Real-time analysis' },
      ],
    },
    {
      category: '📄 Reports & Activity',
      links: [
        { href: '/reports', label: 'Reports', description: 'Generate reports' },
        { href: '/incidents', label: 'Incidents', description: 'Security incidents' },
        { href: '/activity', label: 'Activity', description: 'Activity logs' },
        { href: '/sessions', label: 'Sessions', description: 'Active sessions' },
      ],
    },
    {
      category: '👤 Profile & Settings',
      links: [
        { href: '/profile', label: 'Profile', description: 'User profile' },
        { href: '/settings', label: 'Settings', description: 'Account settings' },
        { href: '/security', label: 'Security', description: 'Security settings' },
      ],
    },
    {
      category: '🏛️ Special Portals',
      links: [
        { href: '/admin', label: 'Admin Portal', description: 'Administration panel' },
        { href: '/victim', label: 'Victim Support', description: 'Support for victims' },
      ],
    },
    {
      category: '📜 Legal & Info',
      links: [
        { href: '/terms', label: 'Terms of Service', description: 'Legal terms' },
        { href: '/privacy', label: 'Privacy Policy', description: 'Privacy information' },
        { href: '/status', label: 'System Status', description: 'Service status' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black text-white mb-4">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Sitemap
            </span>
          </h1>
          <p className="text-xl text-slate-400">
            Complete navigation of all available pages
          </p>
        </div>

        {/* Routes Grid */}
        <div className="space-y-12">
          {routes.map((section, idx) => (
            <div key={idx}>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span>{section.category}</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {section.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="group bg-white/5 backdrop-blur-xl border-2 border-white/10 rounded-xl p-6 hover:bg-white/10 hover:border-cyan-400/50 transition-all transform hover:scale-105"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-white font-bold text-lg group-hover:text-cyan-400 transition-colors">
                        {link.label}
                      </h3>
                      <span className="text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        →
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm mb-2">{link.description}</p>
                    <code className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded">
                      {link.href}
                    </code>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Back to Home */}
        <div className="mt-16 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-bold hover:shadow-xl transform hover:scale-105 transition-all"
          >
            <span>🏠</span>
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
