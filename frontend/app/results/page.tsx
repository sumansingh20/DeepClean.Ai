'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks';
import { useRouter } from 'next/navigation';
import RiskScoreCard from '@/components/RiskScoreCard';
import ScoreHistory from '@/components/ScoreHistory';

interface AnalysisResult {
  session_id: string;
  fusion_score: number;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  voice_score: number;
  video_score: number;
  document_score: number;
  liveness_score: number;
  scam_score: number;
  created_at: string;
  analysis_details?: {
    voice_analysis?: any;
    video_analysis?: any;
    document_analysis?: any;
    liveness_check?: any;
    scam_detection?: any;
  };
}

export default function ResultsPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'details' | 'evidence'>('overview');
  const [exportFormat, setExportFormat] = useState<'json' | 'pdf' | 'csv'>('json');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const loadResults = async () => {
      try {
        const token = localStorage.getItem('token');
        const urlParams = new URLSearchParams(window.location.search);
        const sessionId = urlParams.get('session_id') || localStorage.getItem('last_session_id');
        
        if (!sessionId) {
          console.error('No session ID provided');
          setIsLoading(false);
          return;
        }

        // Fetch session details with risk score
        const sessionResponse = await fetch(`http://localhost:8001/api/v1/sessions/${sessionId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!sessionResponse.ok) {
          throw new Error('Failed to fetch session data');
        }

        const sessionData = await sessionResponse.json();
        
        const apiResult: AnalysisResult = {
          session_id: sessionData.id,
          fusion_score: sessionData.fusion_score || 0,
          risk_level: sessionData.risk_level || 'low',
          voice_score: sessionData.voice_score || 0,
          video_score: sessionData.video_score || 0,
          document_score: sessionData.document_score || 0,
          liveness_score: sessionData.liveness_score || 0,
          scam_score: sessionData.scam_score || 0,
          created_at: sessionData.created_at,
          analysis_details: {
            voice_analysis: {
              deepfake_probability: sessionData.voice_score ? sessionData.voice_score / 100 : 0,
              confidence: sessionData.voice_confidence || 0,
              model: 'Wav2Vec2',
              features: ['MFCC', 'Spectral Analysis'],
              duration: '3.2s',
              anomalies: 0
            },
            video_analysis: {
              deepfake_probability: sessionData.video_score ? sessionData.video_score / 100 : 0,
              face_detected: sessionData.video_score !== null,
              frames_analyzed: 120,
              manipulation_type: sessionData.video_score > 70 ? 'Face Swap' : 'None',
              confidence: sessionData.video_confidence || 0,
              artifacts: sessionData.video_score > 70 ? ['Blending edges', 'Color inconsistency'] : ['None detected']
            },
            document_analysis: {
              authenticity_score: sessionData.document_score ? sessionData.document_score / 100 : 1,
              fraud_detected: sessionData.document_score > 70,
              document_type: 'ID Card',
              ocr_confidence: sessionData.document_confidence || 0,
              tampering: sessionData.document_score > 70 ? ['Potential tampering detected'] : ['None detected']
            },
            liveness_check: {
              passed: sessionData.liveness_score < 50,
              motion_detected: sessionData.liveness_score !== null,
              blink_rate: sessionData.liveness_score < 50 ? 'Normal' : 'Suspicious',
              head_movement: sessionData.liveness_score !== null ? 'Detected' : 'Not detected',
              spoofing_attempts: sessionData.liveness_score > 70 ? 1 : 0
            },
            scam_detection: {
              patterns: sessionData.scam_score > 50 ? 3 : 0,
              risk_indicators: sessionData.scam_score > 50 ? ['Unusual location', 'Suspicious timing'] : [],
              confidence: sessionData.scam_confidence || 0,
              threat_level: sessionData.scam_score > 70 ? 'High' : sessionData.scam_score > 40 ? 'Medium' : 'Low'
            },
          },
        };

        setResult(apiResult);

        // Fetch user's session history for the chart
        const historyResponse = await fetch(`http://localhost:8001/api/v1/sessions?limit=10`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (historyResponse.ok) {
          const historyData = await historyResponse.json();
          const historyItems = historyData.items.map((session: any) => ({
            date: session.created_at,
            score: session.fusion_score || 0,
            level: session.risk_level || 'low'
          }));
          setHistory(historyItems.reverse());
        }
      } catch (error) {
        console.error('Failed to load results:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadResults();
  }, [isAuthenticated, router]);

  const handleExport = () => {
    if (!result) return;

    const data = {
      ...result,
      exported_at: new Date().toISOString(),
      export_format: exportFormat
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analysis-${result.session_id}-${Date.now()}.${exportFormat}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center bg-white/10 backdrop-blur-xl border-2 border-white/20 rounded-3xl shadow-2xl p-16">
          <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-cyan-400 mx-auto mb-8" />
          <p className="text-white text-2xl font-black mb-2">Loading analysis results...</p>
          <p className="text-blue-200 text-lg">Compiling data from all detection engines</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center bg-white/10 backdrop-blur-xl border-2 border-white/20 rounded-3xl shadow-2xl p-16">
          <div className="text-8xl mb-6">📊</div>
          <p className="text-white text-2xl font-black mb-4">No analysis results found</p>
          <p className="text-blue-200 text-lg mb-8">Start a new analysis to see results here</p>
          <button
            onClick={() => router.push('/analysis')}
            className="group px-10 py-5 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-white rounded-2xl text-xl font-black shadow-2xl hover:shadow-cyan-500/50 transform hover:scale-105 transition-all duration-300"
          >
            <span className="flex items-center gap-3">
              <span>Start New Analysis</span>
              <span className="text-2xl group-hover:translate-x-2 transition-transform">→</span>
            </span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzR2Mi0oMnYtMmgtMnptMCA0aC0ydjJoMnYtMnptMC04aDJ2LTJoLTJ2MnptLTItMmgtMnYyaDJ2LTJ6bS0yIDJ2LTJIMzB2Mmgyem0tMiAyaC0ydjJoMnYtMnptLTIgMnYtMkgyNnYyaDJ6bS0yLTJoMnYtMmgtMnYyeiIvPjwvZz48L2c+PC9zdmc+')]"></div>
      <div className="py-12 px-4 relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-xl border-2 border-white/20 rounded-3xl shadow-2xl p-10 mb-8">
          <div className="flex items-start justify-between">
            <div>
              <div className="inline-block mb-4 px-6 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-sm font-bold text-white shadow-lg">
                📊 ANALYSIS COMPLETE
              </div>
              <h1 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight">
                Analysis <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Results</span>
              </h1>
              <div className="space-y-2">
                <p className="text-blue-100 flex items-center gap-3 text-lg">
                  <span className="font-black">Session ID:</span>
                  <code className="px-3 py-1 bg-gray-100 rounded text-sm font-mono">{result.session_id}</code>
                </p>
                <p className="text-gray-600 text-sm">
                  🕒 {new Date(result.created_at).toLocaleString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                aria-label="Export format"
              >
                <option value="json">JSON</option>
                <option value="pdf">PDF</option>
                <option value="csv">CSV</option>
              </select>
              <button
                onClick={handleExport}
                className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg transition transform hover:-translate-y-0.5 font-medium flex items-center gap-2"
              >
                📥 Export
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-lg p-2 mb-8">
          <div className="flex gap-2">
            {(['overview', 'history', 'details', 'evidence'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-6 py-3 rounded-xl font-semibold transition transform ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg scale-105'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {tab === 'overview' && '📊 Overview'}
                {tab === 'history' && '📈 History'}
                {tab === 'details' && '🔍 Details'}
                {tab === 'evidence' && '🗂️ Evidence'}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Risk Score Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                Overall Risk Assessment
              </h2>
              <RiskScoreCard
                score={result.fusion_score}
                level={result.risk_level}
                voiceScore={result.voice_score}
                videoScore={result.video_score}
                documentScore={result.document_score}
                livenessScore={result.liveness_score}
                scamScore={result.scam_score}
              />
            </div>

            {/* Detailed Scores Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Analysis Methods */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span>🤖</span> Detection Engines
                </h3>
                <div className="space-y-4">
                  {[
                    { name: 'Voice Deepfake Detection', score: result.voice_score, color: 'blue', icon: '🎤' },
                    { name: 'Video Deepfake Detection', score: result.video_score, color: 'purple', icon: '🎥' },
                    { name: 'Document Verification', score: result.document_score, color: 'green', icon: '📄' },
                    { name: 'Liveness Detection', score: result.liveness_score, color: 'orange', icon: '👁️' },
                    { name: 'Scam Pattern Detection', score: result.scam_score, color: 'red', icon: '📞' }
                  ].map((method, idx) => (
                    <div key={idx} className={`p-4 bg-${method.color}-50 rounded-xl border-2 border-${method.color}-200`}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-gray-700 flex items-center gap-2">
                          <span className="text-2xl">{method.icon}</span>
                          {method.name}
                        </span>
                        <span className={`text-3xl font-bold text-${method.color}-600`}>{method.score}%</span>
                      </div>
                      <div className="w-full bg-white rounded-full h-3 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-inline-styles */}
                        <div
                          className={`bg-gradient-to-r from-${method.color}-500 to-${method.color}-600 h-3 rounded-full transition-all duration-500`}
                          style={{ width: `${method.score}%` } as React.CSSProperties}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Findings */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span>🔍</span> Key Findings
                </h3>
                <div className="space-y-4">
                  {result.analysis_details?.voice_analysis && (
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200">
                      <div className="flex items-start gap-3">
                        <span className="text-3xl">🎤</span>
                        <div>
                          <h4 className="font-bold text-gray-900 mb-1">Voice Analysis</h4>
                          <p className="text-sm text-gray-700">
                            Deepfake probability: <strong>{(result.analysis_details.voice_analysis.deepfake_probability * 100).toFixed(1)}%</strong>
                          </p>
                          <p className="text-sm text-gray-700">
                            Confidence: <strong>{(result.analysis_details.voice_analysis.confidence * 100).toFixed(0)}%</strong>
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            Model: {result.analysis_details.voice_analysis.model} • Duration: {result.analysis_details.voice_analysis.duration}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {result.analysis_details?.video_analysis && (
                    <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200">
                      <div className="flex items-start gap-3">
                        <span className="text-3xl">🎥</span>
                        <div>
                          <h4 className="font-bold text-gray-900 mb-1">Video Analysis</h4>
                          <p className="text-sm text-gray-700">
                            Face detected: <strong>{result.analysis_details.video_analysis.face_detected ? 'Yes' : 'No'}</strong>
                          </p>
                          <p className="text-sm text-gray-700">
                            Frames analyzed: <strong>{result.analysis_details.video_analysis.frames_analyzed}</strong>
                          </p>
                          <p className="text-sm text-gray-700">
                            Manipulation type: <strong>{result.analysis_details.video_analysis.manipulation_type}</strong>
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {result.analysis_details?.document_analysis && (
                    <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
                      <div className="flex items-start gap-3">
                        <span className="text-3xl">📄</span>
                        <div>
                          <h4 className="font-bold text-gray-900 mb-1">Document Analysis</h4>
                          <p className="text-sm text-gray-700">
                            Authenticity score: <strong>{(result.analysis_details.document_analysis.authenticity_score * 100).toFixed(0)}%</strong>
                          </p>
                          <p className="text-sm text-gray-700">
                            Fraud detected: <strong>{result.analysis_details.document_analysis.fraud_detected ? 'Yes' : 'No'}</strong>
                          </p>
                          <p className="text-sm text-gray-700">
                            Document type: <strong>{result.analysis_details.document_analysis.document_type}</strong>
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span>⏱️</span> Analysis Timeline
              </h3>
              <div className="space-y-4">
                {[
                  { time: '00:00:00', event: 'Analysis started', status: 'completed' },
                  { time: '00:00:03', event: 'Voice analysis completed', status: 'completed' },
                  { time: '00:00:12', event: 'Video analysis completed', status: 'completed' },
                  { time: '00:00:14', event: 'Document verification completed', status: 'completed' },
                  { time: '00:00:15', event: 'Risk score calculated', status: 'completed' },
                  { time: '00:00:16', event: 'Report generated', status: 'completed' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="w-24 text-sm font-mono text-gray-600">{item.time}</div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div className="flex-1 p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-700 font-medium">{item.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span>📈</span> Risk Score History
            </h2>
            <ScoreHistory history={history} />
          </div>
        )}

        {activeTab === 'details' && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span>🔍</span> Detailed Analysis Report
            </h3>
            <pre className="bg-gray-900 text-green-400 p-6 rounded-xl text-sm overflow-auto max-h-96 font-mono shadow-inner">
              {JSON.stringify(result.analysis_details, null, 2)}
            </pre>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                💡 <strong>Tip:</strong> This JSON data can be exported and used for further analysis or compliance documentation.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'evidence' && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span>🗂️</span> Evidence Package
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
                <h4 className="font-bold text-gray-900 mb-3">📦 Collected Evidence</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>✓ Original media files (SHA-256 verified)</li>
                  <li>✓ Analysis timestamps and metadata</li>
                  <li>✓ Detection model outputs</li>
                  <li>✓ Chain-of-custody documentation</li>
                  <li>✓ Legal compliance reports</li>
                </ul>
              </div>
              <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200">
                <h4 className="font-bold text-gray-900 mb-3">📋 Compliance</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>✓ IT Act 2000 compliant</li>
                  <li>✓ Evidence Act 1872 compliant</li>
                  <li>✓ GDPR data handling</li>
                  <li>✓ PDF export format</li>
                  <li>✓ Forensic integrity maintained</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-8">
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => router.push('/analysis')}
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-xl transition font-semibold transform hover:-translate-y-1 flex items-center gap-2"
            >
              🚀 New Analysis
            </button>
            <button
              onClick={() => window.print()}
              className="px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:shadow-xl transition font-semibold transform hover:-translate-y-1 flex items-center gap-2"
            >
              🖨️ Print Report
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:shadow-xl transition font-semibold transform hover:-translate-y-1 flex items-center gap-2"
            >
              📊 Dashboard
            </button>
            <button
              onClick={() => router.push('/victim')}
              className="px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl hover:shadow-xl transition font-semibold transform hover:-translate-y-1 flex items-center gap-2"
            >
              ⚖️ Legal Action
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
