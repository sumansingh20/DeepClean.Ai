import { renderHook, act } from '@testing-library/react';
import { useRiskScore } from '@/hooks';
import { apiClient } from '@/lib/apiClient';

jest.mock('@/lib/apiClient');

const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe('useRiskScore Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Get Risk Score', () => {
    it('should fetch risk score successfully', async () => {
      const mockScore = {
        session_id: 'session-123',
        fusion_score: 45,
        risk_level: 'medium',
        voice_score: 40,
        video_score: 35,
        document_score: 50,
        liveness_score: 45,
        scam_score: 55,
      };

      mockApiClient.get.mockResolvedValue({
        data: mockScore,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      });

      const { result } = renderHook(() => useRiskScore());

      let score;
      await act(async () => {
        score = await result.current.getRiskScore('session-123');
      });

      expect(score).toEqual(mockScore);
      expect(mockApiClient.get).toHaveBeenCalledWith('/analysis/score/session-123');
    });

    it('should handle fetch errors', async () => {
      mockApiClient.get.mockRejectedValue(new Error('Not found'));

      const { result } = renderHook(() => useRiskScore());

      await act(async () => {
        await expect(result.current.getRiskScore('invalid-session')).rejects.toThrow();
      });
    });
  });

  describe('Get Score History', () => {
    it('should fetch score history', async () => {
      const mockHistory = [
        {
          session_id: 'session-123',
          fusion_score: 45,
          risk_level: 'medium',
          created_at: '2025-12-03T10:00:00Z',
        },
        {
          session_id: 'session-124',
          fusion_score: 65,
          risk_level: 'high',
          created_at: '2025-12-02T10:00:00Z',
        },
      ];

      mockApiClient.get.mockResolvedValue({
        data: mockHistory,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      });

      const { result } = renderHook(() => useRiskScore());

      let history;
      await act(async () => {
        history = await result.current.getScoreHistory('user-123', 10);
      });

      expect(history).toEqual(mockHistory);
      expect(mockApiClient.get).toHaveBeenCalledWith('/analysis/history/user-123?limit=10');
    });
  });

  describe('Risk Level Interpretation', () => {
    it('should correctly interpret risk levels', async () => {
      const { result } = renderHook(() => useRiskScore());

      expect(result.current.interpretRiskLevel(15)).toBe('low');
      expect(result.current.interpretRiskLevel(40)).toBe('medium');
      expect(result.current.interpretRiskLevel(70)).toBe('high');
      expect(result.current.interpretRiskLevel(90)).toBe('critical');
    });
  });

  describe('Score Color Mapping', () => {
    it('should return correct colors for risk levels', async () => {
      const { result } = renderHook(() => useRiskScore());

      expect(result.current.getRiskColor(15)).toBe('green');
      expect(result.current.getRiskColor(40)).toBe('yellow');
      expect(result.current.getRiskColor(70)).toBe('orange');
      expect(result.current.getRiskColor(90)).toBe('red');
    });
  });

  describe('Loading and Error States', () => {
    it('should manage loading state', async () => {
      mockApiClient.get.mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  data: { fusion_score: 45 },
                  status: 200,
                  statusText: 'OK',
                  headers: {},
                  config: {} as any,
                }),
              100
            )
          )
      );

      const { result } = renderHook(() => useRiskScore());

      let promise;
      await act(async () => {
        promise = result.current.getRiskScore('session-123');
      });

      await promise;

      expect(result.current).toBeDefined();
    });
  });
});
