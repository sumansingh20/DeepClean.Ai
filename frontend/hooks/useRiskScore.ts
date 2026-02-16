'use client';

import { useState, useCallback } from 'react';
import apiClient from '@/lib/apiClient';
import type { RiskScore } from '@/lib/types';

export const useRiskScore = () => {
  const [riskScore, setRiskScore] = useState<RiskScore | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateRiskScore = useCallback(
    async (sessionId: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await apiClient.calculateRiskScore(sessionId);
        const score: RiskScore = response.data;
        setRiskScore(score);
        return score;
      } catch (err: any) {
        const message = err.response?.data?.detail || 'Failed to calculate risk score';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const getRiskScore = useCallback(
    async (sessionId: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await apiClient.getRiskScore(sessionId);
        const score: RiskScore = response.data;
        setRiskScore(score);
        return score;
      } catch (err: any) {
        const message = err.response?.data?.detail || 'Failed to get risk score';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    riskScore,
    isLoading,
    error,
    calculateRiskScore,
    getRiskScore,
  };
};
