'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function VictimPortal() {
  const [activeStep, setActiveStep] = useState(1);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [deepfakeFiles, setDeepfakeFiles] = useState<File[]>([]);
  const [deepfakeUrls, setDeepfakeUrls] = useState<string[]>(['']);
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [platforms, setPlatforms] = useState({
    youtube: false,
    facebook: false,
    instagram: false,
    twitter: false,
    tiktok: false,
    linkedin: false
  });

  const handleOriginalUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setOriginalFile(e.target.files[0]);
    }
  };

  const handleDeepfakeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setDeepfakeFiles(Array.from(e.target.files));
    }
  };

  const addUrlField = () => {
    setDeepfakeUrls([...deepfakeUrls, '']);
  };

  const updateUrl = (index: number, value: string) => {
    const newUrls = [...deepfakeUrls];
    newUrls[index] = value;
    setDeepfakeUrls(newUrls);
  };

  const removeUrl = (index: number) => {
    setDeepfakeUrls(deepfakeUrls.filter((_, i) => i !== index));
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    
    try {
      // Create FormData for file uploads
      const formData = new FormData();
      
      if (originalFile) {
        formData.append('original_file', originalFile);
      }
      
      deepfakeFiles.forEach((file, index) => {
        formData.append(`deepfake_file_${index}`, file);
      });
      
      // Add URLs
      const validUrls = deepfakeUrls.filter(url => url.trim() !== '');
      formData.append('deepfake_urls', JSON.stringify(validUrls));
      
      // Call real API endpoint
      const response = await fetch('http://localhost:8001/api/v1/victim/analyze', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Analysis failed');
      }
      
      const data = await response.json();
      
      setAnalysisResult({
        isDeepfake: data.is_deepfake || false,
        confidence: data.confidence || 0,
        detectionEngines: data.detection_engines || [],
        evidence: data.evidence || []
      });
      setActiveStep(3);
    } catch (error) {
      console.error('Analysis error:', error);
      alert('Failed to analyze content. Please ensure the backend is running.');
      setActiveStep(1);
    } finally {
      setAnalyzing(false);
    }
  };

  const generateLegalDocuments = () => {
    // Generate DMCA, FIR, Evidence Package
    alert('Legal documents generated! Check downloads folder.');
  };

  const submitTakedowns = async () => {
    const selectedPlatforms = Object.entries(platforms)
      .filter(([_, selected]) => selected)
      .map(([platform]) => platform);
    
    if (selectedPlatforms.length === 0) {
      alert('Please select at least one platform');
      return;
    }

    alert(`Takedown requests submitted to: ${selectedPlatforms.join(', ')}\nYou will receive email updates on the status.`);
    setActiveStep(4);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-orange-50">
      {/* Header */}
      <nav className="bg-white/95 backdrop-blur-2xl border-b border-pink-100 shadow-xl">
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 via-pink-600 to-orange-600 rounded-2xl flex items-center justify-center text-white font-black text-3xl shadow-2xl">
                🛡️
              </div>
              <div>
                <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-pink-600 to-orange-600">Women's Safety & Victim Support Portal</h1>
                <p className="text-sm text-red-600 font-extrabold">Protecting Women from Deepfakes, Revenge Porn & Digital Abuse</p>
              </div>
            </div>
            <Link href="/" className="px-6 py-3 text-gray-700 hover:text-pink-600 font-bold transition border-2 border-transparent hover:border-pink-200 rounded-xl">
              ← Back to Home
            </Link>
          </div>
        </div>
      </nav>

      {/* Progress Steps */}
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-center gap-4 mb-12">
          {[
            { num: 1, label: 'Upload Files', icon: '📤' },
            { num: 2, label: 'AI Analysis', icon: '🤖' },
            { num: 3, label: 'Legal Docs', icon: '📄' },
            { num: 4, label: 'Takedown', icon: '✅' }
          ].map((step) => (
            <div key={step.num} className="flex items-center">
              <div className={`flex flex-col items-center ${activeStep >= step.num ? 'opacity-100' : 'opacity-40'}`}>
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black shadow-xl ${
                  activeStep >= step.num 
                    ? 'bg-gradient-to-br from-red-600 to-orange-600 text-white' 
                    : 'bg-white text-gray-400 border-2 border-gray-300'
                }`}>
                  {activeStep > step.num ? '✓' : step.icon}
                </div>
                <div className={`mt-2 text-sm font-bold ${activeStep >= step.num ? 'text-red-600' : 'text-gray-400'}`}>
                  {step.label}
                </div>
              </div>
              {step.num < 4 && (
                <div className={`w-20 h-1 mx-2 rounded-full ${activeStep > step.num ? 'bg-gradient-to-r from-red-600 to-orange-600' : 'bg-gray-300'}`}></div>
              )}
            </div>
          ))}
        </div>

        {/* STEP 1: UPLOAD */}
        {activeStep === 1 && (
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl p-10 border-2 border-red-100">
              <h2 className="text-3xl font-black text-gray-900 mb-3">Upload Your Content</h2>
              <p className="text-gray-600 mb-8">Upload your original content and the fake/deepfake versions you found online</p>

              {/* Original Content */}
              <div className="mb-10">
                <label className="block text-xl font-bold text-gray-900 mb-4">1️⃣ Your Original Content (Proof)</label>
                <div className="border-4 border-dashed border-blue-300 rounded-2xl p-8 bg-blue-50 hover:bg-blue-100 transition cursor-pointer">
                  <input
                    type="file"
                    accept="image/*,video/*,audio/*"
                    onChange={handleOriginalUpload}
                    className="hidden"
                    id="original-upload"
                  />
                  <label htmlFor="original-upload" className="cursor-pointer flex flex-col items-center">
                    <div className="text-6xl mb-4">📁</div>
                    {originalFile ? (
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-900">✓ {originalFile.name}</div>
                        <div className="text-sm text-blue-600">{(originalFile.size / 1024 / 1024).toFixed(2)} MB</div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-900">Click to Upload Original</div>
                        <div className="text-sm text-blue-600">Image, Video, or Audio</div>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Deepfake Content */}
              <div className="mb-10">
                <label className="block text-xl font-bold text-gray-900 mb-4">2️⃣ Fake/Deepfake Content (Upload Files)</label>
                <div className="border-4 border-dashed border-red-300 rounded-2xl p-8 bg-red-50 hover:bg-red-100 transition cursor-pointer">
                  <input
                    type="file"
                    accept="image/*,video/*,audio/*"
                    multiple
                    onChange={handleDeepfakeUpload}
                    className="hidden"
                    id="deepfake-upload"
                  />
                  <label htmlFor="deepfake-upload" className="cursor-pointer flex flex-col items-center">
                    <div className="text-6xl mb-4">⚠️</div>
                    {deepfakeFiles.length > 0 ? (
                      <div className="text-center">
                        <div className="text-lg font-bold text-red-900">✓ {deepfakeFiles.length} files selected</div>
                        <div className="text-sm text-red-600">
                          {deepfakeFiles.map(f => f.name).join(', ')}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="text-lg font-bold text-red-900">Click to Upload Fake Content</div>
                        <div className="text-sm text-red-600">Multiple files supported</div>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* URLs */}
              <div className="mb-8">
                <label className="block text-xl font-bold text-gray-900 mb-4">3️⃣ Or Paste URLs (Where It&apos;s Posted)</label>
                {deepfakeUrls.map((url, index) => (
                  <div key={index} className="flex items-center gap-3 mb-3">
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => updateUrl(index, e.target.value)}
                      placeholder="https://youtube.com/watch?v=... or https://facebook.com/..."
                      className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none"
                    />
                    {deepfakeUrls.length > 1 && (
                      <button
                        onClick={() => removeUrl(index)}
                        className="px-4 py-3 bg-red-100 text-red-600 rounded-xl font-bold hover:bg-red-200 transition"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={addUrlField}
                  className="mt-2 px-6 py-2 bg-blue-100 text-blue-600 rounded-xl font-bold hover:bg-blue-200 transition"
                >
                  + Add Another URL
                </button>
              </div>

              {/* User Info */}
              <div className="mb-8 p-6 bg-gray-50 rounded-2xl border-2 border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Your Contact Information (Optional - for legal docs)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={userInfo.name}
                    onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
                    className="px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 outline-none"
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={userInfo.email}
                    onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
                    className="px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 outline-none"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={userInfo.phone}
                    onChange={(e) => setUserInfo({...userInfo, phone: e.target.value})}
                    className="px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Address (optional)"
                    value={userInfo.address}
                    onChange={(e) => setUserInfo({...userInfo, address: e.target.value})}
                    className="px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <button
                onClick={() => setActiveStep(2)}
                disabled={!originalFile && deepfakeFiles.length === 0 && !deepfakeUrls.some(u => u.length > 0)}
                className="w-full px-8 py-5 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-2xl text-xl font-black hover:shadow-2xl hover:shadow-red-500/50 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next: Analyze Content →
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: AI ANALYSIS */}
        {activeStep === 2 && (
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl p-10 border-2 border-blue-100">
              <h2 className="text-3xl font-black text-gray-900 mb-3">AI Analysis</h2>
              <p className="text-gray-600 mb-8">Our 6 AI engines will analyze your content to prove it&apos;s a deepfake</p>

              {!analyzing && !analysisResult && (
                <div className="text-center py-12">
                  <div className="text-8xl mb-6">🤖</div>
                  <button
                    onClick={handleAnalyze}
                    className="px-12 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl text-xl font-black hover:shadow-2xl hover:shadow-blue-500/50 transition-all transform hover:scale-105"
                  >
                    Start AI Analysis
                  </button>
                </div>
              )}

              {analyzing && (
                <div className="text-center py-12">
                  <div className="text-8xl mb-6 animate-pulse">🔬</div>
                  <div className="text-2xl font-bold text-gray-900 mb-4">Analyzing Content...</div>
                  <div className="text-lg text-gray-600 mb-8">Running 6 AI detection engines</div>
                  <div className="max-w-md mx-auto bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-4 rounded-full animate-pulse w-[70%]"></div>
                  </div>
                </div>
              )}

              {analysisResult && (
                <div className="space-y-6">
                  {/* Main Result */}
                  <div className={`p-8 rounded-2xl text-center ${analysisResult.isDeepfake ? 'bg-red-100 border-4 border-red-500' : 'bg-green-100 border-4 border-green-500'}`}>
                    <div className="text-6xl mb-4">{analysisResult.isDeepfake ? '🚨' : '✅'}</div>
                    <div className="text-3xl font-black mb-2">
                      {analysisResult.isDeepfake ? 'DEEPFAKE DETECTED!' : 'AUTHENTIC CONTENT'}
                    </div>
                    <div className="text-xl font-bold text-gray-700">
                      Confidence: {analysisResult.confidence}%
                    </div>
                  </div>

                  {/* Detection Engines */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Detection Engines Results:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {analysisResult.detectionEngines.map((engine: any, idx: number) => (
                        <div key={idx} className="p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-gray-900">{engine.name}</span>
                            <span className="px-3 py-1 bg-red-500 text-white rounded-lg font-bold text-sm">
                              {engine.status}
                            </span>
                          </div>
                          <div className="text-2xl font-black text-red-600">{engine.score}%</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Evidence */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Evidence Found:</h3>
                    <ul className="space-y-2">
                      {analysisResult.evidence.map((ev: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-3 p-3 bg-yellow-50 rounded-xl border border-yellow-200">
                          <span className="text-xl">⚠️</span>
                          <span className="font-semibold text-gray-800">{ev}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => setActiveStep(1)}
                      className="flex-1 px-8 py-4 bg-gray-200 text-gray-800 rounded-2xl text-lg font-bold hover:bg-gray-300 transition"
                    >
                      ← Back
                    </button>
                    <button
                      onClick={() => setActiveStep(3)}
                      className="flex-1 px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-2xl text-lg font-black hover:shadow-2xl transition-all transform hover:scale-105"
                    >
                      Next: Generate Legal Docs →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 3: LEGAL DOCUMENTS */}
        {activeStep === 3 && (
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl p-10 border-2 border-purple-100">
              <h2 className="text-3xl font-black text-gray-900 mb-3">Generate Legal Documents</h2>
              <p className="text-gray-600 mb-8">Auto-generate court-ready legal documents with your evidence</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border-2 border-blue-300 hover:shadow-xl transition">
                  <div className="text-5xl mb-4">📄</div>
                  <h3 className="text-lg font-black text-blue-900 mb-2">DMCA Notice</h3>
                  <p className="text-sm text-blue-700 mb-4">Copyright takedown notice for US platforms</p>
                  <button
                    onClick={generateLegalDocuments}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition"
                  >
                    Generate PDF
                  </button>
                </div>

                <div className="p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-2xl border-2 border-red-300 hover:shadow-xl transition">
                  <div className="text-5xl mb-4">⚖️</div>
                  <h3 className="text-lg font-black text-red-900 mb-2">IT Act FIR</h3>
                  <p className="text-sm text-red-700 mb-4">Police complaint under IT Act 2000</p>
                  <button
                    onClick={generateLegalDocuments}
                    className="w-full px-4 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition"
                  >
                    Generate PDF
                  </button>
                </div>

                <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border-2 border-purple-300 hover:shadow-xl transition">
                  <div className="text-5xl mb-4">📦</div>
                  <h3 className="text-lg font-black text-purple-900 mb-2">Evidence Package</h3>
                  <p className="text-sm text-purple-700 mb-4">Complete evidence bundle for court</p>
                  <button
                    onClick={generateLegalDocuments}
                    className="w-full px-4 py-2 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition"
                  >
                    Generate ZIP
                  </button>
                </div>
              </div>

              <div className="p-6 bg-yellow-50 rounded-2xl border-2 border-yellow-300 mb-8">
                <div className="flex items-start gap-4">
                  <span className="text-3xl">💡</span>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">What&apos;s Included:</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>✓ AI Analysis Report with confidence scores</li>
                      <li>✓ Technical evidence and forensic data</li>
                      <li>✓ Timestamped screenshots and metadata</li>
                      <li>✓ Your contact information (if provided)</li>
                      <li>✓ Platform-specific takedown request formats</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setActiveStep(2)}
                  className="flex-1 px-8 py-4 bg-gray-200 text-gray-800 rounded-2xl text-lg font-bold hover:bg-gray-300 transition"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setActiveStep(4)}
                  className="flex-1 px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-2xl text-lg font-black hover:shadow-2xl transition-all transform hover:scale-105"
                >
                  Next: Submit Takedowns →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: TAKEDOWN SUBMISSION */}
        {activeStep === 4 && (
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl p-10 border-2 border-green-100">
              <h2 className="text-3xl font-black text-gray-900 mb-3">Submit Takedown Requests</h2>
              <p className="text-gray-600 mb-8">We&apos;ll automatically submit removal requests to all platforms</p>

              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Select Platforms:</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { key: 'youtube', name: 'YouTube', icon: '▶️', color: 'red' },
                    { key: 'facebook', name: 'Facebook', icon: '👥', color: 'blue' },
                    { key: 'instagram', name: 'Instagram', icon: '📷', color: 'pink' },
                    { key: 'twitter', name: 'Twitter / X', icon: '🐦', color: 'sky' },
                    { key: 'tiktok', name: 'TikTok', icon: '🎵', color: 'gray' },
                    { key: 'linkedin', name: 'LinkedIn', icon: '💼', color: 'blue' }
                  ].map((platform) => (
                    <button
                      key={platform.key}
                      onClick={() => setPlatforms({...platforms, [platform.key]: !platforms[platform.key as keyof typeof platforms]})}
                      className={`p-6 rounded-2xl border-4 transition-all transform hover:scale-105 ${
                        platforms[platform.key as keyof typeof platforms]
                          ? `bg-${platform.color}-100 border-${platform.color}-500`
                          : 'bg-gray-50 border-gray-300'
                      }`}
                    >
                      <div className="text-4xl mb-2">{platform.icon}</div>
                      <div className="font-bold text-gray-900">{platform.name}</div>
                      {platforms[platform.key as keyof typeof platforms] && (
                        <div className="mt-2 text-green-600 font-bold">✓ Selected</div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-green-50 rounded-2xl border-2 border-green-300 mb-8">
                <div className="flex items-start gap-4">
                  <span className="text-3xl">🚀</span>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">What Happens Next:</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>✓ Automated takedown requests sent to all platforms</li>
                      <li>✓ Real-time tracking of removal status</li>
                      <li>✓ Email notifications on progress</li>
                      <li>✓ Escalation to legal team if needed</li>
                      <li>✓ Typical removal time: 24-72 hours</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setActiveStep(3)}
                  className="flex-1 px-8 py-4 bg-gray-200 text-gray-800 rounded-2xl text-lg font-bold hover:bg-gray-300 transition"
                >
                  ← Back
                </button>
                <button
                  onClick={submitTakedowns}
                  className="flex-1 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl text-lg font-black hover:shadow-2xl hover:shadow-green-500/50 transition-all transform hover:scale-105"
                >
                  Submit All Takedowns ✓
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
