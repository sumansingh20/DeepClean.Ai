'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    phone: '',
    subject: '',
    message: '',
    category: 'general'
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const contactInfo = [
    {
      title: 'Email Support',
      value: 'support@deepclean.ai',
      desc: 'Response within 24 hours',
      link: 'mailto:support@deepclean.ai'
    },
    {
      title: 'Phone Support',
      value: '+91-11-4567-8900',
      desc: 'Mon-Fri, 9 AM - 6 PM IST',
      link: 'tel:+911145678900'
    },
    {
      title: 'Emergency Hotline',
      value: '1800-123-4567',
      desc: '24/7 for critical cases',
      link: 'tel:18001234567'
    },
    {
      title: 'Enterprise Sales',
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
            <Link href="/dashboard" className="btn-primary">Dashboard</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h1 className="text-6xl font-black text-gray-900 mb-6">
              Get In <span className="gradient-text">Touch</span>
            </h1>
            <p className="text-2xl text-gray-600">
              Have questions? We're here to help 24/7
            </p>
          </div>

          {/* Contact Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-20">
            {contactInfo.map((info, idx) => (
              <a
                key={idx}
                href={info.link}
                className="glass rounded-2xl p-6 shadow-xl border border-white/20 card-hover group"
              >
                <h3 className="text-lg font-black text-gray-900 mb-2">{info.title}</h3>
                <div className="text-blue-600 font-bold mb-2">{info.value}</div>
                <p className="text-sm text-gray-600">{info.desc}</p>
              </a>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
            {/* Contact Form */}
            <div className="glass rounded-3xl p-10 shadow-2xl border border-white/20">
              <h2 className="text-3xl font-black text-gray-900 mb-6">Send us a Message</h2>
              
              {submitted && (
                <div className="mb-6 p-4 bg-green-100 border-2 border-green-500 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">✅</span>
                    <div>
                      <p className="font-bold text-green-900">Message Sent Successfully!</p>
                      <p className="text-sm text-green-700">We'll respond within 24 hours.</p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition"
                      placeholder="Priya Sharma"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition"
                      placeholder="contact@company.co.in"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Organization</label>
                    <input
                      type="text"
                      name="organization"
                      value={formData.organization}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition"
                      placeholder="Your Organization / Ministry"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition"
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="category-select" className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                  <select
                    id="category-select"
                    aria-label="Contact category"
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition"
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
                  <label className="block text-sm font-bold text-gray-700 mb-2">Subject *</label>
                  <input
                    type="text"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition"
                    placeholder="Brief description of your inquiry"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Message *</label>
                  <textarea
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition resize-none"
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
              <div className="glass rounded-3xl p-10 shadow-2xl border border-white/20">
                <h2 className="text-3xl font-black text-gray-900 mb-6">Our Offices</h2>
                <div className="space-y-6">
                  {offices.map((office, idx) => (
                    <div key={idx} className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-2xl border-2 border-blue-200">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-black text-gray-900">{office.city}</h3>
                          <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full font-bold">
                            {office.type}
                          </span>
                        </div>
                        <p className="text-gray-600">{office.address}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div className="glass rounded-3xl p-10 shadow-2xl border border-white/20">
                <h2 className="text-2xl font-black text-gray-900 mb-6">Quick Links</h2>
                <div className="space-y-4">
                  <Link href="/pricing" className="block p-4 bg-gradient-to-r from-blue-50 to-white rounded-xl border-2 border-blue-200 hover:border-blue-400 transition group">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900">💰 View Pricing</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </Link>
                  <Link href="/api-docs" className="block p-4 bg-gradient-to-r from-purple-50 to-white rounded-xl border-2 border-purple-200 hover:border-purple-400 transition group">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900">📚 API Documentation</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </Link>
                  <Link href="/victim" className="block p-4 bg-gradient-to-r from-red-50 to-white rounded-xl border-2 border-red-200 hover:border-red-400 transition group">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900">🆘 Victim Support</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </Link>
                  <Link href="/admin" className="block p-4 bg-gradient-to-r from-green-50 to-white rounded-xl border-2 border-green-200 hover:border-green-400 transition group">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900">👮 Government Portal</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Business Hours */}
              <div className="glass rounded-3xl p-10 shadow-2xl border border-white/20">
                <h2 className="text-2xl font-black text-gray-900 mb-6">⏰ Business Hours</h2>
                <div className="space-y-3 text-gray-700">
                  <div className="flex justify-between py-2 border-b border-gray-200">
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
