"use client";

import Link from "next/link";

export default function Home() {
  const features = [
    {
      icon: "🎤",
      title: "Voice Deepfake Detection",
      description: "Advanced AI analysis using Wav2Vec2, MFCC, and spectral analysis to detect synthetic voice generation and audio manipulation.",
      accuracy: "91.8%",
      speed: "3s",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: "🎥",
      title: "Video Deepfake Detection",
      description: "Multi-frame analysis with facial landmark tracking, GAN fingerprinting, and temporal consistency checks.",
      accuracy: "94.2%",
      speed: "12s",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: "📄",
      title: "Document Forgery Detection",
      description: "OCR-based verification, edge analysis, texture pattern recognition, and template matching for ID documents.",
      accuracy: "89.5%",
      speed: "1.2s",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: "👁️",
      title: "Liveness Detection",
      description: "Real-time blink detection, head movement analysis, and anti-replay mechanisms for biometric security.",
      accuracy: "96.1%",
      speed: "0.8s",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: "📞",
      title: "Scam Call Analysis",
      description: "Automatic speech recognition with NLP pattern matching to identify fraudulent calling patterns and social engineering.",
      accuracy: "88.3%",
      speed: "5s",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: "⚖️",
      title: "Legal Automation",
      description: "Generate DMCA notices, IT Act FIR drafts, platform takedown requests, and court-ready evidence packages.",
      accuracy: "100%",
      speed: "0.3s",
      color: "from-indigo-500 to-purple-500"
    }
  ];

  const stats = [
    { value: "100K+", label: "Analyses Performed", icon: "📊" },
    { value: "94.2%", label: "Average Accuracy", icon: "🎯" },
    { value: "1.9s", label: "Avg Processing Time", icon: "⚡" },
    { value: "99.9%", label: "Uptime", icon: "🔒" }
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Upload Content",
      description: "Upload voice, video, document, or call recording through our secure interface",
      icon: "📤"
    },
    {
      step: "2",
      title: "AI Analysis",
      description: "Our ML models analyze using 6+ detection engines simultaneously",
      icon: "🤖"
    },
    {
      step: "3",
      title: "Get Results",
      description: "Receive detailed analysis with confidence scores and evidence",
      icon: "📈"
    },
    {
      step: "4",
      title: "Take Action",
      description: "Generate legal documents, submit takedowns, or export reports",
      icon: "✅"
    }
  ];

  const testimonials = [
    {
      name: "Maharashtra Cyber Police",
      role: "Law Enforcement",
      content: "DeepClean AI has been instrumental in solving 234 deepfake cases. The evidence packages are court-ready.",
      avatar: "🚓"
    },
    {
      name: "Tech Startup",
      role: "Enterprise Client",
      content: "Integrated DeepClean API into our KYC process. Prevented 1,200+ fraud attempts in 6 months.",
      avatar: "💼"
    },
    {
      name: "Victim Support",
      role: "Individual User",
      content: "The victim portal made it easy to get takedown notices. All my deepfake content was removed within 48 hours.",
      avatar: "👤"
    }
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* Premium Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-6 lg:px-12 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative w-11 h-11 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg transform hover:scale-110 transition-transform">
                <span className="text-lg">DC</span>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div>
                <span className="text-xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  DeepClean AI
                </span>
                <div className="text-xs text-gray-500 font-semibold -mt-1">INDIA&apos;S DEEPFAKE SHIELD</div>
              </div>
            </div>
            <div className="hidden lg:flex items-center space-x-1">
              <a href="#features" className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition font-semibold text-sm">Features</a>
              <Link href="/pricing" className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition font-semibold text-sm">Pricing</Link>
              <Link href="/about" className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition font-semibold text-sm">About</Link>
              <Link href="/contact" className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition font-semibold text-sm">Contact</Link>
              <Link href="/login" className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition font-semibold text-sm ml-2">Login</Link>
              <Link href="/register" className="ml-3 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-2xl hover:shadow-blue-500/50 transition-all font-bold text-sm transform hover:scale-105">
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer for fixed nav */}
      <div className="h-20"></div>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-hidden">
        {/* Geometric Background Pattern */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob opacity-70"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000 opacity-70"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000 opacity-70"></div>
        </div>

        <div className="container mx-auto px-6 lg:px-12 py-24 relative">
          <div className="max-w-6xl mx-auto">
            {/* Status Badge */}
            <div className="flex justify-center mb-8 animate-fade-in">
              <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-white/90 backdrop-blur-md border border-gray-200 rounded-full text-sm font-semibold shadow-lg">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                </span>
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-bold">
                  🇮🇳 Government-Grade • 500+ Organizations • 99.9% Uptime
                </span>
              </div>
            </div>
            
            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-center mb-8 leading-[1.1] animate-fade-in-up tracking-tight">
              <span className="text-gray-900">India&apos;s National</span>
              <br />
              <span className="relative inline-block mt-2">
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Deepfake Shield
                </span>
                <svg className="absolute -bottom-4 left-0 w-full" height="12" viewBox="0 0 300 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 10C50 3 100 1 150 5C200 9 250 7 298 2" stroke="url(#gradient)" strokeWidth="3" strokeLinecap="round"/>
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="50%" stopColor="#6366F1" />
                      <stop offset="100%" stopColor="#8B5CF6" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-700 mb-10 leading-relaxed animate-fade-in-up animation-delay-200 max-w-4xl mx-auto text-center">
              AI-powered detection platform protecting citizens from deepfake fraud, misinformation, and digital identity theft.
              <span className="block mt-3 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                ✓ Trusted by law enforcement, courts, and enterprises nationwide
              </span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 justify-center mb-16 animate-fade-in-up animation-delay-400">
              <Link
                href="/register"
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl text-base font-bold shadow-xl hover:shadow-2xl hover:shadow-blue-500/50 transform hover:scale-105 transition-all duration-300 overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                <span className="relative flex items-center justify-center gap-2">
                  <span>Start Free Analysis</span>
                  <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </Link>
              <Link
                href="/create-deepfake"
                className="group relative px-8 py-4 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-2xl text-base font-bold shadow-xl hover:shadow-2xl hover:shadow-pink-500/50 transform hover:scale-105 transition-all duration-300 overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-pink-500 to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                <span className="relative flex items-center justify-center gap-2">
                  <span>🎨 Create Deepfake</span>
                  <span className="text-lg group-hover:scale-110 transition-transform inline-block">✨</span>
                </span>
              </Link>
              <Link
                href="/deepfake-tools"
                className="group relative px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl text-base font-bold shadow-xl hover:shadow-2xl hover:shadow-green-500/50 transform hover:scale-105 transition-all duration-300 overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                <span className="relative flex items-center justify-center gap-2">
                  <span>🔬 ML Tools</span>
                  <span className="text-lg group-hover:scale-110 transition-transform inline-block">🛠️</span>
                </span>
              </Link>
              <Link
                href="/live-deepfake"
                className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl text-base font-bold shadow-xl hover:shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300 overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                <span className="relative flex items-center justify-center gap-2">
                  <span>🎭 Live Studio</span>
                  <span className="text-lg group-hover:scale-110 transition-transform inline-block">📹</span>
                </span>
              </Link>
              <Link
                href="/analysis"
                className="group px-8 py-4 bg-white text-gray-900 border-2 border-gray-300 rounded-2xl text-base font-bold transform hover:scale-105 hover:border-blue-600 hover:text-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <span className="flex items-center justify-center gap-2">
                  <span>Watch Demo</span>
                  <span className="text-lg group-hover:scale-110 transition-transform inline-block">▶</span>
                </span>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto animate-fade-in-up animation-delay-600">
              <div className="flex flex-col items-center gap-2 px-4 py-4 bg-white rounded-2xl border-2 border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-green-600 text-2xl font-bold">✓</span>
                <div className="text-center">
                  <div className="text-xs font-bold text-gray-900">ISO 27001</div>
                  <div className="text-xs text-gray-600">Certified</div>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2 px-4 py-4 bg-white rounded-2xl border-2 border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-blue-600 text-2xl font-bold">✓</span>
                <div className="text-center">
                  <div className="text-xs font-bold text-gray-900">GDPR Safe</div>
                  <div className="text-xs text-gray-600">Compliant</div>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2 px-4 py-4 bg-white rounded-2xl border-2 border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-purple-600 text-2xl font-bold">🔒</span>
                <div className="text-center">
                  <div className="text-xs font-bold text-gray-900">256-bit AES</div>
                  <div className="text-xs text-gray-600">Encrypted</div>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2 px-4 py-4 bg-white rounded-2xl border-2 border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-orange-600 text-2xl font-bold">⚡</span>
                <div className="text-center">
                  <div className="text-xs font-bold text-gray-900">24/7 Active</div>
                  <div className="text-xs text-gray-600">Monitoring</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-20 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-6 relative">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">Proven Track Record</h2>
            <p className="text-gray-600 text-lg">Real-time statistics from our detection platform</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity"></div>
                <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100 group-hover:border-blue-200 transform group-hover:-translate-y-2">
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{stat.icon}</div>
                  <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2 group-hover:scale-105 transition-transform">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 font-semibold text-sm uppercase tracking-wide">{stat.label}</div>
                  <div className="mt-4 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"></div>
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <div className="inline-block mb-4 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-sm font-bold shadow-lg">
              ⚡ POWERED BY 6 AI ENGINES
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">
              Multi-Layer <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Detection System</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Advanced AI models working simultaneously to provide 360° protection against deepfakes, fraud, and digital manipulation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Link
                href="/analysis"
                key={index}
                className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 p-8 border-2 border-transparent hover:border-blue-200 transform hover:-translate-y-3 overflow-hidden cursor-pointer"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.color} opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500`}></div>
                <div className="relative">
                  <div className={`text-6xl mb-6 group-hover:scale-125 group-hover:rotate-6 transition-all duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed text-sm">
                    {feature.description}
                  </p>
                  <div className="flex items-center justify-between pt-6 border-t-2 border-gray-100">
                    <div className="text-center flex-1">
                      <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Accuracy</div>
                      <div className="text-2xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{feature.accuracy}</div>
                    </div>
                    <div className="w-px h-12 bg-gray-200"></div>
                    <div className="text-center flex-1">
                      <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Speed</div>
                      <div className="text-2xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">{feature.speed}</div>
                    </div>
                  </div>
                  <div className="mt-6 flex items-center justify-center gap-2 text-sm font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Try Now</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzR2Mi0oMnYtMmgtMnptMCA0aC0ydjJoMnYtMnptMC04aDJ2LTJoLTJ2MnptLTItMmgtMnYyaDJ2LTJ6bS0yIDJ2LTJIMzB2Mmgyem0tMiAyaC0ydjJoMnYtMnptLTIgMnYtMkgyNnYyaDJ6bS0yLTJoMnYtMmgtMnYyeiIvPjwvZz48L2c+PC9zdmc+')]"></div>
        <div className="container mx-auto px-6 relative">
          <div className="text-center mb-20">
            <div className="inline-block mb-4 px-6 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-sm font-bold text-white shadow-lg">
              🎯 SIMPLE 4-STEP PROCESS
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight">
              From Upload to <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Evidence</span>
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Court-admissible reports in minutes, not hours
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Connection Lines */}
            <div className="hidden md:block absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 opacity-30 rounded-full"></div>

            {howItWorks.map((step, index) => (
              <div key={index} className="relative">
                <div className="group bg-white/10 backdrop-blur-xl border-2 border-white/20 rounded-3xl p-8 text-center hover:bg-white/20 hover:border-cyan-400/50 transition-all duration-500 transform hover:-translate-y-4 hover:scale-105 shadow-2xl">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                    <div className="relative w-20 h-20 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto shadow-2xl group-hover:rotate-12 transition-transform">
                      {step.icon}
                    </div>
                  </div>
                  <div className="inline-block px-4 py-1 bg-gradient-to-r from-cyan-400 to-blue-400 text-white text-xs font-black rounded-full mb-4 shadow-lg">STEP {step.step}</div>
                  <h3 className="text-2xl font-black text-white mb-4 group-hover:text-cyan-300 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-blue-100 leading-relaxed">
                    {step.description}
                  </p>
                  <div className="mt-6 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200 rounded-full filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200 rounded-full filter blur-3xl opacity-20 translate-x-1/2 translate-y-1/2"></div>
        <div className="container mx-auto px-6 relative">
          <div className="text-center mb-20">
            <div className="inline-block mb-4 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-sm font-bold shadow-lg">
              💬 SUCCESS STORIES
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">
              Trusted by <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">500+ Organizations</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From law enforcement to enterprises, see how we&apos;re making India safer
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500"></div>
                <div className="relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border-2 border-transparent group-hover:border-blue-200 transform group-hover:-translate-y-2">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-3xl mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all">{testimonial.avatar}</div>
                  <div className="mb-6">
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-yellow-400 text-xl">★</span>
                      ))}
                    </div>
                    <p className="text-gray-700 leading-relaxed text-lg font-medium">
                      &ldquo;{testimonial.content}&rdquo;
                    </p>
                  </div>
                  <div className="border-t-2 border-gray-100 pt-6">
                    <div className="font-black text-gray-900 text-lg">{testimonial.name}</div>
                    <div className="text-sm text-blue-600 font-semibold">{testimonial.role}</div>
                  </div>
                  <div className="absolute top-6 right-6 text-6xl text-blue-100 font-serif">&rdquo;</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAgNGgtMnYyaDJ2LTJ6bTAtOGgydi0yaC0ydjJ6bS0yLTJoLTJ2Mmgydi0yem0tMiAydi0ySDMwdjJoMnptLTIgMmgtMnYyaDJ2LTJ6bS0yIDJ2LTJIMjZ2Mmgyem0tMi0yaDJ2LTJoLTJ2MnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
        </div>
        <div className="container mx-auto px-6 text-center relative">
          <div className="max-w-4xl mx-auto">
            <div className="inline-block mb-6 px-6 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-sm font-bold shadow-lg">
              🚀 START YOUR PROTECTION TODAY
            </div>
            <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tight">
              Ready to <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Stop Deepfakes?</span>
            </h2>
            <p className="text-2xl mb-12 text-blue-100 leading-relaxed max-w-3xl mx-auto">
              Join 500+ organizations protecting their digital identity with India&apos;s most trusted AI platform
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
              <Link
                href="/register"
                className="group relative px-14 py-7 bg-white text-blue-900 rounded-2xl text-2xl font-black shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400 opacity-0 group-hover:opacity-20 transition-opacity"></span>
                <span className="relative flex items-center gap-4 justify-center">
                  <span>Get Started Free</span>
                  <span className="text-3xl group-hover:translate-x-2 transition-transform">→</span>
                </span>
              </Link>
              <Link
                href="/admin"
                className="group px-14 py-7 bg-white/10 backdrop-blur-md border-2 border-white/30 text-white rounded-2xl text-2xl font-black hover:bg-white/20 hover:border-cyan-400/50 transform hover:scale-105 transition-all duration-300 shadow-2xl"
              >
                <span className="flex items-center gap-4 justify-center">
                  <span>👮</span>
                  <span>Government Portal</span>
                </span>
              </Link>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-blue-200">
              <div className="flex items-center gap-2">
                <span className="text-green-400 text-xl">✓</span>
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400 text-xl">✓</span>
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400 text-xl">✓</span>
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
                  DC
                </div>
                <span className="text-xl font-bold text-white">DeepClean AI</span>
              </div>
              <p className="text-sm mb-4">
                National deepfake detection and fraud prevention platform for India.
              </p>
              <div className="flex gap-4 mb-4">
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition">
                  📘
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition">
                  🐦
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition">
                  💼
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/features" className="hover:text-white transition">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition">Pricing</Link></li>
                <li><Link href="/analysis" className="hover:text-white transition">Analysis</Link></li>
                <li><Link href="/api-docs" className="hover:text-white transition">API Docs</Link></li>
                <li><Link href="/dashboard" className="hover:text-white transition">Dashboard</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
                <li><Link href="/careers" className="hover:text-white transition">Careers</Link></li>
                <li><Link href="/blog" className="hover:text-white transition">Blog</Link></li>
                <li><Link href="/press" className="hover:text-white transition">Press Kit</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/admin" className="hover:text-white transition">Government Portal</Link></li>
                <li><Link href="/victim" className="hover:text-white transition">Victim Support</Link></li>
                <li><Link href="/help" className="hover:text-white transition">Help Center</Link></li>
                <li><Link href="/security" className="hover:text-white transition">Security</Link></li>
                <li><Link href="/terms" className="hover:text-white transition">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>© 2025 DeepClean AI. Ministry of Electronics & Information Technology, Government of India.</p>
            <p className="mt-2">ISO 27001 Certified • GDPR Compliant • 256-bit Encryption</p>
            <div className="flex justify-center gap-6 mt-4 text-xs">
              <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white">Terms of Service</Link>
              <Link href="/cookies" className="hover:text-white">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
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
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
          animation-fill-mode: both;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
          animation-fill-mode: both;
        }
        .animation-delay-600 {
          animation-delay: 0.6s;
          animation-fill-mode: both;
        }
      `}</style>
    </main>
  );
}
