"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/60 shadow-lg">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-11 h-11 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                <span className="text-white font-black text-base">DC</span>
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/0 via-blue-400/30 to-blue-400/0 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
              </div>
              <span className="font-black text-gray-900 text-xl tracking-tight">DeepClean.AI</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              <Link href="/features" className="text-sm font-bold text-gray-700 hover:text-blue-600 transition-all duration-200 relative group">
                Features
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link href="/pricing" className="text-sm font-bold text-gray-700 hover:text-blue-600 transition-all duration-200 relative group">
                Pricing
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link href="/about" className="text-sm font-bold text-gray-700 hover:text-blue-600 transition-all duration-200 relative group">
                About
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link href="/login" className="text-sm font-bold text-gray-700 hover:text-blue-600 transition-all duration-200">Login</Link>
              <Link href="/register" className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold rounded-xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:from-blue-700 hover:to-indigo-700">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-28 pb-16 px-6 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50/40 to-purple-50/30">
          <div className="absolute top-20 right-20 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Trust Badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-white/90 backdrop-blur-md rounded-full border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="relative">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-75"></div>
              </div>
              <span className="text-xs font-black text-gray-800 tracking-wider">TRUSTED BY LAW ENFORCEMENT</span>
            </div>
          </div>

          {/* Main Headline */}
          <div className="text-center max-w-5xl mx-auto mb-12">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-gray-900 mb-6 tracking-tight leading-[1.05] animate-in fade-in slide-in-from-bottom-4 duration-700">
              Enterprise-grade<br/>
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent animate-gradient">deepfake detection</span>
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-lg blur-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150">
              Court-admissible forensic analysis powered by advanced AI.<br/>Protect your organization from manipulated media.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
              <Link 
                href="/analysis" 
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-base font-bold rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative flex items-center justify-center gap-2">
                  Start analyzing
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </Link>
              <Link 
                href="/contact" 
                className="group px-8 py-4 bg-white text-gray-900 text-base font-bold rounded-xl border-2 border-gray-300 hover:border-blue-600 hover:bg-gray-50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                Talk to sales
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-12 border-t border-gray-200/80">
              {[
                { value: "127,000+", label: "Content analyzed" },
                { value: "94.7%", label: "Detection accuracy" },
                { value: "< 3s", label: "Average response" },
                { value: "500+", label: "Organizations" }
              ].map((stat, i) => (
                <div key={i} className="group text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200/50 hover:border-blue-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-default">
                  <div className="text-4xl md:text-5xl font-black bg-gradient-to-br from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">{stat.value}</div>
                  <div className="text-sm font-bold text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 bg-gradient-to-b from-white via-gray-50/40 to-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-xs font-black text-gray-500 mb-10 tracking-[0.25em]">TRUSTED BY</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {['Delhi Police', 'CBI', 'Ministry of Home Affairs', 'CERT-In', 'Supreme Court'].map((org) => (
              <div key={org} className="text-center py-8 px-6 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group">
                <span className="text-sm font-black text-gray-800 group-hover:text-blue-600 transition-colors duration-200">{org}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-6xl font-black text-gray-900 mb-6 tracking-tight">Built for serious work</h2>
            <p className="text-xl text-gray-600 leading-relaxed font-medium">
              Comprehensive detection suite designed for law enforcement, legal teams, and enterprises.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Video & Image Analysis",
                description: "Multi-modal deepfake detection using facial analysis, temporal consistency checks, and GAN artifact identification.",
                features: ["Face-swap detection", "Expression manipulation", "Lip-sync verification"],
                icon: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z",
                gradient: "from-blue-500 to-indigo-600"
              },
              {
                title: "Audio Forensics",
                description: "Voice cloning detection with spectral analysis, acoustic modeling, and real-time verification.",
                features: ["Voice authentication", "Clone detection", "Speaker verification"],
                icon: "M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z",
                gradient: "from-indigo-500 to-purple-600"
              },
              {
                title: "Document Verification",
                description: "ID card, passport, and legal document authentication using OCR and template matching.",
                features: ["Government ID verification", "Tamper detection", "Forgery analysis"],
                icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
                gradient: "from-purple-500 to-pink-600"
              }
            ].map((feature, i) => (
              <div key={i} className="group relative bg-white rounded-2xl p-8 border border-gray-200 hover:border-blue-300 transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                <div className="relative">
                  <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed text-sm">{feature.description}</p>
                  <ul className="space-y-3">
                    {feature.features.map((item, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600"></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Support */}
      <section className="py-16 bg-gradient-to-r from-red-50 via-orange-50 to-red-50 border-y-2 border-red-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="bg-white rounded-3xl p-8 shadow-2xl border-2 border-red-200">
            <div className="flex flex-col lg:flex-row items-center gap-10">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-xl">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1 text-center lg:text-left">
                <h3 className="text-3xl font-bold text-gray-900 mb-3">Victim Support</h3>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Confidential assistance for deepfake harassment or non-consensual imagery.
                </p>
              </div>
              <Link 
                href="/victim" 
                className="px-10 py-5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl font-bold hover:from-red-700 hover:to-red-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 text-lg"
              >
                Get Help Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Detection Capabilities */}
      <section className="py-20 px-6 bg-gradient-to-b from-white via-blue-50/30 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Detection Capabilities
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Multi-engine detection powered by computer vision, machine learning, and forensic analysis
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                title: "Media Analysis",
                items: ["Video deepfake detection", "Voice clone detection", "Image manipulation"],
              },
              {
                title: "Identity Protection",
                items: ["Face recognition", "Document verification", "Liveness testing"],
              },
              {
                title: "Legal Support",
                items: ["Evidence generation", "Takedown requests", "Forensic reports"],
              }
            ].map((category, idx) => (
              <div key={idx} className="p-10 bg-gradient-to-br from-white to-gray-50 rounded-3xl border-2 border-gray-200 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-8">{category.title}</h3>
                <ul className="space-y-5">
                  {category.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-4 text-gray-700 group">
                      <svg className="w-6 h-6 text-blue-600 flex-shrink-0 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="font-semibold text-base">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Timeline */}
      <section className="py-16 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Simple 3-Step Process
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              From upload to court-ready evidence in minutes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              { step: "01", title: "Upload Content", desc: "Submit video, audio, image, or document for analysis", icon: "M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" },
              { step: "02", title: "AI Analysis", desc: "Multi-engine detection with blockchain evidence chain", icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" },
              { step: "03", title: "Get Results", desc: "Detailed forensic report with legal documentation", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" }
            ].map((item, idx) => (
              <div key={idx} className="relative bg-white p-10 rounded-3xl border-2 border-gray-200 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 group">
                <div className="absolute -top-6 -left-6 w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center text-white font-extrabold text-2xl shadow-xl group-hover:scale-110 transition-transform">
                  {item.step}
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl flex items-center justify-center mb-6 ml-auto group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed text-base">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 px-6 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { title: "Law Enforcement", stat: "234 cases solved", desc: "Court-ready evidence", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
              { title: "Legal Firms", stat: "18 high courts", desc: "Reports accepted", icon: "M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" },
              { title: "Enterprises", stat: "KYC fraud prevented", desc: "Banks & fintech", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
              { title: "Social Platforms", stat: "Content moderation", desc: "User verification", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" }
            ].map((trust, idx) => (
              <div key={idx} className="p-8 bg-gray-800/50 rounded-3xl border border-gray-700 hover:border-blue-500 transition-all hover:-translate-y-2 group">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={trust.icon} />
                  </svg>
                </div>
                <div className="text-2xl font-bold mb-3 text-white">{trust.title}</div>
                <div className="text-cyan-400 font-bold mb-2 text-lg">{trust.stat}</div>
                <div className="text-sm text-gray-400">{trust.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-20 px-6 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-300 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-6xl font-bold mb-6 text-white">
            Start Detecting Deepfakes Today
          </h2>
          <p className="text-xl mb-12 text-blue-100 leading-relaxed">
            Free analysis for first 10 files. No credit card required.
          </p>
          <Link 
            href="/register" 
            className="inline-flex items-center gap-3 px-12 py-5 bg-white text-blue-600 rounded-xl font-bold text-lg hover:bg-gray-50 hover:scale-105 transition-all shadow-2xl hover:shadow-xl"
          >
            Create Free Account
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl flex items-center justify-center shadow-medium">
                  <span className="text-white font-bold">DC</span>
                </div>
                <span className="text-white font-bold text-lg">DeepClean.AI</span>
              </div>
              <p className="text-sm leading-relaxed">India's leading deepfake detection platform</p>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-6">Product</h4>
              <div className="space-y-3 text-sm">
                <Link href="/analysis" className="block hover:text-white transition">Analysis</Link>
                <Link href="/pricing" className="block hover:text-white transition">Pricing</Link>
                <Link href="/features" className="block hover:text-white transition">API</Link>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-6">Support</h4>
              <div className="space-y-3 text-sm">
                <Link href="/victim" className="block hover:text-white transition">Victim Support</Link>
                <Link href="/contact" className="block hover:text-white transition">Contact</Link>
                <Link href="/about" className="block hover:text-white transition">About</Link>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-6">Legal</h4>
              <div className="space-y-3 text-sm">
                <Link href="/privacy" className="block hover:text-white transition">Privacy</Link>
                <Link href="/terms" className="block hover:text-white transition">Terms</Link>
                <Link href="/security" className="block hover:text-white transition">Security</Link>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-sm text-center">
            © 2025 DeepClean.AI. All rights reserved. Made in India
          </div>
        </div>
      </footer>
    </div>
  );
}
