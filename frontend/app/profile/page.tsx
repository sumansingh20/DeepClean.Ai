'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    totalAnalyses: 0,
    reportsGenerated: 0,
    apiCalls: 0,
    storageUsed: '0 MB'
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);

    // Load user statistics
    fetchUserStats();
  }, [router]);

  const fetchUserStats = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch user's sessions to calculate statistics
      const sessionsResponse = await fetch('http://localhost:8001/api/v1/sessions?limit=1000', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!sessionsResponse.ok) {
        throw new Error('Failed to fetch user statistics');
      }

      const sessionsData = await sessionsResponse.json();
      const totalAnalyses = sessionsData.total || 0;
      
      // Fetch user's incidents/reports
      const incidentsResponse = await fetch('http://localhost:8001/api/v1/incidents?limit=1000', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      let reportsGenerated = 0;
      if (incidentsResponse.ok) {
        const incidentsData = await incidentsResponse.json();
        reportsGenerated = incidentsData.total || 0;
      }

      // Calculate API calls (approximation: 5 API calls per analysis session)
      const apiCalls = totalAnalyses * 5;
      
      // Calculate storage (approximation: 50MB per session)
      const storageBytes = totalAnalyses * 50 * 1024 * 1024;
      const storageGB = (storageBytes / (1024 * 1024 * 1024)).toFixed(2);
      
      setStats({
        totalAnalyses,
        reportsGenerated,
        apiCalls,
        storageUsed: `${storageGB} GB`
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      // Fallback to default values on error
      setStats({
        totalAnalyses: 0,
        reportsGenerated: 0,
        apiCalls: 0,
        storageUsed: '0 GB'
      });
    }
  };

  if (!user) {
    return <div className="p-8">Loading...</div>;
  }

  const accountTier = user.role === 'admin' ? 'Enterprise' : user.role === 'moderator' ? 'Professional' : 'Free';
  const tierColors = {
    Enterprise: 'from-purple-600 to-pink-600',
    Professional: 'from-blue-600 to-cyan-600',
    Free: 'from-gray-600 to-gray-800'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition">
              <span className="text-2xl">←</span>
              <span className="font-bold">Back to Dashboard</span>
            </Link>
            <Link href="/settings" className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg transition">
              ⚙️ Settings
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white rounded-3xl shadow-2xl p-12 mb-8 border-2 border-gray-100">
            <div className="flex items-start gap-8">
              <div className={`w-32 h-32 bg-gradient-to-br ${tierColors[accountTier as keyof typeof tierColors]} rounded-3xl flex items-center justify-center text-white text-5xl font-black shadow-xl`}>
                {user.username?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-3">
                  <h1 className="text-4xl font-black text-gray-900">{user.username || user.email.split('@')[0]}</h1>
                  <span className={`px-4 py-1 bg-gradient-to-r ${tierColors[accountTier as keyof typeof tierColors]} text-white rounded-full text-sm font-bold`}>
                    {accountTier}
                  </span>
                </div>
                <p className="text-xl text-gray-600 mb-6">{user.email}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <div className="text-3xl font-black text-blue-600">{stats.totalAnalyses}</div>
                    <div className="text-sm text-gray-600">Total Analyses</div>
                  </div>
                  <div>
                    <div className="text-3xl font-black text-purple-600">{stats.reportsGenerated}</div>
                    <div className="text-sm text-gray-600">Reports Generated</div>
                  </div>
                  <div>
                    <div className="text-3xl font-black text-green-600">{stats.apiCalls}</div>
                    <div className="text-sm text-gray-600">API Calls</div>
                  </div>
                  <div>
                    <div className="text-3xl font-black text-orange-600">{stats.storageUsed}</div>
                    <div className="text-sm text-gray-600">Storage Used</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Link href="/settings" className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition border-2 border-blue-200 hover:border-blue-400 group">
              <div className="text-5xl mb-4">⚙️</div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">Settings</h3>
              <p className="text-gray-600">Update profile, security, and preferences</p>
            </Link>
            <Link href="/reports" className="bg-gradient-to-br from-purple-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition border-2 border-purple-200 hover:border-purple-400 group">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">My Reports</h3>
              <p className="text-gray-600">View and download all your reports</p>
            </Link>
            <Link href="/api-docs" className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition border-2 border-green-200 hover:border-green-400 group">
              <div className="text-5xl mb-4">🔑</div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">API Keys</h3>
              <p className="text-gray-600">Manage your API access keys</p>
            </Link>
          </div>

          {/* Account Information */}
          <div className="bg-white rounded-3xl shadow-2xl p-12 border-2 border-gray-100">
            <h2 className="text-3xl font-black text-gray-900 mb-8">Account Information</h2>
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-6 border-b border-gray-200">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Email Address</div>
                  <div className="text-lg font-bold text-gray-900">{user.email}</div>
                </div>
                <Link href="/settings" className="text-blue-600 hover:text-purple-600 font-bold">Edit →</Link>
              </div>
              <div className="flex justify-between items-center pb-6 border-b border-gray-200">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Organization</div>
                  <div className="text-lg font-bold text-gray-900">{user.organization || 'Not specified'}</div>
                </div>
                <Link href="/settings" className="text-blue-600 hover:text-purple-600 font-bold">Edit →</Link>
              </div>
              <div className="flex justify-between items-center pb-6 border-b border-gray-200">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Account Type</div>
                  <div className="text-lg font-bold text-gray-900">{accountTier}</div>
                </div>
                <Link href="/pricing" className="text-blue-600 hover:text-purple-600 font-bold">Upgrade →</Link>
              </div>
              <div className="flex justify-between items-center pb-6 border-b border-gray-200">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Member Since</div>
                  <div className="text-lg font-bold text-gray-900">{new Date(user.created_at || Date.now()).toLocaleDateString('en-IN')}</div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Two-Factor Authentication</div>
                  <div className="text-lg font-bold text-gray-900">{user.two_factor_enabled ? '✅ Enabled' : '❌ Disabled'}</div>
                </div>
                <Link href="/settings" className="text-blue-600 hover:text-purple-600 font-bold">Configure →</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
