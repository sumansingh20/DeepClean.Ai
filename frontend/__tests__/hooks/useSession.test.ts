import { renderHook, act, waitFor } from '@testing-library/react';
import { useSession } from '@/hooks';
import { apiClient } from '@/lib/apiClient';

jest.mock('@/lib/apiClient');

const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe('useSession Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Create Session', () => {
    it('should create a new session successfully', async () => {
      const mockSession = {
        id: 'session-123',
        user_id: 'user-123',
        status: 'active',
        created_at: '2025-12-03T10:00:00Z',
        updated_at: '2025-12-03T10:00:00Z',
      };

      mockApiClient.post.mockResolvedValue({
        data: mockSession,
        status: 201,
        statusText: 'Created',
        headers: {},
        config: {} as any,
      });

      const { result } = renderHook(() => useSession());

      await act(async () => {
        const session = await result.current.createSession();
        expect(session).toEqual(mockSession);
      });

      expect(result.current.session).toEqual(mockSession);
      expect(result.current.isLoading).toBe(false);
    });

    it('should handle session creation errors', async () => {
      mockApiClient.post.mockRejectedValue(new Error('Server error'));

      const { result } = renderHook(() => useSession());

      await act(async () => {
        await expect(result.current.createSession()).rejects.toThrow();
      });

      expect(result.current.session).toBeNull();
    });
  });

  describe('Get Session', () => {
    it('should fetch existing session', async () => {
      const mockSession = {
        id: 'session-123',
        status: 'complete',
        results: { fusion_score: 45 },
      };

      mockApiClient.get.mockResolvedValue({
        data: mockSession,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      });

      const { result } = renderHook(() => useSession());

      await act(async () => {
        const session = await result.current.getSession('session-123');
        expect(session).toEqual(mockSession);
      });

      expect(mockApiClient.get).toHaveBeenCalledWith('/sessions/session-123');
    });
  });

  describe('Update Session', () => {
    it('should update session successfully', async () => {
      const updatedSession = {
        id: 'session-123',
        status: 'updated',
      };

      mockApiClient.put.mockResolvedValue({
        data: updatedSession,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      });

      const { result } = renderHook(() => useSession());

      await act(async () => {
        const session = await result.current.updateSession('session-123', { status: 'updated' });
        expect(session).toEqual(updatedSession);
      });

      expect(mockApiClient.put).toHaveBeenCalledWith('/sessions/session-123', {
        status: 'updated',
      });
    });
  });

  describe('Loading State', () => {
    it('should manage loading state during operations', async () => {
      mockApiClient.post.mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  data: { id: 'session-123' },
                  status: 201,
                  statusText: 'Created',
                  headers: {},
                  config: {} as any,
                }),
              100
            )
          )
      );

      const { result } = renderHook(() => useSession());

      expect(result.current.isLoading).toBe(false);

      let createPromise;
      await act(async () => {
        createPromise = result.current.createSession();
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });
  });
});
