'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getActiveSessions, revokeSession, revokeAllSessions, type DeviceSession } from '@/lib/sessionManager';

export default function SessionsPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<DeviceSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const data = await getActiveSessions();
      setSessions(data);
    } catch (error) {
      console.error('Failed to load sessions:', error);
      alert('Failed to load active sessions. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeSession = async (sessionId: string) => {
    if (!confirm('Are you sure you want to end this session?')) return;

    try {
      await revokeSession(sessionId);
      setSessions(sessions.filter(s => s.id !== sessionId));
      alert('Session ended successfully');
    } catch (error) {
      alert('Failed to end session');
    }
  };

  const handleRevokeAll = async () => {
    if (!confirm('End all other sessions? You will remain logged in on this device.')) return;

    try {
      await revokeAllSessions(true);
      setSessions(sessions.filter(s => s.isCurrent));
      alert('All other sessions have been ended');
    } catch (error) {
      alert('Failed to end sessions');
    }
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'mobile': return '📱';
      case 'tablet': return '📲';
      default: return '💻';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => router.push('/settings')}
          className="mb-6 text-blue-600 hover:text-blue-700 flex items-center gap-2"
        >
          ← Back to Settings
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Active Sessions</h1>
              <p className="text-gray-600 mt-2">Manage devices currently signed into your account</p>
            </div>
            {sessions.length > 1 && (
              <button
                onClick={handleRevokeAll}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
              >
                End All Other Sessions
              </button>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <p className="text-blue-800 text-sm">
              🔒 For your security, review your active sessions regularly. If you see unfamiliar activity, 
              end those sessions immediately and change your password.
            </p>
          </div>

          {sessions.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔐</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Active Sessions</h3>
              <p className="text-gray-600">You're not currently logged in on any devices</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className={`border rounded-lg p-6 transition-all ${
                    session.isCurrent 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="text-4xl">{getDeviceIcon(session.deviceType)}</div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {session.deviceName || `${session.browser} on ${session.os}`}
                          </h3>
                          {session.isCurrent && (
                            <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
                              Current Session
                            </span>
                          )}
                        </div>

                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Browser:</span>
                            <span>{session.browser}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">OS:</span>
                            <span>{session.os}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">IP Address:</span>
                            <span>{session.ipAddress}</span>
                          </div>
                          {session.location && (
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Location:</span>
                              <span>{session.location}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Last Active:</span>
                            <span>{new Date(session.lastActive).toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-500">
                            <span className="font-medium">First Seen:</span>
                            <span>{new Date(session.createdAt).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {!session.isCurrent && (
                      <button
                        onClick={() => handleRevokeSession(session.id)}
                        className="ml-4 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      >
                        End Session
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Security Tips</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-500">•</span>
                <span>Always log out when using shared or public devices</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">•</span>
                <span>Enable two-factor authentication for extra security</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">•</span>
                <span>Report any unrecognized sessions immediately</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">•</span>
                <span>Use a password manager to generate and store strong passwords</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
