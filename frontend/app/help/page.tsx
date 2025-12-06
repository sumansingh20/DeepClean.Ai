'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const helpCategories = [
    {
      icon: '🚀',
      title: 'Getting Started',
      description: 'Quick guides to help you begin',
      articles: [
        'How to create an account',
        'First analysis walkthrough',
        'Understanding your dashboard',
        'Setting up API access'
      ]
    },
    {
      icon: '🔬',
      title: 'Analysis & Detection',
      description: 'Learn about our detection capabilities',
      articles: [
        'Supported file formats',
        'How deepfake detection works',
        'Understanding confidence scores',
        'Interpreting analysis results'
      ]
    },
    {
      icon: '📊',
      title: 'Reports & Analysis',
      description: 'Generate and manage reports',
      articles: [
        'Generating analysis reports',
        'Technical report details',
        'Exporting data (PDF, Excel, JSON)',
        'Report customization options'
      ]
    },
    {
      icon: '⚖️',
      title: 'Legal & Compliance',
      description: 'Legal document generation',
      articles: [
        'Filing FIR under IT Act 2000',
        'Platform takedown requests',
        'DMCA notice generation',
        'Legal affidavit templates'
      ]
    },
    {
      icon: '🔐',
      title: 'Security & Privacy',
      description: 'Keep your data safe',
      articles: [
        'Data encryption standards',
        'Two-factor authentication setup',
        'Privacy policy overview',
        'GDPR compliance'
      ]
    },
    {
      icon: '💻',
      title: 'API & Integration',
      description: 'Developer resources',
      articles: [
        'API authentication',
        'Webhooks setup',
        'Rate limits & quotas',
        'SDK documentation'
      ]
    }
  ];

  const faqs = [
    {
      q: 'What file formats are supported?',
      a: 'We support MP3/WAV for audio, MP4/AVI/MOV for video, JPG/PNG for images, and PDF for documents. Maximum file size is 500MB.'
    },
    {
      q: 'How accurate is the deepfake detection?',
      a: 'Our ensemble AI models achieve 94.2% average accuracy across all media types, with video deepfake detection at 96.8% accuracy using state-of-the-art XceptionNet, EfficientNet-B7, and Vision Transformer models.'
    },
    {
      q: 'How long does analysis take?',
      a: 'Voice analysis: ~2 seconds, Document verification: ~3 seconds, Video analysis: ~10-30 seconds depending on length. Results are delivered in real-time via WebSocket.'
    },
    {
      q: 'Are my uploads stored permanently?',
      a: 'No. Uploaded files are automatically deleted after 7 days. Analysis results and reports are retained according to your account retention policy. You can request immediate deletion anytime.'
    },
    {
      q: 'Can I use this for documentation?',
      a: 'Our analysis reports include technical details and confidence scores. Reports can be exported as PDF for record-keeping and documentation purposes.'
    },
    {
      q: 'What is the StopNCII platform?',
      a: 'StopNCII (Stop Non-Consensual Intimate Images) helps victims detect and remove intimate content across platforms using perceptual hashing. It matches content without storing actual images.'
    },
    {
      q: 'How do I report a false positive?',
      a: 'Contact our support team with your session ID. Our ML engineers review all reported cases to improve model accuracy. False positives help us refine our algorithms.'
    },
    {
      q: 'What are API rate limits?',
      a: 'Free tier: 100 requests/hour, Professional: 1,000 requests/hour, Enterprise: Unlimited. WebSocket connections limited to 5 concurrent per account.'
    },
    {
      q: 'How do I generate a takedown request?',
      a: 'Go to Legal Documents → Platform Takedown. Our system generates DMCA notices, platform-specific complaints (YouTube, Instagram, Twitter, Facebook), and tracks submission status.'
    },
    {
      q: 'Is there bulk analysis support?',
      a: 'Yes. Enterprise accounts can upload up to 1,000 files simultaneously via API or dashboard. Bulk analysis uses our Celery queue system with priority processing.'
    }
  ];

  const contactOptions = [
    {
      icon: '📧',
      title: 'Email Support',
      value: 'support@deepclean.ai',
      desc: 'Response within 24 hours',
      link: 'mailto:support@deepclean.ai'
    },
    {
      icon: '💬',
      title: 'Live Chat',
      value: 'Available 24/7',
      desc: 'Instant support',
      link: '/contact'
    },
    {
      icon: '📞',
      title: 'Phone Support',
      value: '+91-11-2345-6789',
      desc: 'Mon-Fri 9 AM - 6 PM IST',
      link: 'tel:+911123456789'
    },
    {
      icon: '🐛',
      title: 'Report Bug',
      value: 'security@deepclean.ai',
      desc: 'Bug bounty available',
      link: 'mailto:security@deepclean.ai'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg">
                DC
              </div>
              <div>
                <span className="text-2xl font-black text-gray-900">DeepClean AI</span>
                <div className="text-xs text-gray-500">Help Center</div>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-gray-600 hover:text-blue-600 font-semibold transition">
                Dashboard
              </Link>
              <Link href="/contact" className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg transition">
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 text-center">
        <div className="container mx-auto px-6">
          <div className="text-6xl mb-6">💡</div>
          <h1 className="text-6xl font-black mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            How can we help you?
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Search our knowledge base or browse categories to find answers
          </p>

          {/* Search */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for help articles, guides, tutorials..."
                className="w-full px-6 py-5 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-lg shadow-xl"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg transition">
                Search
              </button>
            </div>
            <div className="flex gap-3 mt-4 justify-center flex-wrap">
              {['Getting Started', 'API Docs', 'Pricing', 'Legal Docs', 'Security'].map((tag) => (
                <button key={tag} className="px-4 py-2 bg-white border-2 border-gray-200 rounded-xl text-sm font-semibold hover:border-blue-400 hover:text-blue-600 transition">
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Help Categories */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-black text-center mb-12 text-gray-900">Browse by Category</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {helpCategories.map((category, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition border-2 border-gray-100 hover:border-blue-300">
                <div className="text-5xl mb-4">{category.icon}</div>
                <h3 className="text-2xl font-black text-gray-900 mb-3">{category.title}</h3>
                <p className="text-gray-600 mb-6">{category.description}</p>
                <ul className="space-y-3">
                  {category.articles.map((article, i) => (
                    <li key={i}>
                      <Link href={`/help/${category.title.toLowerCase().replace(/\s+/g, '-')}/${i}`} className="text-blue-600 hover:text-purple-600 font-semibold flex items-center gap-2 group">
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                        {article}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 bg-white/50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-black text-center mb-12 text-gray-900">Frequently Asked Questions</h2>
          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                  className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition"
                >
                  <span className="text-lg font-bold text-gray-900">{faq.q}</span>
                  <span className={`text-2xl transition-transform ${expandedFaq === idx ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>
                {expandedFaq === idx && (
                  <div className="px-8 py-6 bg-gradient-to-br from-blue-50 to-white border-t-2 border-blue-200">
                    <p className="text-gray-700 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-black text-center mb-12 text-gray-900">Still need help?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {contactOptions.map((option, idx) => (
              <a
                key={idx}
                href={option.link}
                className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition border-2 border-blue-200 hover:border-blue-400 text-center group"
              >
                <div className="text-5xl mb-4">{option.icon}</div>
                <h3 className="text-xl font-black text-gray-900 mb-2">{option.title}</h3>
                <p className="text-blue-600 font-bold mb-2">{option.value}</p>
                <p className="text-sm text-gray-600">{option.desc}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-black text-white mb-8">Popular Resources</h2>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/api-docs" className="px-6 py-3 bg-white text-blue-600 rounded-xl font-bold hover:bg-gray-100 transition shadow-lg">
              📚 API Documentation
            </Link>
            <Link href="/pricing" className="px-6 py-3 bg-white text-blue-600 rounded-xl font-bold hover:bg-gray-100 transition shadow-lg">
              💰 View Pricing
            </Link>
            <Link href="/security" className="px-6 py-3 bg-white text-blue-600 rounded-xl font-bold hover:bg-gray-100 transition shadow-lg">
              🔐 Security Overview
            </Link>
            <Link href="/contact" className="px-6 py-3 bg-white text-blue-600 rounded-xl font-bold hover:bg-gray-100 transition shadow-lg">
              📞 Contact Support
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-6 text-center">
          <p>© 2025 DeepClean AI. All rights reserved.</p>
          <div className="flex justify-center gap-6 mt-4 text-sm">
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
            <Link href="/security" className="hover:text-white">Security</Link>
            <Link href="/contact" className="hover:text-white">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
