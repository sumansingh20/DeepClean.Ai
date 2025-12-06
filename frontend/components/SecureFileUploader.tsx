/**
 * Secure File Upload Component
 * =============================
 * 
 * React/Next.js component for uploading files to StopNCII platform.
 * 
 * Features:
 * - Drag & drop file upload
 * - File validation (type, size)
 * - Progress tracking via WebSocket
 * - Real-time status updates
 * - Error handling
 * 
 * Dependencies:
 *   npm install axios
 */

'use client';

import React, { useState, useCallback, useRef } from 'react';
import axios from 'axios';

// ============================================================================
// Types
// ============================================================================

interface UploadProgress {
  progress: number;
  currentStep: string;
  estimatedTimeRemaining: number;
}

interface DetectionResult {
  isDeepfake: boolean;
  confidence: number;
  modelScores: {
    xception: number;
    efficientnet: number;
    vit: number;
  };
}

interface HashResult {
  hashId: string;
  hashValue: string;
  hashType: string;
  quality: number;
}

interface MatchResult {
  matchesFound: boolean;
  matchCount: number;
  matches: Array<{
    similarityScore: number;
    hammingDistance: number;
    matchType: string;
  }>;
}

interface AnalysisResult {
  jobId: string;
  status: string;
  detectionResult: DetectionResult;
  hashResult: HashResult;
  matchResults: MatchResult;
}

// ============================================================================
// Component
// ============================================================================

