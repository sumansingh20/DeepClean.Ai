'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState('mission');

  const team = [
    {
      name: 'Dr. Rajesh Kumar',
      role: 'Founder & CEO',
      bio: 'Former DRDO scientist with 15+ years in AI research'
    },
    {
      name: 'Priya Sharma',
      role: 'CTO',
      bio: 'Ex-Google AI, computer vision specialist'
    },
    {
      name: 'Dr. Amit Patel',
      role: 'Chief Data Scientist',
      bio: 'PhD ML from IIT Bombay, 40+ published papers'
    },
    {
      name: 'Sneha Reddy',
      role: 'Head of Legal',
      bio: 'Former prosecutor, cyber law expert'
    }
  ];

  const stats = [
    { value: '500+', label: 'Organizations' },
    { value: '100K+', label: 'Cases Analyzed' },
    { value: '94.2%', label: 'Detection Accuracy' },
    { value: '50+', label: 'Team Members' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
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
            <div className="flex items-center gap-6">
              <Link href="/pricing" className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors">Pricing</Link>
              <Link href="/login" className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-bold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">Get Started</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-5xl mx-auto mb-20">
            <h1 className="text-7xl font-extrabold text-gray-900 mb-8 tracking-tight">
              About <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 bg-clip-text text-transparent">DeepClean.AI</span>
            </h1>
            <p className="text-2xl text-gray-600 leading-relaxed font-medium">
              India's leading platform for detecting deepfakes and protecting digital identity
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto mb-20">
            {stats.map((stat, idx) => (
              <div key={idx} className="glass dark:bg-dark-200/50 rounded-2xl p-8 text-center shadow-xl border border-white/20 dark:border-dark-300 card-hover">
                <div className="text-4xl font-black gradient-text dark:text-blue-400 mb-2">{stat.value}</div>
                <div className="text-gray-600 dark:text-dark-600 font-semibold">{stat.label}</div>
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
                      : 'glass dark:bg-dark-200/50 text-gray-700 dark:text-dark-700 hover:shadow-lg'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="glass dark:bg-dark-200/50 rounded-3xl p-12 border border-white/20 dark:border-dark-300 shadow-2xl">
              {activeTab === 'mission' && (
                <div className="animate-fade-in">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Our Mission</h2>
                  <p className="text-lg text-gray-700 dark:text-dark-700 leading-relaxed mb-6">
                    Provide accessible and accurate deepfake detection technology to citizens and organizations.
                  </p>
                  <p className="text-base text-gray-600 dark:text-dark-600 leading-relaxed">
                    As AI-generated content becomes more sophisticated, verifying authenticity is critical. Our platform helps identify manipulated media to protect reputation and prevent fraud.
                  </p>
                </div>
              )}

              {activeTab === 'story' && (
                <div className="animate-fade-in">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Our Story</h2>
                  <p className="text-base text-gray-700 dark:text-dark-700 leading-relaxed mb-4">
                    Founded in 2023 to address the growing threat of deepfakes. Our team combines expertise in machine learning, computer vision, and cybersecurity.
                  </p>
                  <p className="text-base text-gray-700 dark:text-dark-700 leading-relaxed mb-4">
                    We built this platform to help individuals and organizations detect manipulated media quickly and accurately.
                  </p>
                  <p className="text-base text-gray-700 dark:text-dark-700 leading-relaxed">
                    Currently serving over 500 organizations with more than 100,000 analyses completed.
                  </p>
                </div>
              )}

              {activeTab === 'values' && (
                <div className="animate-fade-in">
                  <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-8">Our Values</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-dark-300 p-6 rounded-2xl border-2 border-blue-200 dark:border-blue-800">
                      <h3 className="text-xl font-black text-blue-900 dark:text-blue-400 mb-3">🎯 Accuracy First</h3>
                      <p className="text-gray-700 dark:text-dark-700">We maintain 94.2% detection accuracy because lives depend on it.</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-white dark:from-green-900/20 dark:to-dark-300 p-6 rounded-2xl border-2 border-green-200 dark:border-green-800">
                      <h3 className="text-xl font-black text-green-900 dark:text-green-400 mb-3">🔒 Privacy Always</h3>
                      <p className="text-gray-700 dark:text-dark-700">Your data is encrypted and never shared. Period.</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-dark-300 p-6 rounded-2xl border-2 border-purple-200 dark:border-purple-800">
                      <h3 className="text-xl font-black text-purple-900 dark:text-purple-400 mb-3">🚀 Innovation Daily</h3>
                      <p className="text-gray-700 dark:text-dark-700">We update our models weekly to stay ahead of threats.</p>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-white dark:from-orange-900/20 dark:to-dark-300 p-6 rounded-2xl border-2 border-orange-200 dark:border-orange-800">
                      <h3 className="text-xl font-black text-orange-900 dark:text-orange-400 mb-3">🤝 Transparency</h3>
                      <p className="text-gray-700 dark:text-dark-700">Our detection methods are audited and published.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Team */}
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-black text-center text-gray-900 dark:text-white mb-4">Meet Our Team</h2>
            <p className="text-xl text-center text-gray-600 dark:text-dark-600 mb-12">World-class experts in AI, security, and law</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, idx) => (
                <div key={idx} className="glass dark:bg-dark-200/50 rounded-3xl p-8 shadow-xl border border-white/20 dark:border-dark-300 card-hover">
                  <h3 className="text-xl font-black text-gray-900 dark:text-white text-center mb-2">{member.name}</h3>
                  <div className="text-blue-600 dark:text-blue-400 font-semibold text-center mb-4">{member.role}</div>
                  <p className="text-gray-600 dark:text-dark-600 text-center text-sm">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="max-w-4xl mx-auto mt-20 glass dark:bg-dark-200/50 rounded-3xl p-12 text-center shadow-2xl border border-white/20 dark:border-dark-300">
            <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-6">Join Our Mission</h2>
            <p className="text-xl text-gray-600 dark:text-dark-600 mb-8">
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
