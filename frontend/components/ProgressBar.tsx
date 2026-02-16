'use client';

import React from 'react';

interface ProgressBarProps {
  percent: number;
  status?: 'uploading' | 'processing' | 'complete' | 'error';
  label?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  percent,
  status = 'uploading',
  label,
}) => {
  const getColorClass = () => {
    switch (status) {
      case 'uploading':
        return 'bg-blue-600';
      case 'processing':
        return 'bg-purple-600';
      case 'complete':
        return 'bg-green-600';
      case 'error':
        return 'bg-red-600';
      default:
        return 'bg-blue-600';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'uploading':
        return '📤';
      case 'processing':
        return '⚙️';
      case 'complete':
        return '✓';
      case 'error':
        return '✕';
      default:
        return '';
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case 'uploading':
        return 'Uploading...';
      case 'processing':
        return 'Processing...';
      case 'complete':
        return 'Complete';
      case 'error':
        return 'Error';
      default:
        return '';
    }
  };

  return (
    <div className="w-full">
      {label && <p className="text-sm font-medium text-gray-700 mb-2">{label}</p>}

      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className={`h-3 rounded-full transition-all duration-300 ${getColorClass()}`}
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="flex justify-between items-center mt-2">
        <p className="text-xs text-gray-600">{percent}%</p>
        <p className="text-xs text-gray-600 flex items-center gap-1">
          <span>{getStatusIcon()}</span>
          {getStatusLabel()}
        </p>
      </div>
    </div>
  );
};

export default ProgressBar;
