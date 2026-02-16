'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [systemStats, setSystemStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalSessions: 0,
    storageUsed: '0 MB',
    apiCalls: 0,
    uptime: '99.9%'
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    const parsed = JSON.parse(userData);
    if (parsed.role !== 'admin') {
      router.push('/dashboard');
      return;
    }
    setUser(parsed);
    loadAdminData();
  }, [router]);

  const loadAdminData = async () => {
    try {
      const response = await fetch('http://localhost:8001/api/v1/dashboard/stats');
      const data = await response.json();
      setSystemStats({
        totalUsers: 2,
        activeUsers: 1,
        totalSessions: data.totalSessions || 0,
        storageUsed: '145 MB',
        apiCalls: data.totalAnalyses || 0,
        uptime: '99.9%'
      });
    } catch (error) {
      console.error('Failed to load admin data:', error);
    }
  };

  if (!user) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      {/* Admin Header */}
      <nav className="bg-black/50 backdrop-blur-xl border-b border-red-900/30 shadow-2xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-orange-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg ring-2 ring-red-500/50">
                ⚡
              </div>
              <div>
                <h1 className="text-2xl font-black text-white">Admin Control Center</h1>
                <p className="text-sm text-red-400 font-semibold">Full System Access</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="px-4 py-2 text-gray-400 hover:text-white transition font-semibold">
                ← Back to Dashboard
              </Link>
              <div className="flex items-center gap-3 px-4 py-2 bg-red-900/30 rounded-xl ring-1 ring-red-500/50">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold shadow">
                  {user.username?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-bold text-white text-sm">{user.username}</div>
                  <div className="text-xs text-red-400">ADMIN</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        {/* Admin Tabs */}
        <div className="flex gap-2 mb-8 bg-black/30 p-2 rounded-2xl backdrop-blur-xl border border-gray-800">
          {[
            { key: 'overview', label: 'System Overview', icon: '📊' },
            { key: 'users', label: 'User Management', icon: '👥' },
            { key: 'security', label: 'Security & Logs', icon: '🔐' },
            { key: 'settings', label: 'Configuration', icon: '⚙️' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 px-6 py-4 rounded-xl font-bold transition-all ${
                activeTab === tab.key
                  ? 'bg-gradient-to-br from-red-600 to-orange-600 text-white shadow-xl ring-2 ring-red-500/50'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              <span className="text-2xl mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* System Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 rounded-2xl p-6 border border-blue-500/30 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-5xl">👥</div>
                  <div className="text-right">
                    <div className="text-4xl font-black text-white">{systemStats.totalUsers}</div>
                    <div className="text-sm text-blue-400 font-semibold">Total Users</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-green-400 text-sm font-semibold">
                  <span>↗</span>
                  <span>{systemStats.activeUsers} Active Now</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 rounded-2xl p-6 border border-purple-500/30 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-5xl">🔄</div>
                  <div className="text-right">
                    <div className="text-4xl font-black text-white">{systemStats.totalSessions}</div>
                    <div className="text-sm text-purple-400 font-semibold">Total Sessions</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-green-400 text-sm font-semibold">
                  <span>✓</span>
                  <span>All Processing</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-900/30 to-orange-800/20 rounded-2xl p-6 border border-orange-500/30 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-5xl">📡</div>
                  <div className="text-right">
                    <div className="text-4xl font-black text-white">{systemStats.apiCalls}</div>
                    <div className="text-sm text-orange-400 font-semibold">API Calls</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-green-400 text-sm font-semibold">
                  <span>⚡</span>
                  <span>High Performance</span>
                </div>
              </div>
            </div>

            {/* System Health */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-gray-800 shadow-2xl">
                <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                  <span className="text-4xl">💚</span>
                  System Health
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-900/20 rounded-xl border border-green-500/30">
                    <span className="text-white font-semibold">API Status</span>
                    <span className="px-4 py-2 bg-green-500 text-white rounded-lg font-bold">ONLINE</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-green-900/20 rounded-xl border border-green-500/30">
                    <span className="text-white font-semibold">Database</span>
                    <span className="px-4 py-2 bg-green-500 text-white rounded-lg font-bold">HEALTHY</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-green-900/20 rounded-xl border border-green-500/30">
                    <span className="text-white font-semibold">ML Engines</span>
                    <span className="px-4 py-2 bg-green-500 text-white rounded-lg font-bold">6/6 ACTIVE</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-blue-900/20 rounded-xl border border-blue-500/30">
                    <span className="text-white font-semibold">Uptime</span>
                    <span className="text-2xl font-black text-blue-400">{systemStats.uptime}</span>
                  </div>
                </div>
              </div>

              <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-gray-800 shadow-2xl">
                <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                  <span className="text-4xl">💾</span>
                  Resource Usage
                </h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400 font-semibold">Storage</span>
                      <span className="text-white font-bold">{systemStats.storageUsed} / 1 GB</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-3">
                      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full w-[14.5%]"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400 font-semibold">Memory</span>
                      <span className="text-white font-bold">256 MB / 512 MB</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-3">
                      <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full w-1/2"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400 font-semibold">CPU Usage</span>
                      <span className="text-white font-bold">23%</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-3">
                      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 h-3 rounded-full w-[23%]"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400 font-semibold">API Load</span>
                      <span className="text-white font-bold">Low</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-3">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full w-[15%]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-gray-800 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-black text-white flex items-center gap-3">
                  <span className="text-4xl">👥</span>
                  User Management
                </h3>
                <button className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold hover:shadow-xl transition">
                  + Add User
                </button>
              </div>
              
              {/* Users Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left py-4 px-4 text-gray-400 font-semibold">Username</th>
                      <th className="text-left py-4 px-4 text-gray-400 font-semibold">Email</th>
                      <th className="text-left py-4 px-4 text-gray-400 font-semibold">Role</th>
                      <th className="text-left py-4 px-4 text-gray-400 font-semibold">2FA</th>
                      <th className="text-left py-4 px-4 text-gray-400 font-semibold">Status</th>
                      <th className="text-right py-4 px-4 text-gray-400 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-800 hover:bg-gray-800/30">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                            A
                          </div>
                          <span className="text-white font-semibold">admin</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-300">admin@deepclean.ai</td>
                      <td className="py-4 px-4">
                        <span className="px-3 py-1 bg-red-900/30 text-red-400 rounded-lg font-bold text-sm border border-red-500/30">ADMIN</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-3 py-1 bg-gray-800 text-gray-400 rounded-lg font-bold text-sm">Disabled</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-3 py-1 bg-green-900/30 text-green-400 rounded-lg font-bold text-sm border border-green-500/30">ACTIVE</span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold mr-2">Edit</button>
                        <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold">View</button>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-800 hover:bg-gray-800/30">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                            M
                          </div>
                          <span className="text-white font-semibold">moderator</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-300">moderator@deepclean.ai</td>
                      <td className="py-4 px-4">
                        <span className="px-3 py-1 bg-purple-900/30 text-purple-400 rounded-lg font-bold text-sm border border-purple-500/30">MODERATOR</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-3 py-1 bg-gray-800 text-gray-400 rounded-lg font-bold text-sm">Disabled</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-3 py-1 bg-green-900/30 text-green-400 rounded-lg font-bold text-sm border border-green-500/30">ACTIVE</span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold mr-2">Edit</button>
                        <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold">View</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SECURITY TAB */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-gray-800 shadow-2xl">
              <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                <span className="text-4xl">🔐</span>
                Security Logs
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-4 p-4 bg-green-900/20 rounded-xl border border-green-500/30">
                  <span className="text-3xl">✅</span>
                  <div className="flex-1">
                    <div className="text-white font-semibold">Successful Login</div>
                    <div className="text-sm text-gray-400">admin@deepclean.ai - Just now</div>
                  </div>
                  <span className="text-green-400 font-bold">SUCCESS</span>
                </div>
                <div className="flex items-center gap-4 p-4 bg-blue-900/20 rounded-xl border border-blue-500/30">
                  <span className="text-3xl">🔑</span>
                  <div className="flex-1">
                    <div className="text-white font-semibold">2FA Setup Completed</div>
                    <div className="text-sm text-gray-400">moderator@deepclean.ai - 2 hours ago</div>
                  </div>
                  <span className="text-blue-400 font-bold">INFO</span>
                </div>
                <div className="flex items-center gap-4 p-4 bg-yellow-900/20 rounded-xl border border-yellow-500/30">
                  <span className="text-3xl">⚠️</span>
                  <div className="flex-1">
                    <div className="text-white font-semibold">Multiple Login Attempts</div>
                    <div className="text-sm text-gray-400">unknown@email.com - 5 hours ago</div>
                  </div>
                  <span className="text-yellow-400 font-bold">WARNING</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-gray-800 shadow-2xl">
              <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                <span className="text-4xl">⚙️</span>
                System Configuration
              </h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">
                  <div>
                    <div className="text-white font-semibold">Require 2FA for All Users</div>
                    <div className="text-sm text-gray-400">Force two-factor authentication</div>
                  </div>
                  <button className="px-6 py-3 bg-gray-700 rounded-xl font-bold text-white hover:bg-gray-600 transition">
                    OFF
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">
                  <div>
                    <div className="text-white font-semibold">Auto-Backup Database</div>
                    <div className="text-sm text-gray-400">Daily automatic backups</div>
                  </div>
                  <button className="px-6 py-3 bg-green-600 rounded-xl font-bold text-white hover:bg-green-500 transition">
                    ON
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">
                  <div>
                    <div className="text-white font-semibold">Email Notifications</div>
                    <div className="text-sm text-gray-400">Send security alerts via email</div>
                  </div>
                  <button className="px-6 py-3 bg-green-600 rounded-xl font-bold text-white hover:bg-green-500 transition">
                    ON
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
