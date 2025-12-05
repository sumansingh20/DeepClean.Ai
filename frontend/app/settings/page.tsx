'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('profile');
  
  // Profile
  const [username, setUsername] = useState('');
  const [organization, setOrganization] = useState('');
  
  // Password
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // 2FA
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [totpCode, setTotpCode] = useState('');
  const [showQrSetup, setShowQrSetup] = useState(false);
  
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    setUsername(parsedUser.username || '');
    setOrganization(parsedUser.organization || '');
    setTwoFactorEnabled(parsedUser.two_factor_enabled || false);
  }, [router]);

  const handleUpdateProfile = async () => {
    if (!user) return;
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch(`http://localhost:8001/api/v1/users/profile/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, organization })
      });

      if (response.ok) {
        const updatedUser = { ...user, username, organization };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setMessage('Profile updated successfully!');
      } else {
        const data = await response.json();
        setError(data.detail || 'Update failed');
      }
    } catch (err: any) {
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!user) return;
    setLoading(true);
    setError('');
    setMessage('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8001/api/v1/users/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          old_password: oldPassword,
          new_password: newPassword
        })
      });

      if (response.ok) {
        setMessage('Password changed successfully!');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        const data = await response.json();
        setError(data.detail || 'Password change failed');
      }
    } catch (err: any) {
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEnable2FA = async () => {
    if (!user) return;
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8001/api/v1/auth/2fa/enable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id })
      });

      if (response.ok) {
        const data = await response.json();
        setQrCode(data.qr_code);
        setSecret(data.secret);
        setBackupCodes(data.backup_codes);
        setShowQrSetup(true);
      } else {
        const data = await response.json();
        setError(data.detail || '2FA setup failed');
      }
    } catch (err: any) {
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify2FA = async () => {
    if (!user) return;
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8001/api/v1/auth/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          totp_code: totpCode
        })
      });

      if (response.ok) {
        setTwoFactorEnabled(true);
        setShowQrSetup(false);
        setMessage('2FA enabled successfully!');
        const updatedUser = { ...user, two_factor_enabled: true };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setTotpCode('');
      } else {
        const data = await response.json();
        setError(data.detail || 'Invalid code');
      }
    } catch (err: any) {
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDisable2FA = async () => {
    if (!user) return;
    const password = prompt('Enter your password to disable 2FA:');
    if (!password) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8001/api/v1/auth/2fa/disable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          password: password
        })
      });

      if (response.ok) {
        setTwoFactorEnabled(false);
        setMessage('2FA disabled successfully');
        const updatedUser = { ...user, two_factor_enabled: false };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
      } else {
        const data = await response.json();
        setError(data.detail || 'Failed to disable 2FA');
      }
    } catch (err: any) {
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition group">
              <span className="text-2xl group-hover:-translate-x-1 transition-transform">←</span>
              <span className="font-semibold">Back to Dashboard</span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
              {user.username?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="font-bold text-gray-900">{user.username}</div>
              <div className="text-xs text-gray-500">{user.email}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-4xl font-black text-gray-900 mb-2">Account Settings</h1>
            <p className="text-gray-600">Manage your profile, security, and preferences</p>
          </div>

          {/* Messages */}
          {message && (
            <div className="mb-6 bg-green-50 border-2 border-green-200 text-green-700 px-6 py-4 rounded-2xl flex items-center gap-3 shadow-sm animate-fade-in">
              <span className="text-2xl">✓</span>
              <span className="font-semibold">{message}</span>
            </div>
          )}
          {error && (
            <div className="mb-6 bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-2xl flex items-center gap-3 shadow-sm animate-shake">
              <span className="text-2xl">⚠️</span>
              <span className="font-semibold">{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Tabs */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-200">
                <nav className="space-y-2">
                  {[
                    { id: 'profile', icon: '👤', label: 'Profile' },
                    { id: 'security', icon: '🔐', label: 'Password' },
                    { id: '2fa', icon: '🛡️', label: 'Two-Factor Auth' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setMessage('');
                        setError('');
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span className="text-xl">{tab.icon}</span>
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Content Area */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <div>
                    <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                      <span>👤</span>
                      <span>Profile Information</span>
                    </h2>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Username</label>
                        <input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Email (Read-only)</label>
                        <input
                          type="email"
                          value={user.email}
                          disabled
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Organization</label>
                        <input
                          type="text"
                          value={organization}
                          onChange={(e) => setOrganization(e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                        />
                      </div>
                      <button
                        onClick={handleUpdateProfile}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-black hover:shadow-xl disabled:opacity-50 transition-all transform hover:scale-105"
                      >
                        {loading ? 'Updating...' : 'Update Profile'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Security Tab */}
                {activeTab === 'security' && (
                  <div>
                    <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                      <span>🔐</span>
                      <span>Change Password</span>
                    </h2>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Current Password</label>
                        <input
                          type="password"
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                          placeholder="••••••••"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">New Password</label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                          placeholder="••••••••"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Confirm New Password</label>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                          placeholder="••••••••"
                        />
                      </div>
                      <button
                        onClick={handleChangePassword}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-black hover:shadow-xl disabled:opacity-50 transition-all transform hover:scale-105"
                      >
                        {loading ? 'Changing...' : 'Change Password'}
                      </button>
                    </div>
                  </div>
                )}

                {/* 2FA Tab */}
                {activeTab === '2fa' && (
                  <div>
                    <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                      <span>🛡️</span>
                      <span>Two-Factor Authentication</span>
                    </h2>

                    {/* 2FA Status */}
                    <div className={`mb-8 p-6 rounded-2xl border-2 ${twoFactorEnabled ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
                      <div className="flex items-center gap-4">
                        <div className="text-4xl">{twoFactorEnabled ? '✅' : '⚠️'}</div>
                        <div>
                          <div className="font-black text-lg">
                            {twoFactorEnabled ? '2FA is Enabled' : '2FA is Disabled'}
                          </div>
                          <div className="text-sm text-gray-700">
                            {twoFactorEnabled 
                              ? 'Your account is protected with two-factor authentication'
                              : 'Enable 2FA to add an extra layer of security'
                            }
                          </div>
                        </div>
                      </div>
                    </div>

                    {!twoFactorEnabled && !showQrSetup && (
                      <div>
                        <p className="text-gray-700 mb-6 leading-relaxed">
                          Two-factor authentication adds an extra layer of security to your account. 
                          You&apos;ll need to enter a code from your authenticator app when you log in.
                        </p>
                        <button
                          onClick={handleEnable2FA}
                          disabled={loading}
                          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-black hover:shadow-xl disabled:opacity-50 transition-all transform hover:scale-105"
                        >
                          {loading ? 'Setting up...' : 'Enable Two-Factor Authentication'}
                        </button>
                      </div>
                    )}

                    {showQrSetup && (
                      <div className="space-y-6">
                        <div className="p-6 bg-blue-50 border-2 border-blue-200 rounded-2xl">
                          <h3 className="font-black text-lg mb-4">Step 1: Scan QR Code</h3>
                          <p className="text-sm text-gray-700 mb-4">
                            Scan this QR code with Google Authenticator, Authy, or any TOTP app:
                          </p>
                          <div className="bg-white p-4 rounded-xl inline-block border-2 border-gray-200">
                            <img src={qrCode} alt="QR Code" className="w-64 h-64" />
                          </div>
                          <div className="mt-4 p-4 bg-white rounded-xl border border-gray-200">
                            <p className="text-xs text-gray-600 mb-2 font-semibold">Manual Entry Code:</p>
                            <code className="text-sm font-mono bg-gray-100 px-3 py-2 rounded-lg block">{secret}</code>
                          </div>
                        </div>

                        <div className="p-6 bg-purple-50 border-2 border-purple-200 rounded-2xl">
                          <h3 className="font-black text-lg mb-4">Step 2: Save Backup Codes</h3>
                          <p className="text-sm text-gray-700 mb-4">
                            Save these backup codes in a secure place. Each can be used once if you lose access to your authenticator:
                          </p>
                          <div className="grid grid-cols-2 gap-2">
                            {backupCodes.map((code, idx) => (
                              <div key={idx} className="bg-white px-4 py-2 rounded-lg border border-gray-200 font-mono text-sm text-center">
                                {code}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="p-6 bg-green-50 border-2 border-green-200 rounded-2xl">
                          <h3 className="font-black text-lg mb-4">Step 3: Verify Setup</h3>
                          <p className="text-sm text-gray-700 mb-4">
                            Enter the 6-digit code from your authenticator app:
                          </p>
                          <input
                            type="text"
                            value={totpCode}
                            onChange={(e) => setTotpCode(e.target.value)}
                            maxLength={6}
                            placeholder="000000"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all text-center text-2xl font-mono tracking-widest"
                          />
                          <button
                            onClick={handleVerify2FA}
                            disabled={loading || totpCode.length !== 6}
                            className="w-full mt-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-black hover:shadow-xl disabled:opacity-50 transition-all transform hover:scale-105"
                          >
                            {loading ? 'Verifying...' : 'Verify and Enable 2FA'}
                          </button>
                        </div>
                      </div>
                    )}

                    {twoFactorEnabled && (
                      <div>
                        <button
                          onClick={handleDisable2FA}
                          disabled={loading}
                          className="w-full bg-gradient-to-r from-red-600 to-pink-600 text-white py-4 rounded-xl font-black hover:shadow-xl disabled:opacity-50 transition-all transform hover:scale-105"
                        >
                          {loading ? 'Disabling...' : 'Disable Two-Factor Authentication'}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
}
