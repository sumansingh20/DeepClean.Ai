"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-dark-100">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200 dark:border-dark-300 bg-white/95 dark:bg-dark-100/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 dark:bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">DC</span>
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">DeepClean.AI</span>
            </div>
            
            <div className="hidden md:flex items-center gap-6">
              <Link href="/features" className="text-sm text-gray-600 dark:text-dark-600 hover:text-gray-900 dark:hover:text-white transition">Features</Link>
              <Link href="/pricing" className="text-sm text-gray-600 dark:text-dark-600 hover:text-gray-900 dark:hover:text-white transition">Pricing</Link>
              <Link href="/about" className="text-sm text-gray-600 dark:text-dark-600 hover:text-gray-900 dark:hover:text-white transition">About</Link>
              <Link href="/login" className="text-sm text-gray-600 dark:text-dark-600 hover:text-gray-900 dark:hover:text-white transition">Login</Link>
              <Link href="/register" className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Trust Badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-dark-200 rounded-full border border-gray-200 dark:border-dark-300">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              <span className="text-xs font-medium text-gray-700 dark:text-dark-600">Trusted by law enforcement agencies</span>
            </div>
          </div>

          {/* Main Headline */}
          <div className="text-center max-w-4xl mx-auto mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
              Enterprise-grade deepfake detection
            </h1>
            
            <p className="text-lg text-gray-600 dark:text-dark-600 max-w-2xl mx-auto mb-8">
              Court-admissible forensic analysis powered by advanced AI. Protect your organization from manipulated media.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-16">
              <Link 
                href="/analysis" 
                className="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors inline-flex items-center justify-center gap-2"
              >
                Start analyzing
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link 
                href="/contact" 
                className="px-6 py-3 bg-white dark:bg-dark-200 text-gray-900 dark:text-white text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-dark-300 transition-colors border border-gray-200 dark:border-dark-300"
              >
                Talk to sales
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-8 border-t border-gray-200 dark:border-dark-300">
              {[
                { value: "127,000+", label: "Content analyzed" },
                { value: "94.7%", label: "Detection accuracy" },
                { value: "< 3s", label: "Average response" },
                { value: "500+", label: "Organizations" }
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600 dark:text-dark-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 bg-gray-50 dark:bg-dark-200/50 border-y border-gray-200 dark:border-dark-200">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-xs font-medium text-gray-500 dark:text-dark-500 mb-8 tracking-wider">TRUSTED BY</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center opacity-50">
            {['Delhi Police', 'CBI', 'Ministry of Home Affairs', 'CERT-In', 'Supreme Court'].map((org) => (
              <div key={org} className="text-center text-sm font-semibold text-gray-700 dark:text-dark-700">{org}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Built for serious work</h2>
            <p className="text-lg text-gray-600 dark:text-dark-600">
              Comprehensive detection suite designed for law enforcement, legal teams, and enterprises.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Video & Image Analysis",
                description: "Multi-modal deepfake detection using facial analysis, temporal consistency checks, and GAN artifact identification.",
                features: ["Face-swap detection", "Expression manipulation", "Lip-sync verification"]
              },
              {
                title: "Audio Forensics",
                description: "Voice cloning detection with spectral analysis, acoustic modeling, and real-time verification.",
                features: ["Voice authentication", "Clone detection", "Speaker verification"]
              },
              {
                title: "Document Verification",
                description: "ID card, passport, and legal document authentication using OCR and template matching.",
                features: ["Government ID verification", "Tamper detection", "Forgery analysis"]
              }
            ].map((feature, i) => (
              <div key={i} className="p-8 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.features.map((item, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-gray-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Support */}
      <section className="py-12 bg-red-50 border-y border-red-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-6">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm border border-red-200">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
            <div className="flex-1 text-center lg:text-left">
              <h3 className="text-xl font-semibold text-gray-900 mb-1">Victim Support</h3>
              <p className="text-gray-700">
                Confidential assistance for deepfake harassment or non-consensual imagery.
              </p>
            </div>
            <Link 
              href="/victim" 
              className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              Get Help
            </Link>
          </div>
        </div>
      </section>

      {/* Detection Capabilities */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Detection Capabilities
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Multi-engine detection powered by computer vision, machine learning, and forensic analysis
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
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
              <div key={idx} className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{category.title}</h3>
                <ul className="space-y-3">
                  {category.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-700">
                      <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Timeline */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Simple 3-Step Process
            </h2>
            <p className="text-xl text-gray-600">
              From upload to court-ready evidence in minutes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              { step: "01", title: "Upload Content", desc: "Submit video, audio, image, or document for analysis" },
              { step: "02", title: "AI Analysis", desc: "Multi-engine detection with blockchain evidence chain" },
              { step: "03", title: "Get Results", desc: "Detailed forensic report with legal documentation" }
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <div className="text-7xl font-bold text-gray-100 mb-4">{item.step}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                {idx < 2 && (
                  <div className="hidden md:block absolute top-12 -right-6 w-12 h-0.5 bg-gradient-to-r from-blue-500 to-transparent"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 px-6 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { icon: "🚓", title: "Law Enforcement", stat: "234 cases solved", desc: "Court-ready evidence" },
              { icon: "⚖️", title: "Legal Firms", stat: "18 high courts", desc: "Reports accepted" },
              { icon: "🏢", title: "Enterprises", stat: "KYC fraud prevented", desc: "Banks & fintech" },
              { icon: "📱", title: "Social Platforms", stat: "Content moderation", desc: "User verification" }
            ].map((trust, idx) => (
              <div key={idx} className="p-6">
                <div className="text-5xl mb-4">{trust.icon}</div>
                <div className="text-xl font-bold mb-2">{trust.title}</div>
                <div className="text-blue-400 font-semibold mb-1">{trust.stat}</div>
                <div className="text-sm text-gray-400">{trust.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-6">
            Start Detecting Deepfakes Today
          </h2>
          <p className="text-xl mb-10 text-blue-100">
            Free analysis for first 10 files. No credit card required.
          </p>
          <Link 
            href="/register" 
            className="inline-block px-12 py-5 bg-white text-blue-600 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all shadow-2xl hover:shadow-3xl hover:-translate-y-1"
          >
            Create Free Account →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">DC</span>
                </div>
                <span className="text-white font-bold text-lg">DeepClean.AI</span>
              </div>
              <p className="text-sm leading-relaxed">India's leading deepfake detection platform</p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <div className="space-y-2 text-sm">
                <Link href="/analysis" className="block hover:text-white transition">Analysis</Link>
                <Link href="/pricing" className="block hover:text-white transition">Pricing</Link>
                <Link href="/features" className="block hover:text-white transition">API</Link>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <div className="space-y-2 text-sm">
                <Link href="/victim" className="block hover:text-white transition">Victim Support</Link>
                <Link href="/contact" className="block hover:text-white transition">Contact</Link>
                <Link href="/about" className="block hover:text-white transition">About</Link>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <div className="space-y-2 text-sm">
                <Link href="/privacy" className="block hover:text-white transition">Privacy</Link>
                <Link href="/terms" className="block hover:text-white transition">Terms</Link>
                <Link href="/security" className="block hover:text-white transition">Security</Link>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-sm text-center">
            © 2025 DeepClean.AI. All rights reserved. Made in India 🇮🇳
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
