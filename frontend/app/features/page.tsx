'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function FeaturesPage() {
  const [selectedFeature, setSelectedFeature] = useState<number | null>(null);
  const mainFeatures = [
    {
      icon: '🎤',
      title: 'Voice Deepfake Detection',
      description: 'Advanced AI analysis using Wav2Vec2, MFCC, and spectral analysis',
      accuracy: '91.8%',
      speed: '3 seconds',
      color: 'from-blue-500 to-cyan-500',
      features: [
        'Real-time voice cloning detection',
        'Speaker verification',
        'Audio forensic analysis',
        'Frequency spectrum analysis',
        'Neural vocoder detection'
      ]
    },
    {
      icon: '🎥',
      title: 'Video Deepfake Detection',
      description: 'Multi-frame analysis with facial landmark tracking and GAN fingerprinting',
      accuracy: '94.2%',
      speed: '12 seconds',
      color: 'from-purple-500 to-pink-500',
      features: [
        'Face swap detection',
        'Expression manipulation detection',
        'Temporal consistency analysis',
        'GAN artifact identification',
        'Lip-sync verification'
      ]
    },
    {
      icon: '📄',
      title: 'Document Forgery Detection',
      description: 'OCR-based verification and template matching for ID documents',
      accuracy: '89.5%',
      speed: '1.2 seconds',
      color: 'from-green-500 to-emerald-500',
      features: [
        'ID card verification',
        'Passport authentication',
        'Bank statement validation',
        'Digital signature verification',
        'Template matching'
      ]
    },
    {
      icon: '👁️',
      title: 'Liveness Detection',
      description: 'Real-time blink detection and anti-replay mechanisms',
      accuracy: '96.1%',
      speed: '0.8 seconds',
      color: 'from-orange-500 to-red-500',
      features: [
        'Blink detection',
        'Head movement analysis',
        'Anti-spoofing technology',
        '3D depth sensing',
        'Challenge-response verification'
      ]
    },
    {
      icon: '📞',
      title: 'Scam Call Analysis',
      description: 'ASR with NLP pattern matching for fraud detection',
      accuracy: '88.3%',
      speed: '5 seconds',
      color: 'from-yellow-500 to-orange-500',
      features: [
        'Voice stress analysis',
        'Fraud pattern detection',
        'Real-time transcription',
        'Emotion recognition',
        'Caller ID verification'
      ]
    },
    {
      icon: '⚖️',
      title: 'Legal Automation',
      description: 'Generate court-ready evidence packages and legal documents',
      accuracy: '100%',
      speed: '0.3 seconds',
      color: 'from-indigo-500 to-purple-500',
      features: [
        'DMCA takedown notices',
        'IT Act FIR drafts',
        'Evidence packaging',
        'Platform takedown requests',
        'Court-ready reports'
      ]
    }
  ];

  const additionalFeatures = [
    {
      category: 'Enterprise Features',
      icon: '🏢',
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <nav className="glass sticky top-0 z-50 border-b border-white/20 shadow-xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg">
                DC
              </div>
              <span className="text-2xl font-black gradient-text">DeepClean AI</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/pricing" className="text-gray-700 hover:text-blue-600 font-semibold">Pricing</Link>
              <Link href="/login" className="btn-primary">Get Started</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h1 className="text-6xl font-black text-gray-900 mb-6">
              Powerful <span className="gradient-text">Features</span>
            </h1>
            <p className="text-2xl text-gray-600">
              6 AI engines working simultaneously to detect deepfakes with 94.2% accuracy
            </p>
          </div>

          {/* Main Features */}
          <div className="max-w-7xl mx-auto mb-20">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {mainFeatures.map((feature, idx) => (
                <div
                  key={idx}
                  className="glass rounded-3xl p-8 shadow-2xl border border-white/20 card-hover"
                >
                  <div className={`w-20 h-20 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center text-4xl shadow-xl mb-6`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 mb-6">{feature.description}</p>
                  
                  <div className="flex items-center gap-4 mb-6 pb-6 border-b-2 border-gray-200">
                    <div className="flex-1 text-center">
                      <div className="text-xs text-gray-500 uppercase font-bold mb-1">Accuracy</div>
                      <div className="text-2xl font-black text-green-600">{feature.accuracy}</div>
                    </div>
                    <div className="w-px h-12 bg-gray-300"></div>
                    <div className="flex-1 text-center">
                      <div className="text-xs text-gray-500 uppercase font-bold mb-1">Speed</div>
                      <div className="text-2xl font-black text-blue-600">{feature.speed}</div>
                    </div>
                  </div>

                  <ul className="space-y-2 mb-6">
                    {feature.features.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
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
                    <div className="mt-6 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200 animate-fade-in">
                      <h4 className="font-bold text-lg text-gray-900 mb-3">How It Works</h4>
                      <div className="space-y-3 text-sm text-gray-700">
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
            <h2 className="text-4xl font-black text-center text-gray-900 mb-12">
              Complete Platform Features
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {additionalFeatures.map((section, idx) => (
                <div key={idx} className="glass rounded-3xl p-8 shadow-2xl border border-white/20">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="text-5xl">{section.icon}</div>
                    <h3 className="text-2xl font-black text-gray-900">{section.category}</h3>
                  </div>
                  <div className="space-y-4">
                    {section.items.map((item, i) => (
                      <div key={i} className="bg-gradient-to-r from-blue-50 to-white p-4 rounded-xl border-2 border-blue-200">
                        <h4 className="font-bold text-gray-900 mb-1">{item.name}</h4>
                        <p className="text-sm text-gray-600">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Integrations */}
          <div className="max-w-7xl mx-auto mb-20">
            <h2 className="text-4xl font-black text-center text-gray-900 mb-4">
              Seamless Integrations
            </h2>
            <p className="text-xl text-center text-gray-600 mb-12">
              Connect DeepClean AI with your existing tools and workflows
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {integrations.map((integration, idx) => (
                <div
                  key={idx}
                  className="glass rounded-2xl p-6 shadow-xl border border-white/20 text-center card-hover"
                >
                  <div className="text-5xl mb-3">{integration.icon}</div>
                  <h4 className="font-black text-gray-900 mb-2">{integration.name}</h4>
                  <p className="text-sm text-gray-600">{integration.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="max-w-4xl mx-auto glass rounded-3xl p-12 text-center shadow-2xl border border-white/20">
            <h2 className="text-4xl font-black text-gray-900 mb-6">
              Ready to Experience These Features?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
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
