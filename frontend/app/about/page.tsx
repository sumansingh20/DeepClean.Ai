'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState('mission');

  const team = [
    {
      name: 'Dr. Rajesh Kumar',
      role: 'Founder & CEO',
      image: '👨‍💼',
      bio: 'Former DRDO scientist, AI researcher with 15+ years in deepfake detection',
      linkedin: '#'
    },
    {
      name: 'Priya Sharma',
      role: 'CTO',
      image: '👩‍💻',
      bio: 'Ex-Google AI, specialized in computer vision and neural networks',
      linkedin: '#'
    },
    {
      name: 'Dr. Amit Patel',
      role: 'Chief Data Scientist',
      image: '👨‍🔬',
      bio: 'PhD in Machine Learning from IIT Bombay, published 40+ papers',
      linkedin: '#'
    },
    {
      name: 'Sneha Reddy',
      role: 'Head of Legal',
      image: '👩‍⚖️',
      bio: 'Former Additional Public Prosecutor, cyber law expert',
      linkedin: '#'
    },
    {
      name: 'Vikram Singh',
      role: 'VP Engineering',
      image: '👨‍💻',
      bio: 'Ex-Microsoft, built scalable systems for 100M+ users',
      linkedin: '#'
    },
    {
      name: 'Ananya Krishnan',
      role: 'Head of Research',
      image: '👩‍🔬',
      bio: 'AI researcher, Stanford PhD, GAN detection specialist',
      linkedin: '#'
    }
  ];

  const timeline = [
    { year: '2023', event: 'DeepClean AI Founded', desc: 'Started with a mission to protect India from deepfakes' },
    { year: '2023', event: 'Seed Funding', desc: 'Raised $2M from leading VCs' },
    { year: '2024', event: 'Government Partnership', desc: 'Partnered with MeitY for national rollout' },
    { year: '2024', event: 'Series A', desc: 'Raised $15M, expanded to 50+ employees' },
    { year: '2025', event: '100K+ Cases', desc: 'Analyzed over 100,000 deepfake cases' },
    { year: '2025', event: 'International Expansion', desc: 'Launched in 5 Asian countries' }
  ];

  const stats = [
    { value: '500+', label: 'Organizations', icon: '🏢' },
    { value: '100K+', label: 'Cases Analyzed', icon: '🔍' },
    { value: '94.2%', label: 'Detection Accuracy', icon: '🎯' },
    { value: '50+', label: 'Team Members', icon: '👥' }
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
              About <span className="gradient-text">DeepClean AI</span>
            </h1>
            <p className="text-2xl text-gray-600 leading-relaxed">
              India's leading AI-powered platform protecting citizens and organizations from deepfake threats
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto mb-20">
            {stats.map((stat, idx) => (
              <div key={idx} className="glass rounded-2xl p-8 text-center shadow-xl border border-white/20 card-hover">
                <div className="text-5xl mb-4">{stat.icon}</div>
                <div className="text-4xl font-black gradient-text mb-2">{stat.value}</div>
                <div className="text-gray-600 font-semibold">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="max-w-6xl mx-auto mb-12">
            <div className="flex justify-center gap-4 mb-8">
              {['mission', 'story', 'values'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-8 py-4 rounded-xl font-bold text-lg capitalize transition-all ${
                    activeTab === tab
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl'
                      : 'glass text-gray-700 hover:shadow-lg'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="glass rounded-3xl p-12 border border-white/20 shadow-2xl">
              {activeTab === 'mission' && (
                <div className="animate-fade-in">
                  <h2 className="text-4xl font-black text-gray-900 mb-6">Our Mission</h2>
                  <p className="text-xl text-gray-700 leading-relaxed mb-6">
                    To build a safer digital India by providing accessible, accurate, and actionable deepfake detection technology to every citizen and organization.
                  </p>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    We believe that as AI-generated content becomes more sophisticated, the right to verify authenticity should be a fundamental digital right. DeepClean AI democratizes access to advanced detection technology, ensuring that deepfakes don't destroy reputations, relationships, or trust.
                  </p>
                </div>
              )}

              {activeTab === 'story' && (
                <div className="animate-fade-in">
                  <h2 className="text-4xl font-black text-gray-900 mb-6">Our Story</h2>
                  <p className="text-lg text-gray-700 leading-relaxed mb-4">
                    DeepClean AI was born out of a personal experience. In 2022, our founder witnessed a close friend's reputation destroyed by a deepfake video that went viral. Despite knowing it was fake, the damage was irreversible.
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed mb-4">
                    This incident sparked a mission: to create a platform that could instantly detect and prove deepfakes, giving victims the tools to fight back. We assembled a team of India's brightest AI researchers, engineers, and legal experts.
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Today, we're proud to serve 500+ organizations and have helped resolve over 100,000 cases, protecting countless individuals from digital fraud and misinformation.
                  </p>
                </div>
              )}

              {activeTab === 'values' && (
                <div className="animate-fade-in">
                  <h2 className="text-4xl font-black text-gray-900 mb-8">Our Values</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-2xl border-2 border-blue-200">
                      <h3 className="text-xl font-black text-blue-900 mb-3">🎯 Accuracy First</h3>
                      <p className="text-gray-700">We maintain 94.2% detection accuracy because lives depend on it.</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-2xl border-2 border-green-200">
                      <h3 className="text-xl font-black text-green-900 mb-3">🔒 Privacy Always</h3>
                      <p className="text-gray-700">Your data is encrypted and never shared. Period.</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-2xl border-2 border-purple-200">
                      <h3 className="text-xl font-black text-purple-900 mb-3">🚀 Innovation Daily</h3>
                      <p className="text-gray-700">We update our models weekly to stay ahead of threats.</p>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-white p-6 rounded-2xl border-2 border-orange-200">
                      <h3 className="text-xl font-black text-orange-900 mb-3">🤝 Transparency</h3>
                      <p className="text-gray-700">Our detection methods are audited and published.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Timeline */}
          <div className="max-w-6xl mx-auto mb-20">
            <h2 className="text-4xl font-black text-center text-gray-900 mb-12">Our Journey</h2>
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-blue-600 to-purple-600"></div>
              <div className="space-y-12">
                {timeline.map((item, idx) => (
                  <div key={idx} className={`flex items-center gap-8 ${idx % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                    <div className={`flex-1 ${idx % 2 === 0 ? 'text-right' : 'text-left'}`}>
                      <div className="glass rounded-2xl p-6 shadow-xl border border-white/20 inline-block">
                        <div className="text-3xl font-black gradient-text mb-2">{item.year}</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{item.event}</h3>
                        <p className="text-gray-600">{item.desc}</p>
                      </div>
                    </div>
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full border-4 border-white shadow-xl z-10"></div>
                    <div className="flex-1"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Team */}
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-black text-center text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-center text-gray-600 mb-12">World-class experts in AI, security, and law</p>
            <div className="grid md:grid-cols-3 gap-8">
              {team.map((member, idx) => (
                <div key={idx} className="glass rounded-3xl p-8 shadow-xl border border-white/20 card-hover">
                  <div className="text-8xl text-center mb-6">{member.image}</div>
                  <h3 className="text-2xl font-black text-gray-900 text-center mb-2">{member.name}</h3>
                  <div className="text-blue-600 font-bold text-center mb-4">{member.role}</div>
                  <p className="text-gray-600 text-center text-sm mb-6">{member.bio}</p>
                  <div className="text-center">
                    <a href={member.linkedin} className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold">
                      <span>🔗</span> LinkedIn
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="max-w-4xl mx-auto mt-20 glass rounded-3xl p-12 text-center shadow-2xl border border-white/20">
            <h2 className="text-4xl font-black text-gray-900 mb-6">Join Our Mission</h2>
            <p className="text-xl text-gray-600 mb-8">
              We're always looking for talented individuals passionate about fighting deepfakes
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="btn-primary text-xl px-12 py-5">
                Get Started Free
              </Link>
              <button className="btn-secondary text-xl px-12 py-5">
                View Careers
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
