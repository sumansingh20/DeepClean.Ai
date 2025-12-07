'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AnalysisPage() {
  type AnalysisType = 'voice' | 'video' | 'document' | 'liveness' | 'scam' | 'image' | 'audio' | 'batch' | 'face' | 'text' | 'metadata' | 'stream';
  
  const [activeTab, setActiveTab] = useState<AnalysisType>('video');
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [dragActive, setDragActive] = useState(false);
  const [batchFiles, setBatchFiles] = useState<File[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [progress, setProgress] = useState(0);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  // Check backend health on mount
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch('http://localhost:8001/', { method: 'GET' });
        if (response.ok) {
          setBackendStatus('online');
        } else {
          setBackendStatus('offline');
        }
      } catch (error) {
        setBackendStatus('offline');
      }
    };
    checkBackend();
  }, []);

  const tabs = [
    { key: 'video', label: 'Video Analysis', desc: 'Frame-by-frame detection', color: 'from-purple-500 to-pink-500', icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' },
    { key: 'face', label: 'Face Swap Detection', desc: 'Face replacement analysis', color: 'from-violet-500 to-purple-500', icon: 'M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    { key: 'voice', label: 'Voice Clone Check', desc: 'Speech synthesis detection', color: 'from-blue-500 to-cyan-500', icon: 'M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z' },
    { key: 'image', label: 'Image Forensics', desc: 'Pixel-level manipulation', color: 'from-pink-500 to-rose-500', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { key: 'text', label: 'Text Analysis', desc: 'AI-written content detection', color: 'from-emerald-500 to-teal-500', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { key: 'audio', label: 'Audio Authenticity', desc: 'Sound wave verification', color: 'from-indigo-500 to-blue-500', icon: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3' },
    { key: 'metadata', label: 'Metadata Check', desc: 'File history & EXIF data', color: 'from-amber-500 to-orange-500', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { key: 'document', label: 'Document Verify', desc: 'ID & certificate check', color: 'from-green-500 to-emerald-500', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { key: 'stream', label: 'Live Stream Check', desc: 'Real-time feed analysis', color: 'from-red-500 to-pink-500', icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' },
    { key: 'liveness', label: 'Liveness Test', desc: 'Biometric verification', color: 'from-orange-500 to-amber-500', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { key: 'scam', label: 'Scam Detection', desc: 'Fraud pattern analysis', color: 'from-red-500 to-orange-500', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
    { key: 'batch', label: 'Batch Processing', desc: 'Multiple files at once', color: 'from-teal-500 to-cyan-500', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setResult(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    
    setAnalyzing(true);
    setProgress(0);
    
    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return prev;
        return prev + 10;
      });
    }, 500);
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      // Map analysis types to backend endpoints
      const endpointMap: Record<AnalysisType, string> = {
        'video': '/api/v1/advanced/video/analyze-advanced',
        'face': '/api/v1/advanced/video/analyze-advanced',
        'audio': '/api/v1/advanced/audio/analyze-advanced',
        'voice': '/api/v1/advanced/audio/analyze-advanced',
        'image': '/api/v1/advanced/image/analyze-advanced',
        'text': '/api/v1/advanced/image/analyze-advanced',
        'metadata': '/api/v1/advanced/image/analyze-advanced',
        'document': '/api/v1/advanced/image/analyze-advanced',
        'stream': '/api/v1/advanced/video/analyze-advanced',
        'liveness': '/api/v1/advanced/video/analyze-advanced',
        'scam': '/api/v1/advanced/audio/analyze-advanced',
        'batch': '/api/v1/advanced/video/analyze-advanced'
      };

      const endpoint = endpointMap[activeTab];
      const response = await fetch(`http://localhost:8001${endpoint}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Upload failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      
      // Transform backend response to frontend format
      const isFake = data.detection_result?.is_fake || false;
      const confidence = data.detection_result?.confidence || data.detection_result?.fake_probability || 0;
      
      setResult({
        isDeepfake: isFake,
        confidence: confidence,
        verification: {
          verdict: isFake ? 'DEEPFAKE DETECTED' : 'AUTHENTIC CONTENT',
          reasons: data.anomalies_found?.map((a: any) => a.description || a) || [],
          technical_indicators: Object.entries(data.forensic_metrics || {}).map(([k, v]) => `${k}: ${v}`),
          recommendation: isFake ? 'Content appears to be manipulated. Use caution.' : 'Content appears authentic.'
        },
        engines: Object.entries(data.forensic_metrics || {}).slice(0, 6).map(([name, value]: [string, any]) => ({
          name: name.replace(/_/g, ' ').toUpperCase(),
          score: typeof value === 'number' ? value : parseFloat(value) || 50,
          status: typeof value === 'number' && value > 70 ? 'pass' : 'warning'
        })),
        metadata: {
          duration: data.forensic_metrics?.duration || 'N/A',
          resolution: data.forensic_metrics?.resolution || 'N/A',
          codec: data.forensic_metrics?.codec || 'N/A',
          fps: data.forensic_metrics?.fps || 'N/A'
        },
        threats: data.anomalies_found?.map((a: any) => a.description || a.type || String(a)) || [],
        analysis_id: data.case_id,
        timestamp: data.timestamp
      });
      
      setHistory(prev => [{
        id: data.case_id,
        type: activeTab,
        filename: file.name,
        isDeepfake: isFake,
        confidence: confidence,
        timestamp: new Date().toISOString()
      }, ...prev.slice(0, 9)]);
      
      clearInterval(progressInterval);
      setProgress(100);
      setTimeout(() => setAnalyzing(false), 500);
      
    } catch (error) {
      console.error('Analysis error:', error);
      clearInterval(progressInterval);
      setAnalyzing(false);
      setProgress(0);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const isBackendDown = errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError');
      
      if (isBackendDown) {
        alert('⚠️ Cannot connect to backend server.\n\nPlease ensure:\n1. Backend is running on port 8001\n2. Run: .\\START_BACKEND.ps1 from backend folder');
        setBackendStatus('offline');
      } else {
        alert(`❌ Analysis failed: ${errorMessage}`);
      }
      setResult(null);
    }
  };

  const downloadReport = () => {
    if (!result) return;
    const reportData = {
      analysis_type: activeTab,
      filename: file?.name,
      result: result.isDeepfake ? 'DEEPFAKE DETECTED' : 'AUTHENTIC',
      confidence: result.confidence,
      timestamp: new Date().toISOString(),
      details: result.verification
    };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analysis-report-${Date.now()}.json`;
    a.click();
  };

  const handleBatchUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setBatchFiles(Array.from(e.target.files));
      setResult(null);
    }
  };

  const analyzeBatch = async () => {
    if (batchFiles.length === 0) return;
    
    setAnalyzing(true);
    const results = [];
    
    for (const batchFile of batchFiles) {
      try {
        const formData = new FormData();
        formData.append('file', batchFile);

        // Determine endpoint based on file type
        let endpoint = '/api/v1/advanced/video/analyze-advanced';
        if (batchFile.type.startsWith('audio/')) {
          endpoint = '/api/v1/advanced/audio/analyze-advanced';
        } else if (batchFile.type.startsWith('image/')) {
          endpoint = '/api/v1/advanced/image/analyze-advanced';
        }

        const response = await fetch(`http://localhost:8001${endpoint}`, {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          const isFake = data.detection_result?.is_fake || false;
          const confidence = data.detection_result?.confidence || data.detection_result?.fake_probability || 0;
          
          results.push({
            filename: batchFile.name,
            isDeepfake: isFake,
            confidence: confidence
          });
        }
      } catch (error) {
        console.error(`Error analyzing ${batchFile.name}:`, error);
      }
    }
    
    setResult({ batchResults: results });
    setAnalyzing(false);
  };

  const currentTab = tabs.find(t => t.key === activeTab);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-2xl border-b border-white/20 shadow-2xl shadow-blue-500/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative w-14 h-14 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/50 hover:scale-110 transition-all duration-500">
                <span className="text-3xl text-white drop-shadow-lg">⚡</span>
                <div className="absolute -inset-0.5 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-2xl blur opacity-40 -z-10"></div>
              </div>
              <div>
                <h1 className="text-3xl font-black bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent tracking-tight">AI Analysis</h1>
                <p className="text-sm text-gray-600 flex items-center gap-2 font-semibold">\n                  {backendStatus === 'checking' && (
                    <>
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                      </span>
                      Checking Backend...
                    </>
                  )}
                  {backendStatus === 'online' && (
                    <>
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                      </span>
                      All Systems Operational
                    </>
                  )}
                  {backendStatus === 'offline' && (
                    <>
                      <span className="relative flex h-2 w-2 bg-red-500 rounded-full"></span>
                      Backend Offline - Please start backend server
                    </>
                  )}
                </p>
              </div>
            </div>
            <Link href="/dashboard" className="group px-6 py-3 text-gray-700 hover:text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-all duration-300 flex items-center gap-2">
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12">
        {/* Tab Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key as any);
                setFile(null);
                setResult(null);
              }}
              className={`group relative p-6 rounded-3xl transition-all duration-500 overflow-hidden ${
                activeTab === tab.key
                  ? 'bg-gradient-to-br text-white shadow-2xl scale-105'
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300 hover:shadow-lg hover:-translate-y-1'
              }`}
              style={activeTab === tab.key ? {
                backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))`,
                '--tw-gradient-from': tab.color.split(' ')[0].replace('from-', ''),
                '--tw-gradient-to': tab.color.split(' ')[1].replace('to-', '')
              } as any : {}}
            >
              {activeTab === tab.key && (
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-3xl"></div>
              )}
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    activeTab === tab.key ? 'bg-white/20' : 'bg-gray-100 group-hover:bg-blue-100'
                  } transition-colors duration-300`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                    </svg>
                  </div>
                  <div className={`font-black text-lg ${activeTab === tab.key ? 'text-white' : 'text-gray-900'}`}>
                    {tab.label}
                  </div>
                </div>
                <div className={`text-sm font-medium ${activeTab === tab.key ? 'text-white/90' : 'text-gray-500'}`}>
                  {tab.desc}
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6 animate-fadeInUp" style={{animationDelay: '200ms'}}>
            <div className="relative bg-white rounded-3xl shadow-2xl p-8 border-2 border-gray-100 overflow-hidden hover:shadow-3xl transition-all duration-500 group">
              {/* Animated Background Orb */}
              <div className="absolute -top-20 -right-20 w-60 h-60 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
              
              <div className="relative flex items-center gap-4 mb-8">
                <div className="relative">
                  <div className={`w-16 h-16 bg-gradient-to-br ${currentTab?.color} rounded-2xl flex items-center justify-center shadow-xl`}>
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={currentTab?.icon} />
                    </svg>
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-4 border-white"></div>
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-black text-gray-900 tracking-tight">{currentTab?.label} Analysis</h2>
                  <p className="text-base text-gray-600 font-medium mt-1">{currentTab?.desc}</p>
                </div>
              </div>

              {/* Drag & Drop Zone */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`relative border-4 border-dashed rounded-3xl p-12 mb-8 transition-all duration-500 overflow-hidden ${
                  dragActive 
                    ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 scale-[1.02] shadow-2xl' 
                    : file 
                      ? 'border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 shadow-xl' 
                      : 'border-gray-300 bg-gradient-to-br from-gray-50 via-white to-gray-50 hover:border-blue-400 hover:shadow-xl hover:scale-[1.01]'
                }`}
              >
                {/* Animated Gradient Overlay */}
                {dragActive && (
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-purple-400/10 animate-gradient"></div>
                )}
                
                <input
                  type="file"
                  accept={
                    activeTab === 'voice' || activeTab === 'audio' ? 'audio/*' :
                    activeTab === 'video' || activeTab === 'liveness' ? 'video/*' :
                    activeTab === 'image' ? 'image/*' :
                    activeTab === 'batch' ? '*' :
                    'image/*,.pdf'
                  }
                  onChange={activeTab === 'batch' ? handleBatchUpload : handleFileUpload}
                  multiple={activeTab === 'batch'}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center relative z-10">
                  <div className="text-7xl mb-4 animate-bounce-slow">
                    {dragActive ? '🎯' : file ? '✅' : '📎'}
                  </div>
                  {activeTab === 'batch' && batchFiles.length > 0 ? (
                    <div className="text-center">
                      <div className="text-2xl font-black bg-gradient-to-r from-green-600 to-emerald-600 text-transparent bg-clip-text mb-3">
                        ✓ {batchFiles.length} Files Selected
                      </div>
                      <div className="text-sm text-gray-600 mt-2 max-h-32 overflow-y-auto bg-white rounded-xl p-4 shadow-inner">
                        {batchFiles.map((f, i) => (
                          <div key={i} className="text-gray-700 font-medium py-1 flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            {f.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : file ? (
                    <div className="text-center">
                      <div className="text-2xl font-black bg-gradient-to-r from-green-600 to-emerald-600 text-transparent bg-clip-text mb-3">
                        ✓ File Selected
                      </div>
                      <div className="text-xl font-bold text-gray-900 mb-2">{file.name}</div>
                      <div className="inline-flex items-center gap-2 text-sm text-gray-600 bg-white px-4 py-2 rounded-full shadow-md font-semibold">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" />
                        </svg>
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="text-3xl font-black text-gray-900 mb-3">Drop file{activeTab === 'batch' ? 's' : ''} here</div>
                      <div className="text-lg text-gray-600 mb-4 font-medium">or click to browse</div>
                      <div className="inline-flex items-center gap-2 text-base text-gray-700 bg-white px-6 py-3 rounded-xl border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all font-bold">
                        {activeTab === 'voice' && <><span>🎵</span> Audio: MP3, WAV, AAC</>}
                        {activeTab === 'audio' && <><span>🔊</span> Audio: Any format</>}
                        {activeTab === 'video' && <><span>🎬</span> Video: MP4, AVI, MOV</>}
                        {activeTab === 'image' && <><span>🖼️</span> Image: JPG, PNG, WEBP</>}
                        {activeTab === 'document' && <><span>📎</span> Image or PDF</>}
                        {activeTab === 'liveness' && <><span>🎥</span> Video of yourself</>}
                        {activeTab === 'scam' && <><span>☎️</span> Call recording</>}
                        {activeTab === 'batch' && <><span>📦</span> Multiple files (any type)</>}
                      </div>
                    </div>
                  )}
                </label>
              </div>

              <button
                onClick={activeTab === 'batch' ? analyzeBatch : handleAnalyze}
                disabled={(activeTab === 'batch' ? batchFiles.length === 0 : !file) || analyzing}
                className={`w-full relative overflow-hidden group py-6 text-xl font-black rounded-2xl transition-all duration-500 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                  (activeTab === 'batch' ? batchFiles.length === 0 : !file) || analyzing
                    ? 'bg-gray-300 text-gray-500'
                    : `bg-gradient-to-r ${currentTab?.color} text-white hover:scale-[1.02] hover:-translate-y-1`
                }`}
              >
                {!((activeTab === 'batch' ? batchFiles.length === 0 : !file) || analyzing) && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                )}
                <span className="relative z-10">
                  {analyzing ? (
                    <span className="flex items-center justify-center gap-3">
                      <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Analyzing{activeTab === 'batch' ? ' Batch' : ''}...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-3">
                      <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Start Analysis
                    </span>
                  )}
                </span>
              </button>

              {/* Analysis History */}
              {history.length > 0 && (
                <div className="mt-6 p-5 bg-white rounded-lg border border-gray-200 shadow">
                  <h3 className="text-base font-bold text-gray-900 mb-3">
                    Recent Analysis
                  </h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {history.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm text-gray-900 truncate">{item.filename}</div>
                          <div className="text-xs text-gray-500">{new Date(item.timestamp).toLocaleTimeString()}</div>
                        </div>
                        <div className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ml-2 ${
                          item.isDeepfake ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {item.isDeepfake ? 'Fake' : 'Real'} {item.confidence.toFixed(0)}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {file && !analyzing && !result && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-sm text-gray-700">
                    <p className="font-bold text-base mb-1 text-blue-900">Ready to analyze</p>
                    <p>Click the button above to start analysis.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6 animate-fadeInUp" style={{animationDelay: '400ms'}}>
            <div className="relative bg-white rounded-3xl shadow-2xl p-8 border-2 border-gray-100 overflow-hidden min-h-[600px] hover:shadow-3xl transition-all duration-500 group">
              {/* Animated Background */}
              <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
              
              <div className="relative">
                <h2 className="text-3xl font-black text-gray-900 mb-8 tracking-tight flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </div>
                  Analysis Results
                </h2>

              {!analyzing && !result && (
                <div className="text-center py-24">
                  <div className="relative inline-block mb-8">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-full blur-2xl animate-pulse"></div>
                    <div className="relative text-8xl">🔬</div>
                  </div>
                  <p className="text-2xl font-black text-gray-900 mb-3">Ready to Analyze</p>
                  <p className="text-lg text-gray-600 font-medium">Upload a file to start AI-powered detection</p>
                  <div className="mt-8 flex items-center justify-center gap-4">
                    <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full">
                      <span className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></span>
                      <span className="text-sm font-bold text-blue-900">8 AI Engines</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full">
                      <span className="text-green-600">⚡</span>
                      <span className="text-sm font-bold text-green-900">2-5 Second Analysis</span>
                    </div>
                  </div>
                </div>
              )}

              {analyzing && (
                <div className="text-center py-16">
                  <div className="mb-8 relative inline-block">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-full blur-3xl animate-pulse"></div>
                    <div className="relative w-32 h-32 mx-auto">
                      <div className="absolute inset-0 border-8 border-blue-500/30 rounded-full"></div>
                      <div className="absolute inset-0 border-8 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      <div className="absolute inset-4 border-8 border-purple-500/30 rounded-full"></div>
                      <div className="absolute inset-4 border-8 border-purple-500 border-b-transparent rounded-full animate-spin" style={{animationDirection: 'reverse'}}></div>
                    </div>
                  </div>
                  
                  <div className="text-4xl font-black bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text mb-8">Analyzing Content...</div>
                  
                  <div className="max-w-md mx-auto mb-10">
                    <div className="bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
                      <div 
                        className="h-3 rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 transition-all duration-500 relative"
                        style={{ width: `${progress}%` }}
                      >
                        <div className="absolute inset-0 bg-white/30 animate-shimmer"></div>
                      </div>
                    </div>
                    <div className="text-center mt-2">
                      <span className="text-sm font-bold text-gray-700">{progress}% Complete</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4 text-left max-w-md mx-auto">
                    <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl border-2 border-green-200 animate-fadeIn">
                      <span className="text-2xl">✓</span>
                      <span className="text-gray-900 font-bold">Uploading to secure servers</span>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl border-2 border-green-200 animate-fadeIn" style={{animationDelay: '200ms'}}>
                      <span className="text-2xl">✓</span>
                      <span className="text-gray-900 font-bold">Running 8 AI detection engines</span>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl border-2 border-blue-300 animate-fadeIn" style={{animationDelay: '400ms'}}>
                      <svg className="w-6 h-6 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="text-blue-900 font-black">Analyzing patterns & anomalies</span>
                    </div>
                  </div>
                </div>
              )}

              {result && (
                <div className="space-y-6 animate-fade-in">
                  {/* Batch Results */}
                  {result.batchResults ? (
                    <div>
                      <div className="p-6 bg-gradient-to-br from-blue-100 to-indigo-50 rounded-3xl border-2 border-blue-300 mb-6">
                        <h3 className="text-2xl font-black text-blue-900 mb-2">📦 Batch Analysis Complete</h3>
                        <p className="text-lg text-blue-700">Analyzed {result.batchResults.length} files</p>
                      </div>
                      
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {result.batchResults.map((item: any, idx: number) => (
                          <div key={idx} className={`p-4 rounded-xl border-2 ${
                            item.isDeepfake ? 'bg-red-50 border-red-300' : 'bg-green-50 border-green-300'
                          }`}>
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="font-bold text-gray-900">{item.filename}</div>
                              </div>
                              <div className={`px-4 py-2 rounded-full font-black ${
                                item.isDeepfake ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                              }`}>
                                {item.isDeepfake ? '🚨 FAKE' : '✅ REAL'} - {item.confidence.toFixed(1)}%
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                  <>
                  {/* Main Verdict */}
                  <div className={`p-8 rounded-3xl text-center border-4 shadow-2xl ${
                    result.isDeepfake 
                      ? 'bg-gradient-to-br from-red-100 to-red-50 border-red-500' 
                      : 'bg-gradient-to-br from-green-100 to-green-50 border-green-500'
                  }`}>
                    <div className="text-8xl mb-4 animate-scale-in">{result.isDeepfake ? '🚨' : '✅'}</div>
                    <div className={`text-4xl font-black mb-3 ${result.isDeepfake ? 'text-red-900' : 'text-green-900'}`}>
                      {result.isDeepfake ? 'DEEPFAKE DETECTED' : 'AUTHENTIC CONTENT'}
                    </div>
                    <div className="text-2xl font-bold text-gray-700">
                      Confidence: <span className="gradient-text">{result.confidence.toFixed(1)}%</span>
                    </div>
                  </div>

                  {/* Verification Details */}
                  {result.verification && (
                    <div className={`p-6 rounded-2xl border-2 ${
                      result.isDeepfake 
                        ? 'bg-red-50 border-red-300' 
                        : 'bg-green-50 border-green-300'
                    }`}>
                      <h3 className="text-xl font-black mb-4 flex items-center gap-2">
                        <span>{result.isDeepfake ? '🔍' : '✅'}</span>
                        <span className={result.isDeepfake ? 'text-red-900' : 'text-green-900'}>
                          {result.verification.verdict}
                        </span>
                      </h3>
                      
                      <div className="mb-4">
                        <h4 className="font-bold text-gray-900 mb-2">Why This Decision:</h4>
                        <ul className="space-y-1">
                          {result.verification.reasons.map((reason: string, idx: number) => (
                            <li key={idx} className="text-sm font-semibold text-gray-700">{reason}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="font-bold text-gray-900 mb-2">Technical Indicators Found:</h4>
                        <ul className="space-y-1">
                          {result.verification.technical_indicators.map((indicator: string, idx: number) => (
                            <li key={idx} className="text-xs text-gray-600">• {indicator}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className={`p-3 rounded-lg ${
                        result.isDeepfake ? 'bg-red-100' : 'bg-green-100'
                      }`}>
                        <p className={`text-sm font-bold ${
                          result.isDeepfake ? 'text-red-800' : 'text-green-800'
                        }`}>
                          📊 {result.verification.confidence_explanation}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Engine Results */}
                  <div>
                    <h3 className="text-xl font-black text-gray-900 mb-4">🤖 Detection Engines</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {result.engines.map((engine: any, idx: number) => (
                        <div key={idx} className="p-4 glass rounded-xl border border-gray-200 card-hover">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-gray-900 text-sm">{engine.name}</span>
                            <span className="text-xs px-2 py-1 bg-green-500 text-white rounded-full font-bold">
                              ✓
                            </span>
                          </div>
                          <div className="text-2xl font-black gradient-text">{engine.score.toFixed(1)}%</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="p-6 glass rounded-2xl border border-gray-200">
                    <h3 className="text-lg font-black text-gray-900 mb-3">📋 File Metadata</h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div><span className="text-gray-600">Duration:</span> <span className="font-bold">{result.metadata.duration}</span></div>
                      <div><span className="text-gray-600">Resolution:</span> <span className="font-bold">{result.metadata.resolution}</span></div>
                      <div><span className="text-gray-600">Codec:</span> <span className="font-bold">{result.metadata.codec}</span></div>
                      <div><span className="text-gray-600">FPS:</span> <span className="font-bold">{result.metadata.fps}</span></div>
                    </div>
                  </div>

                  {/* Threats */}
                  {result.threats && result.threats.length > 0 && (
                    <div className="p-6 bg-red-50 rounded-2xl border-2 border-red-300">
                      <h3 className="text-lg font-black text-red-900 mb-3">⚠️ Detected Threats</h3>
                      <ul className="space-y-2">
                        {result.threats.map((threat: string, idx: number) => (
                          <li key={idx} className="flex items-center gap-2 text-sm font-semibold text-red-800">
                            <span>•</span> {threat}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={downloadReport}
                      className="group relative overflow-hidden px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      <span className="relative flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Download Report
                      </span>
                    </button>
                    <button 
                      onClick={() => {
                        setFile(null);
                        setResult(null);
                        setProgress(0);
                      }}
                      className="group px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 font-black rounded-2xl shadow-lg hover:shadow-xl hover:border-blue-400 hover:text-blue-600 transition-all duration-300"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Analyze Another
                      </span>
                    </button>
                  </div>
                  </>
                  )}
                </div>
              )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
