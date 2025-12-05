'use client';

import React, { useEffect, useState } from 'react';
import { useWebSocket, AnalysisProgress } from '@/hooks';

interface RealTimeProgressProps {
  sessionId: string;
  onComplete?: () => void;
  onError?: (error: string) => void;
}

export const RealTimeProgress: React.FC<RealTimeProgressProps> = ({
  sessionId,
  onComplete,
  onError,
}) => {
  const [progress, setProgress] = useState<AnalysisProgress | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const { isConnected, progress: wsProgress, on, error } = useWebSocket({
    sessionId,
    enabled: true,
  });

  useEffect(() => {
    if (wsProgress) {
      setProgress(wsProgress);

      if (wsProgress.status === 'completed') {
        setIsCompleted(true);
        if (onComplete) {
          onComplete();
        }
      } else if (wsProgress.status === 'failed') {
        if (onError) {
          onError('Analysis failed');
        }
      }
    }
  }, [wsProgress, onComplete, onError]);

  useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error, onError]);

  const getStageColor = (stage: string): string => {
    switch (stage) {
      case 'voice_analysis':
        return 'text-blue-600';
      case 'video_analysis':
        return 'text-purple-600';
      case 'document_verification':
        return 'text-green-600';
      case 'liveness_detection':
        return 'text-orange-600';
      case 'scam_detection':
        return 'text-red-600';
      case 'fusion_scoring':
        return 'text-indigo-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStageLabel = (stage: string): string => {
    return stage
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (!progress) {
    return (
      <div className="w-full bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mr-4" />
          <p className="text-gray-600">Initializing analysis...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-lg shadow p-6">
      {/* Connection Status */}
      <div className="mb-6 flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-yellow-500'}`} />
        <span className="text-sm text-gray-600">
          {isConnected ? 'Connected' : 'Connecting...'}
        </span>
      </div>

      {/* Overall Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900">Overall Progress</h3>
          <span className="text-2xl font-bold text-indigo-600">{progress.progress_percent}%</span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className={`h-3 rounded-full transition-all duration-300 ${
              isCompleted
                ? 'bg-green-500'
                : progress.status === 'failed'
                  ? 'bg-red-500'
                  : 'bg-indigo-600'
            }`}
            style={{ width: `${progress.progress_percent}%` }}
          />
        </div>

        {isCompleted && (
          <p className="text-sm text-green-600 font-medium mt-2 flex items-center gap-1">
            <span>✓</span> Analysis Complete
          </p>
        )}

        {progress.status === 'failed' && (
          <p className="text-sm text-red-600 font-medium mt-2 flex items-center gap-1">
            <span>✕</span> Analysis Failed
          </p>
        )}
      </div>

      {/* Current Stage */}
      <div className="mb-6 p-4 bg-indigo-50 border border-indigo-200 rounded">
        <p className="text-xs text-gray-600 font-semibold mb-1">CURRENT STAGE</p>
        <p className={`text-lg font-semibold ${getStageColor(progress.current_stage)}`}>
          {getStageLabel(progress.current_stage)}
        </p>
      </div>

      {/* Component Progress Breakdown */}
      {progress.details && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Component Progress</h4>

          {progress.details.voice_progress !== undefined && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm text-gray-700 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full" />
                  Voice Analysis
                </label>
                <span className="text-xs font-medium text-gray-600">{progress.details.voice_progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${progress.details.voice_progress}%` }}
                />
              </div>
            </div>
          )}

          {progress.details.video_progress !== undefined && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm text-gray-700 flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full" />
                  Video Analysis
                </label>
                <span className="text-xs font-medium text-gray-600">{progress.details.video_progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-purple-500 transition-all duration-300"
                  style={{ width: `${progress.details.video_progress}%` }}
                />
              </div>
            </div>
          )}

          {progress.details.document_progress !== undefined && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm text-gray-700 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  Document Verification
                </label>
                <span className="text-xs font-medium text-gray-600">{progress.details.document_progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-green-500 transition-all duration-300"
                  style={{ width: `${progress.details.document_progress}%` }}
                />
              </div>
            </div>
          )}

          {progress.details.liveness_progress !== undefined && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm text-gray-700 flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full" />
                  Liveness Detection
                </label>
                <span className="text-xs font-medium text-gray-600">{progress.details.liveness_progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-orange-500 transition-all duration-300"
                  style={{ width: `${progress.details.liveness_progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RealTimeProgress;
