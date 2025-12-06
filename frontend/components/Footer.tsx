'use client';

import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const productLinks = [
    { name: 'Analysis', href: '/analysis' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Reports', href: '/reports' },
    { name: 'Incidents', href: '/incidents' },
    { name: 'Results', href: '/results' },
  ];

  const portalLinks = [
    { name: 'Government Admin', href: '/admin' },
    { name: 'Victim Support', href: '/victim' },
    { name: 'Enterprise Access', href: '/register' },
    { name: 'API Documentation', href: '/docs/api' },
  ];

  const resourceLinks = [
    { name: 'Documentation', href: '/docs' },
    { name: 'API Reference', href: '/docs/api' },
    { name: 'Tutorials', href: '/docs/tutorials' },
    { name: 'FAQs', href: '/docs/faq' },
    { name: 'Status Page', href: '/status' },
  ];

  const legalLinks = [
    { name: 'Privacy Policy', href: '/legal/privacy' },
    { name: 'Terms of Service', href: '/legal/terms' },
    { name: 'Data Protection', href: '/legal/data-protection' },
    { name: 'Compliance', href: '/legal/compliance' },
    { name: 'Cookie Policy', href: '/legal/cookies' },
  ];

  const socialLinks = [
    { name: 'Twitter', icon: '🐦', href: 'https://twitter.com/deepclean' },
    { name: 'LinkedIn', icon: '💼', href: 'https://linkedin.com/company/deepclean' },
    { name: 'GitHub', icon: '💻', href: 'https://github.com/deepclean' },
    { name: 'YouTube', icon: '📺', href: 'https://youtube.com/deepclean' },
  ];

  return (
    <footer className="bg-gray-900 text-gray-400 border-t border-gray-800">
      {/* Main Footer */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg">
                DC
              </div>
              <span className="text-xl font-bold text-white">DeepClean AI</span>
            </div>
            <p className="text-sm mb-4 leading-relaxed">
              National deepfake detection and fraud prevention platform for India. 
              Government-grade security and court-admissible evidence.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition transform hover:-translate-y-1"
                  aria-label={social.name}
                >
                  <span className="text-xl">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Product Column */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Product</h4>
            <ul className="space-y-2">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-white transition hover:translate-x-1 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Portals Column */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Portals</h4>
            <ul className="space-y-2">
              {portalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-white transition hover:translate-x-1 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Resources</h4>
            <ul className="space-y-2">
              {resourceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-white transition hover:translate-x-1 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Legal</h4>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-white transition hover:translate-x-1 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Section */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center md:text-left">
              <h5 className="text-white font-semibold mb-2 flex items-center gap-2 justify-center md:justify-start">
                <span>📧</span> Email Support
              </h5>
              <p className="text-sm">support@deepclean.ai</p>
              <p className="text-sm">enterprise@deepclean.ai</p>
            </div>
            <div className="text-center">
              <h5 className="text-white font-semibold mb-2 flex items-center gap-2 justify-center">
                <span>📞</span> Hotline
              </h5>
              <p className="text-sm">Toll-Free: 1800-123-4567</p>
              <p className="text-sm">Support: +91-11-4567-8900</p>
            </div>
            <div className="text-center md:text-right">
              <h5 className="text-white font-semibold mb-2 flex items-center gap-2 justify-center md:justify-end">
                <span>🏢</span> Government Office
              </h5>
              <p className="text-sm">Ministry of Electronics & IT</p>
              <p className="text-sm">Government of India</p>
            </div>
          </div>
        </div>

        {/* Compliance Badges */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="flex flex-wrap justify-center gap-4 text-xs">
            <div className="px-4 py-2 bg-gray-800 rounded-full flex items-center gap-2">
              <span>🔒</span> ISO 27001 Certified
            </div>
            <div className="px-4 py-2 bg-gray-800 rounded-full flex items-center gap-2">
              <span>✓</span> GDPR Compliant
            </div>
            <div className="px-4 py-2 bg-gray-800 rounded-full flex items-center gap-2">
              <span>🛡️</span> 256-bit Encryption
            </div>
            <div className="px-4 py-2 bg-gray-800 rounded-full flex items-center gap-2">
              <span>🇮🇳</span> IT Act 2000 Compliant
            </div>
            <div className="px-4 py-2 bg-gray-800 rounded-full flex items-center gap-2">
              <span>⚖️</span> Evidence Act 1872 Compliant
            </div>
            <div className="px-4 py-2 bg-gray-800 rounded-full flex items-center gap-2">
              <span>🌐</span> 99.9% Uptime SLA
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 text-center text-sm">
          <div className="mb-4">
            <p className="text-white font-medium mb-2">
              Trusted by 500+ Organizations • 100,000+ Analyses Performed • 94.2% Average Accuracy
            </p>
          </div>
          <div className="space-y-2">
            <p>
              © {currentYear} DeepClean AI. A project of the Ministry of Electronics & Information Technology, Government of India.
            </p>
            <p className="text-xs">
              All rights reserved. DeepClean AI® and related marks are registered trademarks.
            </p>
            <p className="text-xs text-gray-500">
              This platform is secured with advanced encryption and follows strict data protection guidelines.
              All evidence packages are court-admissible and comply with Indian legal standards.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 py-4">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white text-sm font-medium">
              🚨 Report deepfake content or need help? We&apos;re here 24/7
            </p>
            <div className="flex gap-3">
              <Link
                href="/victim"
                className="px-6 py-2 bg-white text-blue-900 rounded-lg hover:bg-gray-100 transition font-semibold text-sm"
              >
                Report Now
              </Link>
              <Link
                href="/admin"
                className="px-6 py-2 bg-transparent border-2 border-white text-white rounded-lg hover:bg-white/10 transition font-semibold text-sm"
              >
                Government Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
