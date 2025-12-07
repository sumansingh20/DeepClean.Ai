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

