'use client';

import React from 'react';

interface RiskScoreCardProps {
  score: number;
  level: 'low' | 'medium' | 'high' | 'critical';
  voiceScore: number;
  videoScore: number;
  documentScore: number;
  livenessScore: number;
  scamScore: number;
}

const RISK_LEVELS = {
  low: {
    color: 'bg-green-100 border-green-300 text-green-800',
    label: 'LOW RISK',
    message: 'Low risk detected. Individual appears genuine with consistent patterns.'
  },
  medium: {
    color: 'bg-yellow-100 border-yellow-300 text-yellow-800',
    label: 'MEDIUM RISK',
    message: 'Medium risk detected. Some inconsistencies observed. Further verification recommended.'
  },
  high: {
    color: 'bg-orange-100 border-orange-300 text-orange-800',
    label: 'HIGH RISK',
    message: 'High risk detected. Multiple red flags identified. Enhanced verification required.'
  },
  critical: {
    color: 'bg-red-100 border-red-300 text-red-800',
    label: 'CRITICAL RISK',
    message: 'Critical risk detected. Strong indicators of fraud. Immediate escalation recommended.'
  }
};

export const RiskScoreCard: React.FC<RiskScoreCardProps> = ({
  score,
  level,
  voiceScore,
  videoScore,
  documentScore,
  livenessScore,
  scamScore,
}) => {
  const riskLevel = RISK_LEVELS[level] || RISK_LEVELS.low;

  return (
    <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Risk Assessment</h2>
        <div className={`${riskLevel.color} border-2 rounded-lg p-4 mb-6`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold opacity-75">Overall Risk Score</p>
              <p className="text-4xl font-bold">{score}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold opacity-75">Level</p>
              <p className="text-2xl font-bold">{riskLevel.label}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        <div className="bg-blue-50 border border-blue-200 rounded p-4">
          <p className="text-xs text-gray-600 font-medium mb-1">VOICE ANALYSIS</p>
          <p className="text-2xl font-bold text-blue-600">{voiceScore}</p>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded p-4">
          <p className="text-xs text-gray-600 font-medium mb-1">VIDEO ANALYSIS</p>
          <p className="text-2xl font-bold text-purple-600">{videoScore}</p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded p-4">
          <p className="text-xs text-gray-600 font-medium mb-1">DOCUMENT CHECK</p>
          <p className="text-2xl font-bold text-green-600">{documentScore}</p>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded p-4">
          <p className="text-xs text-gray-600 font-medium mb-1">LIVENESS TEST</p>
          <p className="text-2xl font-bold text-orange-600">{livenessScore}</p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded p-4">
          <p className="text-xs text-gray-600 font-medium mb-1">SCAM DETECTION</p>
          <p className="text-2xl font-bold text-red-600">{scamScore}</p>
        </div>

        <div className="bg-indigo-50 border border-indigo-200 rounded p-4">
          <p className="text-xs text-gray-600 font-medium mb-1">FUSION SCORE</p>
          <p className="text-2xl font-bold text-indigo-600">{score}</p>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded border border-gray-200">
        <p className="text-sm text-gray-700">
          <span className="font-semibold">Interpretation: </span>
          {riskLevel.message}
        </p>
      </div>
    </div>
  );
};

export default RiskScoreCard;
