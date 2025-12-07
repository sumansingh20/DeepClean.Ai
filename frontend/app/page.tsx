"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
  const [stats, setStats] = useState({
    files_analyzed: 0,
    active_users: 0,
    detection_accuracy: 0,
    avg_processing_time: 0
  });

  useEffect(() => {
    // Fetch real stats from backend
    fetch('http://localhost:8001/api/v1/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error('Failed to fetch stats:', err));
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <span className="text-white font-black text-lg">DC</span>
              </div>
              <div className="flex flex-col">
                <span className="font-black text-gray-900 text-xl tracking-tight leading-none">DeepClean<span className="text-pink-600">.AI</span></span>
                <span className="text-xs font-bold text-green-600">100% FREE Platform</span>
              </div>
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              <Link href="/features" className="text-sm font-semibold text-gray-700 hover:text-pink-600 transition-all duration-200">
                Features
              </Link>
              <Link href="/pricing" className="text-sm font-semibold text-gray-700 hover:text-pink-600 transition-all duration-200">
                Pricing
              </Link>
              <Link href="/about" className="text-sm font-semibold text-gray-700 hover:text-pink-600 transition-all duration-200">
                About
              </Link>
              <Link href="/login" className="text-sm font-semibold text-gray-700 hover:text-pink-600 transition-all duration-200">
                Login
              </Link>
              <Link href="/register" className="px-6 py-2.5 bg-gradient-to-r from-pink-600 to-purple-600 text-white text-sm font-bold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5">
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden bg-gradient-to-br from-pink-50 via-white to-purple-50">
        
        <div className="max-w-7xl mx-auto relative z-10">
          {/* FREE Platform Badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-3 px-8 py-3 bg-green-100 rounded-full border-2 border-green-400 shadow-lg">
              <span className="text-2xl">🎉</span>
              <span className="text-sm font-black text-green-700 tracking-wide">100% FREE FOR ALL WOMEN</span>
            </div>
          </div>

          {/* Main Headline - Women's Safety Focus */}
          <div className="text-center max-w-5xl mx-auto mb-12">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-6 tracking-tight leading-tight">
              Protect Yourself from<br/>
              <span className="text-pink-600">Deepfake Abuse</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
              You deserve to feel safe online. Detect fake images and videos created to harm you.
              <span className="block mt-3 text-lg text-gray-500 font-medium">Get evidence reports you can use to protect yourself and take legal action.</span>
            </p>
            
            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-4 mb-10 text-sm font-semibold text-gray-700">
              <div className="flex items-center gap-2 bg-white px-5 py-2.5 rounded-lg border border-gray-200 shadow-sm">
                <span className="text-green-600 text-lg">✓</span>
                <span>100% Free Forever</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-5 py-2.5 rounded-lg border border-gray-200 shadow-sm">
                <span className="text-blue-600 text-lg">✓</span>
                <span>Privacy Protected</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-5 py-2.5 rounded-lg border border-gray-200 shadow-sm">
                <span className="text-purple-600 text-lg">✓</span>
                <span>Legal Evidence Reports</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-5 py-2.5 rounded-lg border border-gray-200 shadow-sm">
                <span className="text-pink-600 text-lg">✓</span>
                <span>No Credit Card Needed</span>
              </div>
            </div>

            {/* CTA Buttons - Women Focused */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link 
                href="/analysis" 
                className="px-10 py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white text-lg font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-center gap-2">
                  <span>Start Free Analysis</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </Link>
              <Link 
                href="/about" 
                className="px-10 py-4 bg-white text-gray-900 text-lg font-bold rounded-lg border-2 border-gray-300 hover:border-pink-500 hover:bg-pink-50 transition-all duration-200 shadow-md"
              >
                <span className="flex items-center justify-center gap-2">
                  Learn More
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            </div>

            {/* Stats - Women's Safety Impact */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-12 border-t border-gray-200">
              {[
                { value: stats.files_analyzed > 0 ? stats.files_analyzed.toLocaleString() : "0", label: "Women protected", icon: "👩" },
                { value: stats.detection_accuracy > 0 ? `${stats.detection_accuracy}%` : "0%", label: "Accuracy rate", icon: "✓" },
                { value: stats.avg_processing_time > 0 ? `${stats.avg_processing_time}s` : "0s", label: "Avg processing", icon: "⚡" },
                { value: stats.active_users > 0 ? `${stats.active_users}` : "0", label: "Active users", icon: "👥" }
              ].map((stat, i) => (
                <div key={i} className="text-center p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="text-3xl mb-3">{stat.icon}</div>
                  <div className="text-4xl font-black text-pink-600 mb-2">{stat.value}</div>
                  <div className="text-sm font-semibold text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof - Women's Safety Focus */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-base font-bold text-gray-700 mb-4">Built to protect women from digital abuse</p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600 font-medium">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
                <span>No files stored</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                <span>Privacy protected</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                <span>Legal evidence reports</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { name: 'TensorFlow', color: 'from-orange-500 to-amber-500' },
              { name: 'PyTorch', color: 'from-red-500 to-orange-500' },
              { name: 'OpenCV', color: 'from-blue-500 to-cyan-500' },
              { name: 'Scikit-learn', color: 'from-indigo-500 to-blue-500' },
              { name: 'NumPy', color: 'from-cyan-500 to-blue-500' }
            ].map((tech) => (
              <div key={tech.name} className="text-center py-6 px-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
                <span className="text-sm font-bold text-gray-800">{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="py-24 px-6 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-bold mb-6 animate-bounce-slow">
              🚀 Advanced AI Technology
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight leading-tight">
              Multi-Modal Detection
              <span className="block text-purple-600">Technology</span>
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed font-medium">
              Comprehensive analysis suite powered by cutting-edge machine learning algorithms
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Video & Image Analysis",
                description: "Deep learning models analyze facial features, detect inconsistencies, and identify manipulation artifacts in video and image files.",
                features: ["Face manipulation detection", "Artifact identification", "Frame consistency analysis"],
                icon: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z",
                gradient: "from-blue-500 to-indigo-600",
                bgGradient: "from-blue-50 to-indigo-50"
              },
              {
                title: "Audio Forensics",
                description: "Spectral analysis and machine learning models detect voice synthesis, cloning, and audio manipulation techniques.",
                features: ["Voice pattern analysis", "Synthesis detection", "Audio artifact identification"],
                icon: "M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z",
                gradient: "from-indigo-500 to-purple-600",
                bgGradient: "from-indigo-50 to-purple-50"
              },
              {
                title: "Document Verification",
                description: "OCR technology and template matching algorithms verify document authenticity and detect digital tampering.",
                features: ["ID document verification", "Digital tampering detection", "Metadata analysis"],
                icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
                gradient: "from-purple-500 to-pink-600",
                bgGradient: "from-purple-50 to-pink-50"
              }
            ].map((feature, i) => (
              <div key={i} className="group relative bg-white rounded-3xl p-8 border-2 border-gray-200 hover:border-transparent transition-all duration-500 shadow-lg hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] hover:-translate-y-3 overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl`}></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-500"></div>
                <div className="relative">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg group-hover:shadow-2xl`}>
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:${feature.gradient} transition-all duration-300">{feature.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed text-base">{feature.description}</p>
                  <ul className="space-y-3">
                    {feature.features.map((item, j) => (
                      <li key={j} className="flex items-center gap-3 text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${feature.gradient} group-hover:scale-125 transition-transform duration-300`}></div>
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
      <section className="py-20 px-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="max-w-6xl mx-auto">
          <div className="relative bg-white rounded-3xl p-10 md:p-12 shadow-2xl border border-gray-200 overflow-hidden group hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] transition-all duration-500">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
            <div className="flex flex-col lg:flex-row items-center gap-10 relative">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1 text-center lg:text-left">
                <h3 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 leading-tight">
                  Need Help Getting Started?
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Our team is here to help you understand and implement our detection technology.
                  <span className="block mt-2 text-base font-medium text-gray-500">✨ 24/7 Technical Support Available</span>
                </p>
              </div>
              <Link 
                href="/contact" 
                className="group/btn relative px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold overflow-hidden transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(59,130,246,0.5)] hover:-translate-y-1 text-lg flex-shrink-0"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"></div>
                <span className="relative flex items-center gap-2">
                  Contact Us
                  <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Detection Capabilities */}
      <section className="py-24 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-full text-sm font-bold mb-6">
              🔬 Comprehensive Analysis
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
              Full Spectrum
              <span className="block text-purple-600">Detection Suite</span>
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
                title: "Technical Analysis",
                items: ["Metadata extraction", "Artifact detection", "Temporal analysis"],
              },
              {
                title: "Reporting",
                items: ["Detection confidence scores", "Visual analysis reports", "Technical documentation"],
              }
            ].map((category, idx) => (
              <div key={idx} className="group relative p-10 bg-white rounded-3xl border-2 border-gray-200 hover:border-transparent shadow-lg hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] transition-all duration-500 hover:-translate-y-3 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <h3 className="text-2xl font-black text-gray-900 mb-8 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-indigo-600 transition-all duration-300">{category.title}</h3>
                  <ul className="space-y-5">
                    {category.items.map((item, i) => (
                      <li key={i} className="flex items-center gap-4 text-gray-700 group-hover:text-gray-900 transition-colors">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="font-semibold text-base">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Timeline */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-sm font-bold mb-6">
              ⏱️ Quick & Easy
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
              How It
              <span className="block text-purple-600">Works</span>
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Get professional analysis results in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              { step: "01", title: "Upload Content", desc: "Submit video, audio, or image file for analysis", icon: "M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12", gradient: "from-blue-500 to-cyan-500" },
              { step: "02", title: "AI Analysis", desc: "Machine learning models process and analyze your media", icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z", gradient: "from-indigo-500 to-purple-500" },
              { step: "03", title: "Get Results", desc: "Receive technical report with detection confidence scores", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", gradient: "from-purple-500 to-pink-500" }
            ].map((item, idx) => (
              <div key={idx} className="group relative bg-gradient-to-br from-white to-gray-50 p-10 rounded-3xl border-2 border-gray-200 hover:border-transparent shadow-xl hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] transition-all duration-500 hover:-translate-y-3 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute -top-8 -left-8 w-20 h-20 bg-gradient-to-br ${item.gradient} rounded-3xl flex items-center justify-center text-white font-extrabold text-3xl shadow-2xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                  {item.step}
                </div>
                <div className="relative mt-8">
                  <div className={`w-20 h-20 bg-gradient-to-br ${item.gradient} rounded-3xl flex items-center justify-center mb-6 ml-auto group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 shadow-lg`}>
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:${item.gradient} transition-all duration-300">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-base">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-24 px-6 bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6IiBmaWxsPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDIpIi8+PC9nPjwvc3ZnPg==')] opacity-40"></div>
        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-400/30 text-blue-300 rounded-full text-sm font-bold mb-6">
              🎯 Real-World Applications
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">Trusted Across
              <span className="block text-cyan-400">Industries</span>
            </h2>
            <p className="text-gray-400 text-xl">AI-powered detection for diverse use cases and applications</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { title: "Social Media", desc: "Verify viral content authenticity", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z", gradient: "from-blue-500 to-cyan-500" },
              { title: "Research", desc: "Academic media verification", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253", gradient: "from-indigo-500 to-purple-500" },
              { title: "Journalism", desc: "Source verification tools", icon: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z", gradient: "from-purple-500 to-pink-500" },
              { title: "Personal", desc: "Verify media authenticity", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z", gradient: "from-pink-500 to-red-500" }
            ].map((useCase, idx) => (
              <div key={idx} className="group relative p-8 bg-gray-800/50 backdrop-blur-sm rounded-3xl border border-gray-700 hover:border-transparent transition-all duration-500 hover:-translate-y-3 overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${useCase.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                <div className="relative">
                  <div className={`w-18 h-18 bg-gradient-to-br ${useCase.gradient} rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl`}>
                    <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={useCase.icon} />
                    </svg>
                  </div>
                  <div className="text-2xl font-black mb-3 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:${useCase.gradient} transition-all duration-300">{useCase.title}</div>
                  <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">{useCase.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-28 px-6 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-300/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-400/5 to-purple-400/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-block px-6 py-3 bg-white/20 backdrop-blur-md rounded-full text-white/90 text-sm font-bold mb-8 animate-bounce-slow border border-white/30">
            ✨ Start Your Free Trial Today
          </div>
          <h2 className="text-5xl md:text-7xl font-black mb-8 text-white leading-tight">
            Ready to Detect
            <span className="block">Deepfakes?</span>
          </h2>
          <p className="text-xl md:text-2xl mb-12 text-blue-100 leading-relaxed max-w-3xl mx-auto font-medium">
            Join professionals worldwide using AI-powered detection.
            <span className="block mt-2 text-lg text-white/80">Free analysis for your first 10 files. No credit card required.</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link 
              href="/register" 
              className="group relative px-12 py-6 bg-white text-blue-600 rounded-2xl font-black text-xl overflow-hidden transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(255,255,255,0.5)] hover:-translate-y-2 hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative flex items-center justify-center gap-3">
                Start Free Analysis
                <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </Link>
            <Link 
              href="/pricing" 
              className="group px-12 py-6 bg-transparent text-white rounded-2xl font-black text-xl border-3 border-white/30 hover:border-white hover:bg-white/10 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(255,255,255,0.3)]"
            >
              <span className="flex items-center justify-center gap-2">
                View Pricing
                <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          </div>
          <p className="mt-10 text-white/70 text-sm">
            ✓ No credit card required   ✓ Setup in 2 minutes   ✓ Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">DC</span>
                </div>
                <span className="text-white font-bold text-lg">DeepClean.AI</span>
              </div>
              <p className="text-sm leading-relaxed mb-3">Free deepfake detection platform for women's safety</p>
              <p className="text-xs text-green-400 font-semibold">100% Free • Always</p>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4 text-sm">Product</h4>
              <div className="space-y-2 text-sm">
                <Link href="/analysis" className="block hover:text-pink-400 transition">Analysis</Link>
                <Link href="/pricing" className="block hover:text-pink-400 transition">Pricing</Link>
                <Link href="/features" className="block hover:text-pink-400 transition">Features</Link>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4 text-sm">Support</h4>
              <div className="space-y-2 text-sm">
                <Link href="/contact" className="block hover:text-pink-400 transition">Contact</Link>
                <Link href="/about" className="block hover:text-pink-400 transition">About</Link>
                <Link href="/help" className="block hover:text-pink-400 transition">Help</Link>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4 text-sm">Legal</h4>
              <div className="space-y-2 text-sm">
                <Link href="/privacy" className="block hover:text-pink-400 transition">Privacy</Link>
                <Link href="/terms" className="block hover:text-pink-400 transition">Terms</Link>
                <Link href="/security" className="block hover:text-pink-400 transition">Security</Link>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-sm text-center">
            <p className="text-gray-400">© 2025 DeepClean.AI. All rights reserved. <span className="text-pink-500 font-semibold">Made in India</span> 🇮🇳</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