export default function SecureFileUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [jobId, setJobId] = useState<string | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState<UploadProgress | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  // Configuration
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
  const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000';
  const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB
  
  const ALLOWED_TYPES = {
    image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp'],
    video: ['video/mp4', 'video/avi', 'video/quicktime', 'video/x-matroska', 'video/webm']
  };

  // ============================================================================
  // File Validation
  // ============================================================================

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return `File size exceeds maximum of 500MB. Your file: ${(file.size / (1024 * 1024)).toFixed(2)}MB`;
    }

    // Check file type
    const allAllowedTypes = [...ALLOWED_TYPES.image, ...ALLOWED_TYPES.video];
    if (!allAllowedTypes.includes(file.type)) {
      return `File type ${file.type} is not supported. Allowed types: Images (JPG, PNG, GIF, WebP, BMP) and Videos (MP4, AVI, MOV, MKV, WebM)`;
    }

    return null;
  };

  // ============================================================================
  // File Selection Handlers
  // ============================================================================

  const handleFileSelect = useCallback((selectedFile: File) => {
    const validationError = validateFile(selectedFile);
    
    if (validationError) {
      setError(validationError);
      return;
    }

    setFile(selectedFile);
    setError(null);
    setResult(null);
  }, []);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  // ============================================================================
  // WebSocket Connection
  // ============================================================================

  const connectWebSocket = (jobId: string, token: string) => {
    const wsUrl = `${WS_BASE_URL}/ws/job/${jobId}?token=${token}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'progress') {
        setAnalysisProgress({
          progress: data.progress,
          currentStep: data.current_step,
          estimatedTimeRemaining: data.estimated_time_remaining_seconds
        });
      } else if (data.type === 'completed') {
        setAnalysisProgress(null);
        setResult(data.result);
        ws.close();
      } else if (data.type === 'error') {
        setError(data.message);
        ws.close();
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setError('WebSocket connection failed');
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };

    wsRef.current = ws;
  };

  // ============================================================================
  // File Upload
  // ============================================================================

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      // Get auth token from localStorage or context
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        throw new Error('Not authenticated. Please log in.');
      }

      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('metadata', JSON.stringify({
        description: 'Uploaded via web interface',
        context: 'user_upload'
      }));

      // Upload file
      const response = await axios.post(
        `${API_BASE_URL}/upload/analyze`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(percentCompleted);
            }
          }
        }
      );

      // Upload successful, connect to WebSocket for progress
      const { job_id } = response.data.data;
      setJobId(job_id);
      connectWebSocket(job_id, token);

    } catch (err: any) {
      console.error('Upload error:', err);
      
      if (err.response?.data?.error) {
        setError(err.response.data.error.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Upload failed. Please try again.');
      }
    } finally {
      setIsUploading(false);
    }
  };

  // ============================================================================
  // Reset
  // ============================================================================

  const handleReset = () => {
    setFile(null);
    setJobId(null);
    setUploadProgress(0);
    setAnalysisProgress(null);
    setResult(null);
    setError(null);
    
    if (wsRef.current) {
      wsRef.current.close();
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-2 text-gray-900">
          Upload Content for Analysis
        </h2>
        <p className="text-gray-600 mb-6">
          Upload an image or video to detect deepfakes and generate a privacy-preserving hash.
          Your content is never stored—only the hash is kept.
        </p>

        {/* File Upload Area */}
        {!file && !result && (
          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
              isDragging
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="mb-4">
              <svg
                className="mx-auto h-16 w-16 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            
            <p className="text-lg mb-2 text-gray-700">
              Drag and drop your file here, or
            </p>
            
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileInputChange}
              accept="image/*,video/*"
              className="hidden"
              id="file-upload"
            />
            
            <label
              htmlFor="file-upload"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors"
            >
              Choose File
            </label>
            
            <p className="text-sm text-gray-500 mt-4">
              Maximum file size: 500MB
              <br />
              Supported: Images (JPG, PNG, GIF, WebP, BMP) and Videos (MP4, AVI, MOV, MKV, WebM)
            </p>
          </div>
        )}

        {/* Selected File Info */}
        {file && !isUploading && !jobId && (
          <div className="bg-gray-50 rounded-lg p-6 mb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <svg
                  className="h-10 w-10 text-blue-500 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <div>
                  <p className="font-semibold text-gray-900">{file.name}</p>
                  <p className="text-sm text-gray-600">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
              
              <button
                onClick={handleReset}
                className="text-red-600 hover:text-red-700"
              >
                Remove
              </button>
            </div>
            
            <button
              onClick={handleUpload}
              className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              Upload and Analyze
            </button>
          </div>
        )}

        {/* Upload Progress */}
        {isUploading && (
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Uploading...</span>
              <span className="text-sm font-medium text-gray-700">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Analysis Progress */}
        {analysisProgress && (
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                {analysisProgress.currentStep}
              </span>
              <span className="text-sm font-medium text-gray-700">
                {analysisProgress.progress}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-green-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${analysisProgress.progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Estimated time remaining: {analysisProgress.estimatedTimeRemaining}s
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="flex">
              <svg
                className="h-5 w-5 text-red-400 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-900">Analysis Results</h3>
            
            {/* Deepfake Detection */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="text-lg font-semibold mb-3 text-gray-900">
                Deepfake Detection
              </h4>
              
              <div className={`flex items-center p-4 rounded-lg ${
                result.detectionResult.isDeepfake
                  ? 'bg-red-100 border border-red-300'
                  : 'bg-green-100 border border-green-300'
              }`}>
                <div className="flex-1">
                  <p className="font-bold text-lg">
                    {result.detectionResult.isDeepfake ? '⚠️ DEEPFAKE DETECTED' : '✓ AUTHENTIC'}
                  </p>
                  <p className="text-sm mt-1">
                    Confidence: {(result.detectionResult.confidence * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-xs text-gray-600">XceptionNet</p>
                  <p className="text-lg font-semibold">
                    {(result.detectionResult.modelScores.xception * 100).toFixed(1)}%
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-600">EfficientNet</p>
                  <p className="text-lg font-semibold">
                    {(result.detectionResult.modelScores.efficientnet * 100).toFixed(1)}%
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-600">ViT</p>
                  <p className="text-lg font-semibold">
                    {(result.detectionResult.modelScores.vit * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
            
            {/* Hash Information */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="text-lg font-semibold mb-3 text-gray-900">
                Perceptual Hash
              </h4>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Hash ID:</span>
                  <span className="font-mono text-sm">{result.hashResult.hashId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Hash Type:</span>
                  <span className="font-semibold">{result.hashResult.hashType.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Quality:</span>
                  <span className="font-semibold">{result.hashResult.quality}/100</span>
                </div>
                <div className="mt-3">
                  <span className="text-gray-600">Hash Value:</span>
                  <p className="font-mono text-xs bg-white p-2 rounded mt-1 break-all">
                    {result.hashResult.hashValue}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Match Results */}
            {result.matchResults.matchesFound && (
              <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-6">
                <h4 className="text-lg font-semibold mb-3 text-gray-900">
                  ⚠️ Similar Content Found
                </h4>
                
                <p className="mb-3">
                  This content matches {result.matchResults.matchCount} existing{' '}
                  {result.matchResults.matchCount === 1 ? 'item' : 'items'} in our database.
                </p>
                
                {result.matchResults.matches.slice(0, 3).map((match, index) => (
                  <div key={index} className="bg-white rounded p-3 mb-2">
                    <div className="flex justify-between">
                      <span>Similarity:</span>
                      <span className="font-semibold">
                        {(match.similarityScore * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Match Type:</span>
                      <span>{match.matchType}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={handleReset}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Upload Another File
              </button>
              
              {result.detectionResult.isDeepfake && (
                <button
                  onClick={() => {
                    // Navigate to report submission page
                    window.location.href = `/reports/submit?hash_id=${result.hashResult.hashId}`;
                  }}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
                >
                  Submit Takedown Report
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Privacy Notice */}
      <div className="mt-6 text-center text-sm text-gray-600">
        <p>
          🔒 Your content is processed securely and never stored.
          Only a perceptual hash is retained for matching purposes.
        </p>
        <p className="mt-1">
          By uploading, you agree to our{' '}
          <a href="/terms" className="text-blue-600 hover:underline">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="/privacy" className="text-blue-600 hover:underline">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}
