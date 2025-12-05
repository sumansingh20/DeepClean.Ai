'use client';

import React, { useRef, useState } from 'react';
import { useUpload } from '@/hooks';
import apiClient from '@/lib/apiClient';

interface AudioUploaderProps {
  sessionId: string;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

export const AudioUploader: React.FC<AudioUploaderProps> = ({
  sessionId,
  onSuccess,
  onError,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { isUploading, progress, error, uploadFile, resetError } = useUpload();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      await processFile(file);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const processFile = async (file: File) => {
    setFileName(file.name);
    resetError();

    try {
      const result = await uploadFile(
        file,
        apiClient.uploadVoiceAnalysis.bind(apiClient),
        sessionId,
        ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/webm', 'audio/mp3'],
        50 * 1024 * 1024 // 50MB max
      );

      if (onSuccess) {
        onSuccess(result);
      }

      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setFileName(null);
    } catch (err: any) {
      if (onError) {
        onError(error || 'Upload failed');
      }
    }
  };

  const progressPercent = progress?.percent || 0;

  return (
    <div className="w-full">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              🎤 Voice Analysis
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Upload audio files for deepfake detection
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Supported Formats</p>
            <p className="text-sm font-medium text-gray-700">MP3, WAV, OGG, WebM</p>
            <p className="text-xs text-gray-500">Max 50MB</p>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          onChange={handleFileSelect}
          disabled={isUploading}
          className="hidden"
          aria-label="Upload audio file"
        />

        {!fileName && !isUploading ? (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-blue-500 bg-blue-50 scale-105'
                : 'border-blue-300 hover:border-blue-500 hover:bg-blue-50'
            }`}
          >
            <div className="text-6xl mb-4 animate-pulse">🎵</div>
            <p className="text-lg font-semibold text-gray-700 mb-2">
              {isDragging ? 'Drop audio file here' : 'Drag & drop audio file here'}
            </p>
            <p className="text-sm text-gray-500 mb-4">or click to browse</p>
            <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
              <span>✓ MP3</span>
              <span>•</span>
              <span>✓ WAV</span>
              <span>•</span>
              <span>✓ OGG</span>
              <span>•</span>
              <span>✓ WebM</span>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white text-2xl">
                  🎵
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-700 truncate">{fileName}</p>
                  <p className="text-xs text-gray-500">Audio file</p>
                </div>
              </div>

              {isUploading && progress && (
                <div className="space-y-2">
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    {/* eslint-disable-next-line react/forbid-dom-props */}
                    <div
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 h-3 rounded-full transition-all duration-300 flex items-center justify-end pr-2"
                      style={{ width: `${progressPercent}%` }}
                    >
                      {progressPercent > 10 && (
                        <span className="text-xs font-bold text-white">{progressPercent}%</span>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Uploading...</span>
                    <span>{progressPercent}% complete</span>
                  </div>
                </div>
              )}

              {!isUploading && progressPercent === 100 && (
                <div className="flex items-center gap-2 text-green-600 font-medium">
                  <span className="text-xl">✓</span>
                  <span>Upload complete - Analyzing...</span>
                </div>
              )}
            </div>

            {!isUploading && progressPercent === 100 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800 flex items-center gap-2">
                  <span className="animate-spin text-lg">⚙️</span>
                  <span>AI models are analyzing your audio file...</span>
                </p>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="mt-4 bg-red-100 border border-red-400 rounded-lg p-4 flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="text-sm font-semibold text-red-800">Upload Failed</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Feature Pills */}
        <div className="mt-6 flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
            🤖 Wav2Vec2 Analysis
          </span>
          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full font-medium">
            📊 MFCC Features
          </span>
          <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
            🔊 Spectral Analysis
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
            ✓ 91.8% Accuracy
          </span>
        </div>
      </div>
    </div>
  );
};

export default AudioUploader;
