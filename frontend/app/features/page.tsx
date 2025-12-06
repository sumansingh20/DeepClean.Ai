'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function FeaturesPage() {
  const [selectedFeature, setSelectedFeature] = useState<number | null>(null);
  const mainFeatures = [
    {
      title: 'Voice Detection',
      description: 'AI analysis using Wav2Vec2, MFCC, and spectral analysis',
      accuracy: '91.8%',
      speed: '3 seconds',
      features: [
        'Real-time voice cloning detection',
        'Speaker verification',
        'Audio forensic analysis',
        'Frequency spectrum analysis'
      ]
    },
    {
      title: 'Video Detection',
      description: 'Multi-frame analysis with facial landmark tracking',
      accuracy: '94.2%',
      speed: '12 seconds',
      features: [
        'Face swap detection',
        'Expression manipulation detection',
        'Temporal consistency analysis',
        'Lip-sync verification'
      ]
    },
    {
      title: 'Document Verification',
      description: 'OCR verification and template matching for ID documents',
      accuracy: '89.5%',
      speed: '1.2 seconds',
      features: [
        'ID card verification',
        'Passport authentication',
        'Bank statement validation',
        'Digital signature verification'
      ]
    },
    {
      title: 'Liveness Detection',
      description: 'Real-time blink detection and anti-replay',
      accuracy: '96.1%',
      speed: '0.8 seconds',
      features: [
        'Blink detection',
        'Head movement analysis',
        'Anti-spoofing technology',
        '3D depth sensing'
      ]
    }
  ];

  const additionalFeatures = [
    {
      category: 'Enterprise Features',
      icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
      items: [
        { name: 'White-label Solution', desc: 'Branded interface for your organization' },
        { name: 'API Integration', desc: 'RESTful API with comprehensive documentation' },
        { name: 'Bulk Processing', desc: 'Analyze thousands of files simultaneously' },
        { name: 'Custom Models', desc: 'Train models on your specific use cases' },
        { name: 'On-premise Deployment', desc: 'Host on your own infrastructure' },
        { name: 'SSO Integration', desc: 'SAML, OAuth, Active Directory support' }
      ]
    },
    {
      category: 'Security & Compliance',
      icon: '🔒',
      items: [
        { name: '256-bit Encryption', desc: 'Military-grade data protection' },
        { name: 'ISO 27001 Certified', desc: 'International security standard' },
        { name: 'GDPR Compliant', desc: 'Full data privacy compliance' },
        { name: 'SOC 2 Type II', desc: 'Audited security controls' },
        { name: 'Data Residency', desc: 'Store data in your preferred region' },
        { name: 'Audit Logs', desc: 'Complete activity tracking' }
      ]
    },
    {
      category: 'Collaboration Tools',
      icon: '👥',
      items: [
        { name: 'Team Workspace', desc: 'Collaborative case management' },
        { name: 'Role-based Access', desc: 'Granular permission controls' },
        { name: 'Case Comments', desc: 'Internal team discussions' },
        { name: 'Assignment System', desc: 'Assign cases to team members' },
        { name: 'Activity Feed', desc: 'Real-time updates on all cases' },
        { name: 'Email Notifications', desc: 'Customizable alert system' }
      ]
    },
    {
      category: 'Analytics & Reporting',
      icon: '📊',
      items: [
        { name: 'Custom Dashboards', desc: 'Build your own analytics views' },
        { name: 'Export Reports', desc: 'PDF, Excel, JSON formats' },
        { name: 'Trend Analysis', desc: 'Historical pattern detection' },
        { name: 'Performance Metrics', desc: 'Track detection accuracy over time' },
        { name: 'Cost Analytics', desc: 'Monitor API usage and costs' },
        { name: 'Custom Alerts', desc: 'Set thresholds for notifications' }
      ]
    }
  ];

  const integrations = [
    { name: 'Slack', icon: '💬', desc: 'Get alerts in your Slack channels' },
    { name: 'Microsoft Teams', icon: '👔', desc: 'Integrate with Teams workflows' },
    { name: 'Jira', icon: '🎫', desc: 'Create tickets automatically' },
    { name: 'Salesforce', icon: '☁️', desc: 'CRM integration for sales teams' },
    { name: 'Zapier', icon: '⚡', desc: 'Connect 5000+ apps' },
    { name: 'AWS', icon: '☁️', desc: 'Deploy on Amazon infrastructure' },
    { name: 'Google Cloud', icon: '☁️', desc: 'GCP integration' },
    { name: 'Azure', icon: '☁️', desc: 'Microsoft Azure support' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-2xl border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-24">
            <Link href="/" className="flex items-center gap-3.5 group">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                <span className="text-white font-black text-lg">DC</span>
              </div>
              <span className="font-black text-gray-900 text-xl tracking-tight">DeepClean.AI</span>
            </Link>
            <div className="flex items-center gap-12">
              <Link href="/pricing" className="text-sm font-bold text-gray-700 hover:text-blue-600 transition-colors duration-200">Pricing</Link>
              <Link href="/login" className="px-7 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white text-sm font-bold rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">Get Started</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-44 pb-32 px-6 bg-gradient-to-br from-blue-50/30 via-white via-50% to-indigo-50/20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-7xl md:text-8xl font-black text-gray-900 mb-10 tracking-tight leading-[1.02]">
            Powerful <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">Features</span>
          </h1>
          <p className="text-2xl text-gray-600 max-w-3xl mx-auto font-medium leading-relaxed">
            6 AI engines working simultaneously to detect deepfakes with 94.2% accuracy
          </p>
          </div>

          {/* Main Features */}
          <div className="max-w-7xl mx-auto mb-20">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {mainFeatures.map((feature, idx) => (
                <div
                  key={idx}
                  className="glass dark:bg-dark-200/50 rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-dark-300 card-hover"
                >
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-dark-600 mb-6">{feature.description}</p>
                  
                  <div className="flex items-center gap-4 mb-6 pb-6 border-b-2 border-gray-200 dark:border-dark-200">
                    <div className="flex-1 text-center">
                      <div className="text-xs text-gray-500 dark:text-dark-600 uppercase font-bold mb-1">Accuracy</div>
                      <div className="text-2xl font-black text-green-600 dark:text-green-400">{feature.accuracy}</div>
                    </div>
                    <div className="w-px h-12 bg-gray-300 dark:bg-dark-300"></div>
                    <div className="flex-1 text-center">
                      <div className="text-xs text-gray-500 dark:text-dark-600 uppercase font-bold mb-1">Speed</div>
                      <div className="text-2xl font-black text-blue-600 dark:text-blue-400">{feature.speed}</div>
                    </div>
                  </div>

                  <ul className="space-y-2 mb-6">
                    {feature.features.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-700 dark:text-dark-700">
                        <span className="text-green-500">✓</span>
                        <span className="font-semibold">{item}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => setSelectedFeature(selectedFeature === idx ? null : idx)}
                    className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-2xl hover:shadow-blue-500/50 transition-all transform hover:scale-105"
                  >
                    {selectedFeature === idx ? 'Show Less ↑' : 'Learn More →'}
                  </button>

                  {selectedFeature === idx && (
                    <div className="mt-6 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border-2 border-blue-200 dark:border-blue-800 animate-fade-in">
                      <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-3">How It Works</h4>
                      <div className="space-y-3 text-sm text-gray-700 dark:text-dark-700">
                        <p><strong>🔬 Technology:</strong> Powered by state-of-the-art deep learning models trained on millions of samples</p>
                        <p><strong>⚡ Processing:</strong> Cloud-based GPU acceleration for real-time analysis</p>
                        <p><strong>📊 Output:</strong> Detailed confidence scores with visual explanations</p>
                        <p><strong>🔗 Integration:</strong> REST API, Python SDK, and web interface</p>
                      </div>
                      <div className="mt-4 flex gap-3">
                        <Link href="/analysis" className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
                          Try Now
                        </Link>
                        <Link href="/api-docs" className="px-4 py-2 bg-white border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition">
                          API Docs
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Additional Features */}
          <div className="max-w-7xl mx-auto mb-20">
            <h2 className="text-4xl font-black text-center text-gray-900 dark:text-white mb-12">
              Complete Platform Features
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {additionalFeatures.map((section, idx) => (
                <div key={idx} className="glass dark:bg-dark-200/50 rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-dark-300">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="text-5xl">{section.icon}</div>
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white">{section.category}</h3>
                  </div>
                  <div className="space-y-4">
                    {section.items.map((item, i) => (
                      <div key={i} className="bg-gradient-to-r from-blue-50 to-white dark:from-blue-900/20 dark:to-dark-300 p-4 rounded-xl border-2 border-blue-200 dark:border-blue-800">
                        <h4 className="font-bold text-gray-900 dark:text-white mb-1">{item.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-dark-600">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Integrations */}
          <div className="max-w-7xl mx-auto mb-20">
            <h2 className="text-4xl font-black text-center text-gray-900 dark:text-white mb-4">
              Seamless Integrations
            </h2>
            <p className="text-xl text-center text-gray-600 dark:text-dark-600 mb-12">
              Connect DeepClean AI with your existing tools and workflows
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {integrations.map((integration, idx) => (
                <div
                  key={idx}
                  className="glass dark:bg-dark-200/50 rounded-2xl p-6 shadow-xl border border-white/20 dark:border-dark-300 text-center card-hover"
                >
                  <div className="text-5xl mb-3">{integration.icon}</div>
                  <h4 className="font-black text-gray-900 dark:text-white mb-2">{integration.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-dark-600">{integration.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="max-w-4xl mx-auto glass dark:bg-dark-200/50 rounded-3xl p-12 text-center shadow-2xl border border-white/20 dark:border-dark-300">
            <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-6">
              Ready to Experience These Features?
            </h2>
            <p className="text-xl text-gray-600 dark:text-dark-600 mb-8">
              Start your free 14-day trial. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="btn-primary text-xl px-12 py-5">
                Start Free Trial
              </Link>
              <Link href="/analysis" className="btn-secondary text-xl px-12 py-5">
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
