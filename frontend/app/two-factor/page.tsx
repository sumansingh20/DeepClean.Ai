'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { enable2FA, verify2FACode, get2FAStatus, regenerateBackupCodes, disable2FA } from '@/lib/twoFactorAuth';

export default function TwoFactorAuthPage() {
  const router = useRouter();
  const [step, setStep] = useState<'status' | 'setup' | 'verify'>('status');
  const [loading, setLoading] = useState(true);
  const [enabled, setEnabled] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    try {
      const status = await get2FAStatus();
      setEnabled(status.enabled);
      setLoading(false);
    } catch (err) {
      console.error('Failed to check 2FA status:', err);
      setLoading(false);
    }
  };

  const handleEnable2FA = async () => {
    setLoading(true);
    setError('');
    try {
      const setup = await enable2FA();
      setQrCode(setup.qrCode);
      setSecret(setup.secret);
      setBackupCodes(setup.backupCodes);
      setStep('setup');
    } catch (err) {
      setError('Failed to setup 2FA. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const valid = await verify2FACode(verificationCode, secret);
      if (valid) {
        setEnabled(true);
        setStep('status');
        alert('Two-factor authentication enabled successfully!');
      } else {
        setError('Invalid verification code. Please try again.');
      }
    } catch (err) {
      setError('Verification failed. Please try again.');
    } finally {
      setLoading(false);
      setVerificationCode('');
    }
  };

  const handleDisable = async () => {
    const code = prompt('Enter your 2FA code to disable:');
    if (!code) return;

    setLoading(true);
    try {
      await disable2FA(code);
      setEnabled(false);
      alert('Two-factor authentication disabled');
    } catch (err) {
      alert('Failed to disable 2FA. Invalid code.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateBackupCodes = async () => {
    const code = prompt('Enter your 2FA code to regenerate backup codes:');
    if (!code) return;

    setLoading(true);
    try {
      const newCodes = await regenerateBackupCodes(code);
      setBackupCodes(newCodes);
      alert('Backup codes regenerated successfully. Please save them securely.');
    } catch (err) {
      alert('Failed to regenerate backup codes. Invalid code.');
    } finally {
      setLoading(false);
    }
  };

  const downloadBackupCodes = () => {
    const text = `DeepClean.AI Two-Factor Authentication Backup Codes
Generated: ${new Date().toLocaleString()}

IMPORTANT: Keep these codes secure. Each code can only be used once.

${backupCodes.map((code, idx) => `${idx + 1}. ${code}`).join('\n')}

If you lose access to your authenticator app, use one of these codes to log in.`;

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `deepclean-backup-codes-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading && step === 'status') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.push('/settings')}
          className="mb-6 text-blue-600 hover:text-blue-700 flex items-center gap-2"
        >
          ← Back to Settings
        </button>

        {/* Status View */}
        {step === 'status' && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Two-Factor Authentication</h1>
                <p className="text-gray-600 mt-2">Add an extra layer of security to your account</p>
              </div>
              <div className={`px-4 py-2 rounded-full ${enabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                {enabled ? '✓ Enabled' : 'Disabled'}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-blue-900 mb-2">🔒 What is 2FA?</h3>
              <p className="text-blue-800 text-sm">
                Two-factor authentication adds an extra security step when logging in. 
                In addition to your password, you'll need to enter a code from your authenticator app.
              </p>
            </div>

            {!enabled ? (
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Benefits of enabling 2FA:</h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start gap-3">
                      <span className="text-green-500 text-xl">✓</span>
                      <span>Protect your account even if your password is compromised</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-500 text-xl">✓</span>
                      <span>Prevent unauthorized access to sensitive deepfake analysis data</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-500 text-xl">✓</span>
                      <span>Receive alerts about suspicious login attempts</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-500 text-xl">✓</span>
                      <span>Industry-standard security used by major platforms</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={handleEnable2FA}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50"
                >
                  {loading ? 'Setting up...' : 'Enable Two-Factor Authentication'}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <p className="text-green-800">
                    ✓ Your account is protected with two-factor authentication
                  </p>
                </div>

                <button
                  onClick={handleRegenerateBackupCodes}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all"
                >
                  Regenerate Backup Codes
                </button>

                <button
                  onClick={handleDisable}
                  disabled={loading}
                  className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-all disabled:opacity-50"
                >
                  Disable Two-Factor Authentication
                </button>
              </div>
            )}
          </div>
        )}

        {/* Setup View */}
        {step === 'setup' && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Set Up 2FA</h1>
            <p className="text-gray-600 mb-8">Follow these steps to secure your account</p>

            <div className="space-y-8">
              {/* Step 1: Download App */}
              <div>
                <h3 className="font-semibold text-lg mb-4">Step 1: Download an authenticator app</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="border rounded-lg p-4 text-center">
                    <div className="text-3xl mb-2">📱</div>
                    <div className="font-medium">Google Authenticator</div>
                    <div className="text-sm text-gray-500">iOS & Android</div>
                  </div>
                  <div className="border rounded-lg p-4 text-center">
                    <div className="text-3xl mb-2">🔐</div>
                    <div className="font-medium">Authy</div>
                    <div className="text-sm text-gray-500">Multi-device sync</div>
                  </div>
                  <div className="border rounded-lg p-4 text-center">
                    <div className="text-3xl mb-2">🛡️</div>
                    <div className="font-medium">Microsoft Authenticator</div>
                    <div className="text-sm text-gray-500">Enterprise-grade</div>
                  </div>
                </div>
              </div>

              {/* Step 2: Scan QR Code */}
              <div>
                <h3 className="font-semibold text-lg mb-4">Step 2: Scan this QR code</h3>
                <div className="flex flex-col items-center gap-4">
                  {qrCode ? (
                    <div className="bg-white p-4 border-2 border-gray-200 rounded-lg">
                      <img src={qrCode} alt="2FA QR Code" className="w-64 h-64" />
                    </div>
                  ) : (
                    <div className="w-64 h-64 bg-gray-100 rounded-lg animate-pulse" />
                  )}
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">Or enter this code manually:</p>
                    <code className="bg-gray-100 px-4 py-2 rounded text-sm font-mono">{secret}</code>
                  </div>
                </div>
              </div>

              {/* Step 3: Verify */}
              <div>
                <h3 className="font-semibold text-lg mb-4">Step 3: Enter the 6-digit code</h3>
                <div className="max-w-md mx-auto">
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-2xl tracking-widest font-mono"
                    maxLength={6}
                  />
                  {error && (
                    <p className="text-red-600 text-sm mt-2 text-center">{error}</p>
                  )}
                  <button
                    onClick={handleVerify}
                    disabled={loading || verificationCode.length !== 6}
                    className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50"
                  >
                    {loading ? 'Verifying...' : 'Verify and Enable 2FA'}
                  </button>
                </div>
              </div>

              {/* Backup Codes */}
              {backupCodes.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <h3 className="font-semibold text-yellow-900 mb-4">⚠️ Save Your Backup Codes</h3>
                  <p className="text-yellow-800 text-sm mb-4">
                    Keep these codes safe. You can use them to access your account if you lose your phone.
                  </p>
                  <div className="grid md:grid-cols-2 gap-2 mb-4">
                    {backupCodes.map((code, idx) => (
                      <code key={idx} className="bg-white px-3 py-2 rounded text-sm font-mono">
                        {code}
                      </code>
                    ))}
                  </div>
                  <button
                    onClick={downloadBackupCodes}
                    className="w-full bg-yellow-600 text-white py-2 rounded-lg font-semibold hover:bg-yellow-700 transition-all"
                  >
                    Download Backup Codes
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
