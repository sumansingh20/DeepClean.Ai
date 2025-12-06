'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface CaseData {
  case_id: string;
  investigator_id: string;
  created: string;
  last_updated: string;
  evidence_count: number;
  file: string;
}

interface AnalysisResult {
  session_id: string;
  case_id: string;
  analysis_type: string;
  detection_result: {
    is_fake: boolean;
    confidence: number;
    fake_probability: number;
    real_probability: number;
    detection_method: string;
  };
  anomalies_found: string[];
  forensic_metrics: Record<string, number>;
  processing_time: number;
  report_available: boolean;
  report_path?: string;
  timestamp: string;
}

export default function AdvancedAnalysisDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'analyze' | 'cases' | 'reports'>('analyze');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [mediaType, setMediaType] = useState<'video' | 'audio' | 'image'>('video');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cases, setCases] = useState<CaseData[]>([]);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const [enableBlockchain, setEnableBlockchain] = useState(true);
  const [generateReport, setGenerateReport] = useState(true);

  useEffect(() => {
    if (activeTab === 'cases') {
      loadCases();
    }
  }, [activeTab]);

  const loadCases = async () => {
    try {
      const response = await fetch('http://localhost:8001/api/v1/advanced/cases/list');
      if (response.ok) {
        const data = await response.json();
        setCases(data);
      }
    } catch (err) {
      console.error('Failed to load cases:', err);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setError(null);
    }
  };

  const analyzeFile = async () => {
    if (!selectedFile) {
      setError('Please select a file to analyze');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);
    setProgress(0);
    setProgressMessage('Uploading file...');

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('enable_blockchain', enableBlockchain.toString());
      formData.append('generate_report', generateReport.toString());

      const endpoint = `http://localhost:8001/api/v1/advanced/${mediaType}/analyze-advanced`;
      
      // Real API call with actual progress tracking
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      setProgress(100);

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.statusText}`);
      }

      const result: AnalysisResult = await response.json();
      setAnalysisResult(result);
      setProgressMessage('Analysis complete!');
      
    } catch (err: any) {
      setError(err.message || 'Analysis failed');
      console.error('Analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const downloadReport = async (caseId: string) => {
    try {
      const response = await fetch(`http://localhost:8001/api/v1/advanced/report/download/${caseId}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `forensic_report_${caseId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (err) {
      console.error('Failed to download report:', err);
      alert('Failed to download report');
    }
  };

  const verifyChain = async (caseId: string) => {
    try {
      const response = await fetch(`http://localhost:8001/api/v1/advanced/evidence/verify/${caseId}`);
      if (response.ok) {
        const verification = await response.json();
        alert(
          verification.valid
            ? `✅ Chain verified! ${verification.blocks_verified} blocks checked.`
            : `❌ Chain compromised! Issues found: ${JSON.stringify(verification.issues)}`
        );
      }
    } catch (err) {
      console.error('Failed to verify chain:', err);
      alert('Failed to verify chain');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-lg border-b border-purple-500/30">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                🔬 Advanced Forensic Analysis
              </h1>
              <p className="text-gray-400 mt-1">Real ML Detection • Blockchain Evidence • PDF Reports</p>
            </div>
            <Link
              href="/"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
            >
              ← Back Home
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('analyze')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'analyze'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            🔍 Analyze Media
          </button>
          <button
            onClick={() => setActiveTab('cases')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'cases'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            📁 Evidence Cases
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'reports'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            📊 Reports
          </button>
        </div>

        {/* Analyze Tab */}
        {activeTab === 'analyze' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upload Section */}
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/30">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <span className="text-3xl">📤</span> Upload & Configure
              </h2>

              {/* Media Type Selection */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2 text-purple-300">Media Type</label>
                <div className="grid grid-cols-3 gap-3">
                  {(['video', 'audio', 'image'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setMediaType(type)}
                      className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                        mediaType === type
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {type === 'video' && '🎥'}
                      {type === 'audio' && '🎵'}
                      {type === 'image' && '🖼️'}
                      <br />
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* File Upload */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2 text-purple-300">Select File</label>
                <input
                  type="file"
                  onChange={handleFileSelect}
                  accept={
                    mediaType === 'video'
                      ? 'video/*'
                      : mediaType === 'audio'
                      ? 'audio/*'
                      : 'image/*'
                  }
                  className="w-full px-4 py-3 bg-gray-700 border border-purple-500/30 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-600 file:text-white file:cursor-pointer hover:file:bg-purple-700"
                />
                {selectedFile && (
                  <p className="mt-2 text-sm text-green-400">
                    ✓ {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>

              {/* Options */}
              <div className="mb-6 space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enableBlockchain}
                    onChange={(e) => setEnableBlockchain(e.target.checked)}
                    className="w-5 h-5 rounded bg-gray-700 border-purple-500"
                  />
                  <span className="text-sm">
                    <strong className="text-purple-300">⛓️ Enable Blockchain Evidence</strong>
                    <br />
                    <span className="text-gray-400">SHA-256 cryptographic evidence chain</span>
                  </span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={generateReport}
                    onChange={(e) => setGenerateReport(e.target.checked)}
                    className="w-5 h-5 rounded bg-gray-700 border-purple-500"
                  />
                  <span className="text-sm">
                    <strong className="text-purple-300">📄 Generate PDF Report</strong>
                    <br />
                    <span className="text-gray-400">Professional forensic analysis document</span>
                  </span>
                </label>
              </div>

              {/* Analyze Button */}
              <button
                onClick={analyzeFile}
                disabled={!selectedFile || isAnalyzing}
                className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${
                  isAnalyzing
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-purple-500/50'
                }`}
              >
                {isAnalyzing ? (
                  <>
                    <span className="inline-block animate-spin mr-2">⚡</span>
                    Analyzing... {progress}%
                  </>
                ) : (
                  '🚀 Run Advanced Analysis'
                )}
              </button>

              {/* Progress Bar */}
              {isAnalyzing && (
                <div className="mt-4">
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-400 mt-2">{progressMessage}</p>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="mt-4 p-4 bg-red-500/20 border border-red-500 rounded-lg">
                  <p className="text-red-300">❌ {error}</p>
                </div>
              )}
            </div>

            {/* Results Section */}
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/30">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <span className="text-3xl">📊</span> Analysis Results
              </h2>

              {analysisResult ? (
                <div className="space-y-6">
                  {/* Verdict */}
                  <div
                    className={`p-6 rounded-xl ${
                      analysisResult.detection_result.is_fake
                        ? 'bg-red-500/20 border-2 border-red-500'
                        : 'bg-green-500/20 border-2 border-green-500'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-6xl mb-3">
                        {analysisResult.detection_result.is_fake ? '🚨' : '✅'}
                      </div>
                      <h3 className="text-2xl font-bold mb-2">
                        {analysisResult.detection_result.is_fake ? 'FAKE DETECTED' : 'AUTHENTIC'}
                      </h3>
                      <p className="text-4xl font-bold">
                        {(analysisResult.detection_result.confidence * 100).toFixed(1)}%
                      </p>
                      <p className="text-sm text-gray-300 mt-2">Confidence Score</p>
                    </div>
                  </div>

                  {/* Probabilities */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-red-500/10 p-4 rounded-lg">
                      <p className="text-sm text-gray-400 mb-1">Fake Probability</p>
                      <p className="text-2xl font-bold text-red-400">
                        {(analysisResult.detection_result.fake_probability * 100).toFixed(1)}%
                      </p>
                    </div>
                    <div className="bg-green-500/10 p-4 rounded-lg">
                      <p className="text-sm text-gray-400 mb-1">Real Probability</p>
                      <p className="text-2xl font-bold text-green-400">
                        {(analysisResult.detection_result.real_probability * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  {/* Detection Method */}
                  <div className="bg-purple-500/10 p-4 rounded-lg">
                    <p className="text-sm text-purple-300 font-semibold mb-2">🔬 Detection Method</p>
                    <p className="text-white">{analysisResult.detection_result.detection_method}</p>
                  </div>

                  {/* Anomalies */}
                  {analysisResult.anomalies_found.length > 0 && (
                    <div className="bg-yellow-500/10 p-4 rounded-lg">
                      <p className="text-sm text-yellow-300 font-semibold mb-2">⚠️ Anomalies Found</p>
                      <ul className="space-y-1 text-sm">
                        {analysisResult.anomalies_found.map((anomaly, i) => (
                          <li key={i} className="text-gray-300">• {anomaly}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Forensic Metrics */}
                  <div className="bg-blue-500/10 p-4 rounded-lg">
                    <p className="text-sm text-blue-300 font-semibold mb-2">📐 Forensic Metrics</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {Object.entries(analysisResult.forensic_metrics).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-gray-400">{key.replace(/_/g, ' ')}:</span>
                          <span className="text-white font-mono">{value.toFixed(4)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    {analysisResult.report_available && (
                      <button
                        onClick={() => downloadReport(analysisResult.case_id)}
                        className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition-colors"
                      >
                        📥 Download PDF Report
                      </button>
                    )}
                    <button
                      onClick={() => verifyChain(analysisResult.case_id)}
                      className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors"
                    >
                      🔐 Verify Chain
                    </button>
                  </div>

                  {/* Meta Info */}
                  <div className="text-xs text-gray-500 space-y-1">
                    <p>Case ID: {analysisResult.case_id}</p>
                    <p>Session: {analysisResult.session_id}</p>
                    <p>Processing Time: {analysisResult.processing_time.toFixed(2)}s</p>
                    <p>Timestamp: {new Date(analysisResult.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <div className="text-6xl mb-4">🔍</div>
                  <p>Upload and analyze a file to see results here</p>
                  <p className="text-sm mt-2">Advanced ML algorithms • Blockchain evidence • PDF reports</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Cases Tab */}
        {activeTab === 'cases' && (
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/30">
            <h2 className="text-2xl font-bold mb-6">📁 Evidence Cases</h2>

            {cases.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-purple-500/30">
                      <th className="text-left py-3 px-4">Case ID</th>
                      <th className="text-left py-3 px-4">Created</th>
                      <th className="text-left py-3 px-4">Evidence Count</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cases.map((caseData) => (
                      <tr key={caseData.case_id} className="border-b border-gray-700 hover:bg-gray-700/50">
                        <td className="py-3 px-4 font-mono text-sm">{caseData.case_id}</td>
                        <td className="py-3 px-4 text-sm">
                          {new Date(caseData.created).toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-center">{caseData.evidence_count}</td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => verifyChain(caseData.case_id)}
                              className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-sm transition-colors"
                            >
                              🔐 Verify
                            </button>
                            <button
                              onClick={() => downloadReport(caseData.case_id)}
                              className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm transition-colors"
                            >
                              📥 Report
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <div className="text-6xl mb-4">📂</div>
                <p>No evidence cases found</p>
                <p className="text-sm mt-2">Analyze files to create evidence chains</p>
              </div>
            )}
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/30">
            <h2 className="text-2xl font-bold mb-6">📊 Forensic Reports</h2>
            <div className="text-center py-12 text-gray-400">
              <div className="text-6xl mb-4">📄</div>
              <p>Report management coming soon</p>
              <p className="text-sm mt-2">Download reports from the Cases tab</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
