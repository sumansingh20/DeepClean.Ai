'use client';

import { useState, useCallback } from 'react';
import apiClient from '@/lib/apiClient';
import type { AnalysisResult } from '@/lib/types';

interface UploadProgress {
  loaded: number;
  total: number;
  percent: number;
}

export const useUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = useCallback(
    async (
      file: File,
      uploadFn: (sessionId: string, file: File) => Promise<any>,
      sessionId: string,
      allowedTypes?: string[],
      maxSize?: number
    ) => {
      setIsUploading(true);
      setProgress(null);
      setError(null);

      try {
        // Validate file type
        if (allowedTypes && !allowedTypes.includes(file.type)) {
          throw new Error(`Invalid file type. Allowed: ${allowedTypes.join(', ')}`);
        }

        // Validate file size
        if (maxSize && file.size > maxSize) {
          const maxMB = (maxSize / 1024 / 1024).toFixed(0);
          throw new Error(`File too large. Max size: ${maxMB}MB`);
        }

        // Simulate progress (files upload quickly in practice)
        setProgress({ loaded: 0, total: file.size, percent: 0 });

        const response = await uploadFn(sessionId, file);

        setProgress({ loaded: file.size, total: file.size, percent: 100 });

        return response.data;
      } catch (err: any) {
        const message = err.response?.data?.detail || err.message || 'Upload failed';
        setError(message);
        throw err;
      } finally {
        setIsUploading(false);
        // Clear progress after delay
        setTimeout(() => setProgress(null), 1000);
      }
    },
    []
  );

  return {
    isUploading,
    progress,
    error,
    uploadFile,
    resetError: () => setError(null),
  };
};
