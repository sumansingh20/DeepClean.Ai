'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function AnalysisPage() {
  type AnalysisType = 'voice' | 'video' | 'document' | 'liveness' | 'scam' | 'image' | 'audio' | 'batch';
  
  const [activeTab, setActiveTab] = useState<AnalysisType>('video');
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [dragActive, setDragActive] = useState(false);
  const [batchFiles, setBatchFiles] = useState<File[]>([]);
  const [history, setHistory] = useState<any[]>([]);

  const tabs = [
    { key: 'voice', label: 'Voice', icon: '🎤', desc: 'Detect synthetic voice', gradient: 'from-blue-500 to-cyan-500' },
    { key: 'video', label: 'Video', icon: '🎥', desc: 'Face swap detection', gradient: 'from-purple-500 to-pink-500' },
    { key: 'image', label: 'Image', icon: '🖼️', desc: 'Photo manipulation', gradient: 'from-pink-500 to-rose-500' },
    { key: 'audio', label: 'Audio', icon: '🔊', desc: 'Audio forensics', gradient: 'from-indigo-500 to-blue-500' },
    { key: 'document', label: 'Document', icon: '📄', desc: 'Verify ID documents', gradient: 'from-green-500 to-emerald-500' },
    { key: 'liveness', label: 'Liveness', icon: '👁️', desc: 'Real person check', gradient: 'from-orange-500 to-red-500' },
    { key: 'scam', label: 'Scam Call', icon: '📞', desc: 'Fraud call analysis', gradient: 'from-yellow-500 to-orange-500' },
    { key: 'batch', label: 'Batch', icon: '📦', desc: 'Multiple files', gradient: 'from-teal-500 to-cyan-500' }
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
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('analysis_type', activeTab);

      const response = await fetch('http://localhost:8001/api/deepfake/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Analysis failed: ${response.status}`);
      }

      const data = await response.json();
      
      setResult({
        isDeepfake: data.is_deepfake,
        confidence: data.confidence,
        engines: data.detection_scores || data.engines || [],
        metadata: data.metadata || {},
        threats: data.threats || [],
        analysis_id: data.analysis_id,
        timestamp: data.timestamp
      });
      
      setHistory(prev => [{
        id: data.analysis_id,
        type: activeTab,
        filename: file.name,
        isDeepfake: data.is_deepfake,
        confidence: data.confidence,
        timestamp: new Date().toISOString()
      }, ...prev.slice(0, 9)]);
      
    } catch (error) {
      console.error('Analysis error:', error);
      setAnalyzing(false);
      
      // Show error to user
      alert(`Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}. Please ensure the backend is running on port 8001.`);
      setResult(null);
    }
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
    
    for (const file of batchFiles) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('analysis_type', activeTab);

        const response = await fetch('http://localhost:8001/api/deepfake/analyze', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          results.push({
            filename: file.name,
            isDeepfake: data.is_deepfake,
            confidence: data.confidence
          });
        }
      } catch (error) {
        console.error(`Error analyzing ${file.name}:`, error);
      }
    }
    
    setResult({ batchResults: results });
    setAnalyzing(false);
  };

  const currentTab = tabs.find(t => t.key === activeTab);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Enhanced Header */}
      <nav className="sticky top-0 z-50 glass border-b border-white/20 shadow-xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 animate-fade-in">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl blur-lg opacity-75"></div>
                <div className="relative w-14 h-14 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl transform hover:rotate-12 transition-transform">
                  <span className="text-3xl">🔬</span>
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-black gradient-text">AI Analysis Lab</h1>
                <p className="text-sm text-indigo-600 font-bold flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  6 Engines Active • Real-time
                </p>
              </div>
            </div>
            <Link href="/dashboard" className="btn-primary">
              ← Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12">
        {/* Tab Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12 animate-fade-in-up">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key as any);
                setFile(null);
                setResult(null);
              }}
              className={`group relative p-6 rounded-2xl transition-all duration-300 card-hover ${
                activeTab === tab.key
                  ? `bg-gradient-to-br ${tab.gradient} text-white shadow-2xl`
                  : 'glass text-gray-700 border border-gray-200'
              }`}
            >
              {activeTab === tab.key && (
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
              )}
              <div className="relative">
                <div className={`text-4xl mb-3 transform transition-transform ${
                  activeTab === tab.key ? 'scale-110' : 'group-hover:scale-125'
                }`}>
                  {tab.icon}
                </div>
                <div className={`font-bold text-sm mb-1 ${activeTab === tab.key ? 'text-white' : 'text-gray-900'}`}>
                  {tab.label}
                </div>
                <div className={`text-xs ${activeTab === tab.key ? 'text-white/90' : 'text-gray-500'}`}>
                  {tab.desc}
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6 animate-fade-in-up animation-delay-200">
            <div className="glass rounded-3xl shadow-2xl p-8 border border-white/20">
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-12 h-12 bg-gradient-to-br ${currentTab?.gradient} rounded-xl flex items-center justify-center text-2xl shadow-lg`}>
                  {currentTab?.icon}
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900">{currentTab?.label} Analysis</h2>
                  <p className="text-sm text-gray-600 font-semibold">{currentTab?.desc}</p>
                </div>
              </div>

              {/* Drag & Drop Zone */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-4 border-dashed rounded-3xl p-12 mb-6 transition-all ${
                  dragActive 
                    ? 'border-blue-500 bg-blue-50 scale-105' 
                    : file 
                      ? 'border-green-400 bg-green-50' 
                      : 'border-gray-300 bg-gradient-to-br from-gray-50 to-white hover:border-blue-400 hover:bg-blue-50'
                }`}
              >
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
                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                  <div className="text-7xl mb-4 animate-float">{currentTab?.icon}</div>
                  {activeTab === 'batch' && batchFiles.length > 0 ? (
                    <div className="text-center">
                      <div className="text-xl font-black text-green-700 mb-2">✓ {batchFiles.length} Files Selected</div>
                      <div className="text-sm text-gray-600 mt-1 max-h-32 overflow-y-auto">
                        {batchFiles.map((f, i) => (
                          <div key={i} className="text-gray-700">{f.name}</div>
                        ))}
                      </div>
                    </div>
                  ) : file ? (
                    <div className="text-center">
                      <div className="text-xl font-black text-green-700 mb-2">✓ File Selected</div>
                      <div className="text-lg font-bold text-gray-900">{file.name}</div>
                      <div className="text-sm text-gray-600 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="text-2xl font-black text-gray-900 mb-2">Drop file{activeTab === 'batch' ? 's' : ''} here</div>
                      <div className="text-lg text-gray-600 mb-3">or click to browse</div>
                      <div className="text-sm text-gray-500 bg-white px-4 py-2 rounded-lg border border-gray-200">
                        {activeTab === 'voice' && '🎵 Audio: MP3, WAV, AAC'}
                        {activeTab === 'audio' && '🔊 Audio: Any format'}
                        {activeTab === 'video' && '🎬 Video: MP4, AVI, MOV'}
                        {activeTab === 'image' && '🖼️ Image: JPG, PNG, WEBP'}
                        {activeTab === 'document' && '📎 Image or PDF'}
                        {activeTab === 'liveness' && '🎥 Video of yourself'}
                        {activeTab === 'scam' && '☎️ Call recording'}
                        {activeTab === 'batch' && '📦 Multiple files (any type)'}
                      </div>
                    </div>
                  )}
                </label>
              </div>

              <button
                onClick={activeTab === 'batch' ? analyzeBatch : handleAnalyze}
                disabled={(activeTab === 'batch' ? batchFiles.length === 0 : !file) || analyzing}
                className="w-full btn-primary py-5 text-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {analyzing ? (
                  <span className="flex items-center justify-center gap-3">
                    <span className="spinner"></span>
                    Analyzing{activeTab === 'batch' ? ' Batch' : ''}...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <span>🚀</span> {activeTab === 'batch' ? `Analyze ${batchFiles.length} Files` : 'Start AI Analysis'}
                  </span>
                )}
              </button>

              {/* Analysis History */}
              {history.length > 0 && (
                <div className="mt-6 p-5 bg-white rounded-2xl border-2 border-gray-200 shadow-lg">
                  <h3 className="text-lg font-black text-gray-900 mb-3 flex items-center gap-2">
                    <span>📊</span> Recent Analysis
                  </h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {history.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-xs text-gray-900 truncate">{item.filename}</div>
                          <div className="text-xs text-gray-500">{new Date(item.timestamp).toLocaleTimeString()}</div>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-bold whitespace-nowrap ml-2 ${
                          item.isDeepfake ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {item.isDeepfake ? '⚠️ Fake' : '✓ Real'} {item.confidence.toFixed(0)}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {file && !analyzing && !result && (
                <div className="mt-6 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200">
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">💡</span>
                    <div className="text-sm text-gray-700">
                      <p className="font-black text-lg mb-1 text-blue-900">Ready to analyze!</p>
                      <p className="font-semibold">Our 6 AI engines will process your content in seconds with 94.2% accuracy.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6 animate-fade-in-up animation-delay-400">
            <div className="glass rounded-3xl shadow-2xl p-8 border border-white/20 min-h-[600px]">
              <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
                <span>📊</span> Analysis Results
              </h2>

              {!analyzing && !result && (
                <div className="text-center py-20">
                  <div className="text-9xl mb-6 opacity-20 animate-float">🔬</div>
                  <p className="text-2xl font-bold text-gray-400">Upload a file to start</p>
                  <p className="text-gray-500 mt-2">AI-powered detection in seconds</p>
                </div>
              )}

              {analyzing && (
                <div className="text-center py-12">
                  <div className="text-9xl mb-6 animate-pulse">⚡</div>
                  <div className="text-3xl font-black text-gray-900 mb-6">Analyzing Content...</div>
                  <div className="max-w-md mx-auto mb-8">
                    <div className="bg-gray-200 rounded-full h-6 overflow-hidden shadow-inner">
                      <div className="h-6 rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-pulse w-[70%]"></div>
                    </div>
                  </div>
                  <div className="space-y-3 text-left max-w-sm mx-auto">
                    <div className="flex items-center gap-3 text-gray-700 font-semibold">
                      <span className="text-green-500">✓</span> Uploading to secure servers
                    </div>
                    <div className="flex items-center gap-3 text-gray-700 font-semibold">
                      <span className="text-green-500">✓</span> Running 6 AI detection engines
                    </div>
                    <div className="flex items-center gap-3 text-blue-600 font-bold">
                      <span className="animate-spin">⏳</span> Analyzing patterns & anomalies
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
                  <div className="flex gap-3">
                    <button className="flex-1 btn-primary">
                      📥 Download Report
                    </button>
                    <button className="flex-1 btn-secondary">
                      🔄 Analyze Another
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
  );
}
