'use client';

import React, { useState } from 'react';
import apiClient from '@/lib/apiClient';

interface LivenessRecorderProps {
  sessionId: string;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

export const LivenessRecorder: React.FC<LivenessRecorderProps> = ({
  sessionId,
  onSuccess,
  onError,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [challenge, setChallenge] = useState<any>(null);
  const [message, setMessage] = useState<string>('');

  const startChallenge = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.startLivenessChallenge(sessionId);
      setChallenge(response.data);
      setMessage(`Challenge started. Follow the instruction: ${response.data.instruction || ''}`);
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || 'Failed to start challenge';
      setError(errorMsg);
      if (onError) {
        onError(errorMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const verifyResponse = async () => {
    if (!challenge) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.verifyLivenessChallenge(sessionId, {
        challenge_id: challenge.challenge_id,
        response_data: {
          // In a real app, this would contain face/motion data from WebRTC
          face_detected: true,
          motion_detected: true,
          timestamp: new Date().toISOString(),
        },
      });

      if (onSuccess) {
        onSuccess(response.data);
      }

      setChallenge(null);
      setMessage('✓ Liveness verification complete');
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || 'Verification failed';
      setError(errorMsg);
      if (onError) {
        onError(errorMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">👁️ Liveness Detection</h3>

        <div className="bg-orange-50 rounded-lg p-8 text-center mb-4">
          <div className="text-6xl mb-4">📱</div>
          <p className="text-sm text-gray-700">
            Look at your camera and follow the instructions to verify you're a real person.
          </p>
        </div>

        {message && (
          <div className="mb-4 bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded text-sm">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm">
            {error}
          </div>
        )}

        {!challenge ? (
          <button
            onClick={startChallenge}
            disabled={isLoading}
            className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isLoading ? 'Starting...' : 'Start Liveness Check'}
          </button>
        ) : (
          <button
            onClick={verifyResponse}
            disabled={isLoading}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isLoading ? 'Verifying...' : 'Complete Verification'}
          </button>
        )}

        <p className="text-xs text-gray-500 text-center mt-4">
          This requires access to your camera for face detection.
        </p>
      </div>
    </div>
  );
};

export default LivenessRecorder;
