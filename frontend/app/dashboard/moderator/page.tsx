'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ModeratorDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('review');
  const [incidents, setIncidents] = useState<any[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<any>(null);
  const [stats, setStats] = useState({
    pendingReviews: 0,
    reviewedToday: 3,
    flaggedContent: 0,
    totalIncidents: 0
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    const parsed = JSON.parse(userData);
    if (parsed.role !== 'moderator' && parsed.role !== 'analyst') {
      router.push('/dashboard');
      return;
    }
    setUser(parsed);
    loadModeratorData();
  }, [router]);

  const loadModeratorData = async () => {
    try {
      const response = await fetch('http://localhost:8001/api/v1/incidents');
      const data = await response.json();
      setIncidents(data.items || []);
      setStats({
        pendingReviews: (data.items || []).filter((i: any) => i.status === 'pending').length,
        reviewedToday: 3,
        flaggedContent: (data.items || []).filter((i: any) => i.severity === 'critical').length,
        totalIncidents: (data.items || []).length
      });
    } catch (error) {
      console.error('Failed to load moderator data:', error);
    }
  };

  const handleAction = async (incidentId: string, action: 'approve' | 'reject') => {
    console.log(`${action} incident:`, incidentId);
    await loadModeratorData();
  };

  if (!user) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Moderator Header */}
      <nav className="bg-purple-900/50 backdrop-blur-xl border-b border-purple-500/30 shadow-2xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg ring-2 ring-purple-400/50">
                🛡️
              </div>
              <div>
                <h1 className="text-2xl font-black text-white">Moderator Panel</h1>
                <p className="text-sm text-purple-300 font-semibold">Content Review & Moderation</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="px-4 py-2 text-purple-200 hover:text-white transition font-semibold">
                ← Back to Dashboard
              </Link>
              <div className="flex items-center gap-3 px-4 py-2 bg-purple-800/40 rounded-xl ring-1 ring-purple-400/50">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold shadow">
                  {user.username?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-bold text-white text-sm">{user.username}</div>
                  <div className="text-xs text-purple-300">MODERATOR</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        {/* Moderator Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-xl rounded-2xl p-6 border border-yellow-500/40 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="text-5xl">⏳</div>
              <div className="text-right">
                <div className="text-4xl font-black text-white">{stats.pendingReviews}</div>
                <div className="text-sm text-yellow-300 font-semibold">Pending Reviews</div>
              </div>
            </div>
            <div className="text-yellow-200 text-sm font-semibold">Action Required</div>
          </div>

          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-xl rounded-2xl p-6 border border-green-500/40 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="text-5xl">✅</div>
              <div className="text-right">
                <div className="text-4xl font-black text-white">{stats.reviewedToday}</div>
                <div className="text-sm text-green-300 font-semibold">Reviewed Today</div>
              </div>
            </div>
            <div className="text-green-200 text-sm font-semibold">Good Progress</div>
          </div>

          <div className="bg-gradient-to-br from-red-500/20 to-pink-500/20 backdrop-blur-xl rounded-2xl p-6 border border-red-500/40 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="text-5xl">🚩</div>
              <div className="text-right">
                <div className="text-4xl font-black text-white">{stats.flaggedContent}</div>
                <div className="text-sm text-red-300 font-semibold">Flagged Content</div>
              </div>
            </div>
            <div className="text-red-200 text-sm font-semibold">High Priority</div>
          </div>

          <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/40 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="text-5xl">📊</div>
              <div className="text-right">
                <div className="text-4xl font-black text-white">{stats.totalIncidents}</div>
                <div className="text-sm text-blue-300 font-semibold">Total Incidents</div>
              </div>
            </div>
            <div className="text-blue-200 text-sm font-semibold">All Time</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-black/30 p-2 rounded-2xl backdrop-blur-xl border border-purple-800/50">
          {[
            { key: 'review', label: 'Pending Review', icon: '⏳' },
            { key: 'incidents', label: 'All Incidents', icon: '📋' },
            { key: 'flagged', label: 'Flagged Items', icon: '🚩' },
            { key: 'history', label: 'Review History', icon: '📜' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 px-6 py-4 rounded-xl font-bold transition-all ${
                activeTab === tab.key
                  ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-xl ring-2 ring-purple-400/50'
                  : 'text-purple-200 hover:text-white hover:bg-purple-800/30'
              }`}
            >
              <span className="text-2xl mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* REVIEW TAB */}
        {activeTab === 'review' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-purple-800/50 shadow-2xl">
              <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                <span className="text-4xl">⏳</span>
                Items Awaiting Review
              </h3>
              
              {incidents.filter(i => i.status === 'pending').length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🎉</div>
                  <p className="text-white text-xl font-bold mb-2">All Caught Up!</p>
                  <p className="text-purple-300">No pending reviews at the moment</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {incidents.filter(i => i.status === 'pending').map((incident) => (
                    <button
                      key={incident.id}
                      onClick={() => setSelectedIncident(incident)}
                      className={`w-full text-left p-5 rounded-xl transition-all ${
                        selectedIncident?.id === incident.id
                          ? 'bg-purple-600/40 border-2 border-purple-400 ring-2 ring-purple-400/50'
                          : 'bg-purple-900/20 border border-purple-600/30 hover:bg-purple-800/30 hover:border-purple-500/50'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-white font-bold text-lg">{incident.title}</h4>
                        <span className={`px-3 py-1 rounded-lg font-bold text-xs ${
                          incident.severity === 'critical' ? 'bg-red-500/30 text-red-300 border border-red-500/50' :
                          incident.severity === 'high' ? 'bg-orange-500/30 text-orange-300 border border-orange-500/50' :
                          incident.severity === 'medium' ? 'bg-yellow-500/30 text-yellow-300 border border-yellow-500/50' :
                          'bg-blue-500/30 text-blue-300 border border-blue-500/50'
                        }`}>
                          {incident.severity.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-purple-200 text-sm line-clamp-2">{incident.description}</p>
                      <p className="text-purple-400 text-xs mt-2">ID: {incident.id.slice(0, 8)}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Review Details */}
            <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-purple-800/50 shadow-2xl">
              {selectedIncident ? (
                <div>
                  <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                    <span className="text-4xl">🔍</span>
                    Review Details
                  </h3>
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="text-purple-400 text-sm font-semibold">Title</label>
                      <p className="text-white text-lg font-bold">{selectedIncident.title}</p>
                    </div>
                    <div>
                      <label className="text-purple-400 text-sm font-semibold">Description</label>
                      <p className="text-purple-100">{selectedIncident.description}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-purple-400 text-sm font-semibold">Severity</label>
                        <p className="text-white font-bold">{selectedIncident.severity.toUpperCase()}</p>
                      </div>
                      <div>
                        <label className="text-purple-400 text-sm font-semibold">Status</label>
                        <p className="text-white font-bold">{selectedIncident.status.toUpperCase()}</p>
                      </div>
                    </div>
                    <div>
                      <label className="text-purple-400 text-sm font-semibold">Created</label>
                      <p className="text-white">{new Date(selectedIncident.created_at).toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleAction(selectedIncident.id, 'approve')}
                      className="flex-1 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold hover:shadow-xl transition-all hover:scale-105"
                    >
                      ✅ Approve
                    </button>
                    <button
                      onClick={() => handleAction(selectedIncident.id, 'reject')}
                      className="flex-1 px-6 py-4 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-xl transition-all hover:scale-105"
                    >
                      ❌ Reject
                    </button>
                  </div>
                  <button
                    onClick={() => setSelectedIncident(null)}
                    className="w-full mt-4 px-6 py-3 bg-purple-800/50 text-purple-200 rounded-xl font-bold hover:bg-purple-700/50 transition"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="text-6xl mb-4">👈</div>
                  <p className="text-white text-xl font-bold mb-2">Select an Item</p>
                  <p className="text-purple-300">Choose an item from the list to review</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* INCIDENTS TAB */}
        {activeTab === 'incidents' && (
          <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-purple-800/50 shadow-2xl">
            <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
              <span className="text-4xl">📋</span>
              All Incidents
            </h3>
            
            {incidents.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📭</div>
                <p className="text-white text-xl font-bold mb-2">No Incidents</p>
                <p className="text-purple-300">No incidents reported yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-purple-800">
                      <th className="text-left py-4 px-4 text-purple-400 font-semibold">Title</th>
                      <th className="text-left py-4 px-4 text-purple-400 font-semibold">Severity</th>
                      <th className="text-left py-4 px-4 text-purple-400 font-semibold">Status</th>
                      <th className="text-left py-4 px-4 text-purple-400 font-semibold">Created</th>
                      <th className="text-right py-4 px-4 text-purple-400 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {incidents.map((incident) => (
                      <tr key={incident.id} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                        <td className="py-4 px-4 text-white font-semibold">{incident.title}</td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-lg font-bold text-xs ${
                            incident.severity === 'critical' ? 'bg-red-500/30 text-red-300' :
                            incident.severity === 'high' ? 'bg-orange-500/30 text-orange-300' :
                            incident.severity === 'medium' ? 'bg-yellow-500/30 text-yellow-300' :
                            'bg-blue-500/30 text-blue-300'
                          }`}>
                            {incident.severity.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-lg font-bold text-xs ${
                            incident.status === 'resolved' ? 'bg-green-500/30 text-green-300' :
                            incident.status === 'escalated' ? 'bg-red-500/30 text-red-300' :
                            incident.status === 'reviewed' ? 'bg-blue-500/30 text-blue-300' :
                            'bg-yellow-500/30 text-yellow-300'
                          }`}>
                            {incident.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-purple-200 text-sm">
                          {new Date(incident.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-semibold">
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* FLAGGED TAB */}
        {activeTab === 'flagged' && (
          <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-purple-800/50 shadow-2xl">
            <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
              <span className="text-4xl">🚩</span>
              Flagged Content
            </h3>
            <div className="text-center py-12">
              <div className="text-6xl mb-4">✨</div>
              <p className="text-white text-xl font-bold mb-2">All Clear!</p>
              <p className="text-purple-300">No flagged content requiring attention</p>
            </div>
          </div>
        )}

        {/* HISTORY TAB */}
        {activeTab === 'history' && (
          <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-purple-800/50 shadow-2xl">
            <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
              <span className="text-4xl">📜</span>
              Review History
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-4 p-5 bg-green-900/20 rounded-xl border border-green-500/30">
                <span className="text-4xl">✅</span>
                <div className="flex-1">
                  <div className="text-white font-bold">Approved: Suspicious Audio File</div>
                  <div className="text-sm text-purple-300">Reviewed by {user.username} - 2 hours ago</div>
                </div>
                <span className="px-4 py-2 bg-green-500/30 text-green-300 rounded-lg font-bold">APPROVED</span>
              </div>
              <div className="flex items-center gap-4 p-5 bg-red-900/20 rounded-xl border border-red-500/30">
                <span className="text-4xl">❌</span>
                <div className="flex-1">
                  <div className="text-white font-bold">Rejected: Deepfake Video Detected</div>
                  <div className="text-sm text-purple-300">Reviewed by {user.username} - 5 hours ago</div>
                </div>
                <span className="px-4 py-2 bg-red-500/30 text-red-300 rounded-lg font-bold">REJECTED</span>
              </div>
              <div className="flex items-center gap-4 p-5 bg-green-900/20 rounded-xl border border-green-500/30">
                <span className="text-4xl">✅</span>
                <div className="flex-1">
                  <div className="text-white font-bold">Approved: Document Verification</div>
                  <div className="text-sm text-purple-300">Reviewed by {user.username} - Yesterday</div>
                </div>
                <span className="px-4 py-2 bg-green-500/30 text-green-300 rounded-lg font-bold">APPROVED</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
