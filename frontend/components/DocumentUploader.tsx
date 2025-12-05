'use client';

import React, { useRef, useState } from 'react';
import { useUpload } from '@/hooks';
import apiClient from '@/lib/apiClient';

type DocumentType = 'id_card' | 'passport' | 'license' | 'other';

interface DocumentUploaderProps {
  sessionId: string;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  sessionId,
  onSuccess,
  onError,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [documentType, setDocumentType] = useState<DocumentType>('id_card');
  const [preview, setPreview] = useState<string | null>(null);
  const { isUploading, progress, error, uploadFile, resetError } = useUpload();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    resetError();

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    try {
      // Create a custom upload function that includes document type
      const uploadWithType = async (sessionId: string, file: File) => {
        return apiClient.uploadDocumentAnalysis(sessionId, file, documentType);
      };

      const result = await uploadFile(
        file,
        uploadWithType,
        sessionId,
        ['image/jpeg', 'image/png', 'application/pdf'],
        20 * 1024 * 1024 // 20MB max
      );

      if (onSuccess) {
        onSuccess(result);
      }

      // Reset
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setFileName(null);
      setPreview(null);
    } catch (err: any) {
      if (onError) {
        onError(error || 'Upload failed');
      }
    }
  };

  const progressPercent = progress?.percent || 0;

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">📄 Document Analysis</h3>

        {!fileName && !isUploading ? (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Document Type
              </label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value as DocumentType)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="id_card">ID Card</option>
                <option value="passport">Passport</option>
                <option value="license">Driver's License</option>
                <option value="other">Other</option>
              </select>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,application/pdf"
              onChange={handleFileSelect}
              disabled={isUploading}
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-green-300 rounded-lg p-8 text-center hover:border-green-500 hover:bg-green-50 transition"
            >
              <div className="text-4xl mb-2">🖼️</div>
              <p className="text-sm font-medium text-gray-700">Click to upload document</p>
              <p className="text-xs text-gray-500 mt-1">JPG, PNG, PDF up to 20MB</p>
            </button>
          </>
        ) : (
          <div className="space-y-4">
            {preview && (
              <img
                src={preview}
                alt="Document preview"
                className="w-full h-40 bg-gray-100 rounded object-cover"
              />
            )}

            <div className="bg-green-50 rounded p-4">
              <p className="text-xs text-gray-600 mb-1">Document Type</p>
              <p className="text-sm font-medium text-gray-700 capitalize">
                {documentType.replace('_', ' ')}
              </p>
            </div>

            <div className="bg-green-50 rounded p-4">
              <p className="text-sm font-medium text-gray-700 truncate">{fileName}</p>
            </div>

            {isUploading && progress && (
              <>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600 text-center">{progressPercent}% uploaded</p>
              </>
            )}

            {!isUploading && progressPercent === 100 && (
              <p className="text-xs text-green-600 text-center">✓ Upload complete</p>
            )}
          </div>
        )}

        {error && (
          <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentUploader;
