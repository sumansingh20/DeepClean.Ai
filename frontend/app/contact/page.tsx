'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general'
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSubmitted(true);
    setLoading(false);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '', category: 'general' });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16">
          <div className="flex justify-between items-center h-full">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">DC</span>
              </div>
              <div>
                <span className="font-bold text-base text-gray-900">DeepClean.AI</span>
                <span className="block text-xs text-green-600 font-semibold -mt-1">100% FREE</span>
              </div>
            </Link>
            <Link href="/" className="px-4 py-2 text-sm text-gray-700 hover:text-pink-600 font-medium transition">
              ← Back to Home
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-purple-50 via-pink-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Get in Touch
          </h1>
          <p className="text-lg text-gray-600">
            We're here to help. Reach out for support, questions, or just to say hi.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
            
            {submitted ? (
              <div className="bg-green-50 border-2 border-green-500 rounded-xl p-8 text-center">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                <p className="text-gray-600">We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-900"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-900"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-900"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="incident">Report Incident</option>
                    <option value="partnership">Partnership</option>
                    <option value="press">Press & Media</option>
                    <option value="feedback">Feedback</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Subject *</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-900"
                    placeholder="Brief subject line"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-900 resize-none"
                    placeholder="Tell us what you need help with..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  We typically respond within 24 hours
                </p>
              </form>
            )}
          </div>

          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Other Ways to Reach Us</h2>
            
            <div className="space-y-4 mb-8">
              {[
                {
                  icon: (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  ),
                  title: 'Email Support',
                  value: 'support@deepclean.ai',
                  desc: 'Response within 24 hours',
                  color: 'pink'
                },
                {
                  icon: (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  ),
                  title: 'Emergency Hotline',
                  value: '1800-123-SAFE',
                  desc: '24/7 for critical cases',
                  color: 'red'
                },
                {
                  icon: (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  ),
                  title: 'Help Center',
                  value: 'Visit FAQ →',
                  desc: 'Find answers instantly',
                  color: 'blue'
                },
                {
                  icon: (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                      <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                    </svg>
                  ),
                  title: 'Live Chat',
                  value: 'Chat with us',
                  desc: 'Mon-Fri, 9 AM - 6 PM IST',
                  color: 'green'
                }
              ].map((item, idx) => (
                <div key={idx} className={`p-4 bg-${item.color}-50 border border-${item.color}-200 rounded-lg`}>
                  <div className="flex items-start gap-4">
                    <div className={`p-2 bg-${item.color}-100 rounded-lg text-${item.color}-600`}>
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                      <p className={`text-${item.color}-600 font-semibold text-sm mb-1`}>{item.value}</p>
                      <p className="text-xs text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Social Links */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-4">Follow Us</h3>
              <div className="flex gap-3">
                {['Twitter', 'LinkedIn', 'Instagram', 'YouTube'].map((social) => (
                  <button
                    key={social}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:border-pink-500 hover:text-pink-600 transition text-sm font-medium"
                  >
                    {social}
                  </button>
                ))}
              </div>
            </div>

            {/* Address */}
            <div className="mt-8 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl p-6">
              <h3 className="font-bold mb-2">Office</h3>
              <p className="text-sm text-pink-100">
                DeepClean.AI<br />
                Innovation Hub, Bangalore<br />
                Karnataka, India 560001
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xs">DC</span>
                </div>
                <span className="text-white font-bold text-sm">DeepClean.AI</span>
              </div>
              <p className="text-xs leading-relaxed mb-2">Free deepfake detection for women's safety</p>
              <p className="text-xs text-green-400 font-semibold">100% Free Forever</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3 text-xs">Product</h4>
              <div className="space-y-2 text-xs">
                <Link href="/analysis" className="block hover:text-pink-400 transition">Analysis</Link>
                <Link href="/features" className="block hover:text-pink-400 transition">Features</Link>
                <Link href="/pricing" className="block hover:text-pink-400 transition">Pricing</Link>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3 text-xs">Company</h4>
              <div className="space-y-2 text-xs">
                <Link href="/about" className="block hover:text-pink-400 transition">About</Link>
                <Link href="/contact" className="block hover:text-pink-400 transition">Contact</Link>
                <Link href="/careers" className="block hover:text-pink-400 transition">Careers</Link>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3 text-xs">Legal</h4>
              <div className="space-y-2 text-xs">
                <Link href="/privacy" className="block hover:text-pink-400 transition">Privacy</Link>
                <Link href="/terms" className="block hover:text-pink-400 transition">Terms</Link>
                <Link href="/security" className="block hover:text-pink-400 transition">Security</Link>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 text-xs text-center">
            <p className="text-gray-500">© 2025 DeepClean.AI. All rights reserved. <span className="text-pink-500 font-medium">Made in India</span> 🇮🇳</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
      value: 'sales@deepclean.ai',
      desc: 'Custom solutions & pricing',
      link: 'mailto:sales@deepclean.ai'
    }
  ];

  const offices = [
    {
      city: 'Bengaluru',
      address: 'Koramangala, Bengaluru, Karnataka 560034',
      type: 'Headquarters'
    },
    {
      city: 'New Delhi',
      address: 'Connaught Place, New Delhi, Delhi 110001',
      type: 'Government Relations'
    },
    {
      city: 'Mumbai',
      address: 'Bandra-Kurla Complex, Mumbai, Maharashtra 400051',
      type: 'Sales Office'
    }
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
            <Link href="/dashboard" className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-bold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">Dashboard</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-5xl mx-auto mb-20">
            <h1 className="text-7xl font-extrabold text-gray-900 mb-8 tracking-tight">
              Get In <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 bg-clip-text text-transparent">Touch</span>
            </h1>
            <p className="text-2xl text-gray-600 leading-relaxed font-medium">
              Have questions? We're here to help 24/7
            </p>
          </div>

          {/* Contact Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-20">
            {contactInfo.map((info, idx) => (
              <a
                key={idx}
                href={info.link}
                className="glass dark:bg-dark-200/50 rounded-2xl p-6 shadow-xl border border-white/20 dark:border-dark-300 card-hover group"
              >
                <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2">{info.title}</h3>
                <div className="text-blue-600 dark:text-blue-400 font-bold mb-2">{info.value}</div>
                <p className="text-sm text-gray-600 dark:text-dark-600">{info.desc}</p>
              </a>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
            {/* Contact Form */}
            <div className="glass dark:bg-dark-200/50 rounded-3xl p-10 shadow-2xl border border-white/20 dark:border-dark-300">
              <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-6">Send us a Message</h2>
              
              {submitted && (
                <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/20 border-2 border-green-500 dark:border-green-700 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">✅</span>
                    <div>
                      <p className="font-bold text-green-900 dark:text-green-300">Message Sent Successfully!</p>
                      <p className="text-sm text-green-700 dark:text-green-400">We'll respond within 24 hours.</p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-dark-700 mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-dark-300 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition bg-white dark:bg-dark-200 text-gray-900 dark:text-white"
                      placeholder="Priya Sharma"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-dark-700 mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-dark-300 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition bg-white dark:bg-dark-200 text-gray-900 dark:text-white"
                      placeholder="contact@company.co.in"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-dark-700 mb-2">Organization</label>
                    <input
                      type="text"
                      name="organization"
                      value={formData.organization}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-dark-300 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition bg-white dark:bg-dark-200 text-gray-900 dark:text-white"
                      placeholder="Your Organization / Ministry"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-dark-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-dark-300 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition bg-white dark:bg-dark-200 text-gray-900 dark:text-white"
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="category-select" className="block text-sm font-bold text-gray-700 dark:text-dark-700 mb-2">Category</label>
                  <select
                    id="category-select"
                    aria-label="Contact category"
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-dark-300 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition bg-white dark:bg-dark-200 text-gray-900 dark:text-white"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="technical">Technical Support</option>
                    <option value="sales">Sales & Enterprise</option>
                    <option value="urgent">Urgent/Emergency</option>
                    <option value="partnership">Partnership</option>
                    <option value="media">Media & Press</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-dark-700 mb-2">Subject *</label>
                  <input
                    type="text"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-dark-300 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition bg-white dark:bg-dark-200 text-gray-900 dark:text-white"
                    placeholder="Brief description of your inquiry"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-dark-700 mb-2">Message *</label>
                  <textarea
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-dark-300 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition resize-none bg-white dark:bg-dark-200 text-gray-900 dark:text-white"
                    placeholder="Tell us how we can help..."
                  />
                </div>

                <button type="submit" className="w-full btn-primary text-xl py-5">
                  Send Message →
                </button>
              </form>
            </div>

            {/* Office Locations & FAQ */}
            <div className="space-y-8">
              {/* Offices */}
              <div className="glass dark:bg-dark-200/50 rounded-3xl p-10 shadow-2xl border border-white/20 dark:border-dark-300">
                <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-6">Our Offices</h2>
                <div className="space-y-6">
                  {offices.map((office, idx) => (
                    <div key={idx} className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-dark-300 p-6 rounded-2xl border-2 border-blue-200 dark:border-blue-800">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-black text-gray-900 dark:text-white">{office.city}</h3>
                          <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full font-bold">
                            {office.type}
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-dark-600">{office.address}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div className="glass dark:bg-dark-200/50 rounded-3xl p-10 shadow-2xl border border-white/20 dark:border-dark-300">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6">Quick Links</h2>
                <div className="space-y-4">
                  <Link href="/pricing" className="block p-4 bg-gradient-to-r from-blue-50 to-white dark:from-blue-900/20 dark:to-dark-300 rounded-xl border-2 border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600 transition group">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900 dark:text-white">💰 View Pricing</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </Link>
                  <Link href="/api-docs" className="block p-4 bg-gradient-to-r from-purple-50 to-white dark:from-purple-900/20 dark:to-dark-300 rounded-xl border-2 border-purple-200 dark:border-purple-800 hover:border-purple-400 dark:hover:border-purple-600 transition group">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900 dark:text-white">📚 API Documentation</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </Link>
                  <Link href="/help" className="block p-4 bg-gradient-to-r from-red-50 to-white dark:from-red-900/20 dark:to-dark-300 rounded-xl border-2 border-red-200 dark:border-red-800 hover:border-red-400 dark:hover:border-red-600 transition group">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900 dark:text-white">📖 Help Center</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </Link>
                  <Link href="/dashboard" className="block p-4 bg-gradient-to-r from-green-50 to-white dark:from-green-900/20 dark:to-dark-300 rounded-xl border-2 border-green-200 dark:border-green-800 hover:border-green-400 dark:hover:border-green-600 transition group">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900 dark:text-white">📊 Dashboard</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Business Hours */}
              <div className="glass dark:bg-dark-200/50 rounded-3xl p-10 shadow-2xl border border-white/20 dark:border-dark-300">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6">⏰ Business Hours</h2>
                <div className="space-y-3 text-gray-700 dark:text-dark-700">
                  <div className="flex justify-between py-2 border-b border-gray-200 dark:border-dark-200">
                    <span className="font-semibold">Monday - Friday</span>
                    <span className="font-bold">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="font-semibold">Saturday</span>
                    <span className="font-bold">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="font-semibold">Emergency</span>
                    <span className="font-bold text-red-600">24/7 Available</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
