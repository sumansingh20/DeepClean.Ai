import { renderHook, act, waitFor } from '@testing-library/react';
import { useAuth } from '@/hooks';
import { apiClient } from '@/lib/apiClient';
import * as tokenStorage from '@/lib/tokenStorage';

// Mock API client and token storage
jest.mock('@/lib/apiClient');
jest.mock('@/lib/tokenStorage');

const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;
const mockTokenStorage = tokenStorage as jest.Mocked<typeof tokenStorage>;

describe('useAuth Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockTokenStorage.getToken.mockReturnValue(null);
    mockTokenStorage.getRefreshToken.mockReturnValue(null);
  });

  describe('Initial State', () => {
    it('should initialize with isAuthenticated as false when no token', () => {
      const { result } = renderHook(() => useAuth());
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
      expect(result.current.isLoading).toBe(false);
    });

    it('should initialize with user data when token exists', async () => {
      const mockUser = { id: '123', email: 'test@example.com', role: 'analyst' };
      mockTokenStorage.getToken.mockReturnValue('valid-token');
      mockApiClient.get.mockResolvedValue({
        data: { user: mockUser },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      });

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true);
        expect(result.current.user).toEqual(mockUser);
      });
    });
  });

  describe('Login Method', () => {
    it('should successfully login with valid credentials', async () => {
      const mockResponse = {
        data: {
          access_token: 'new-token',
          refresh_token: 'new-refresh-token',
          user: { id: '123', email: 'test@example.com', role: 'analyst' },
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      mockApiClient.post.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.login('test@example.com', 'password123');
      });

      expect(mockApiClient.post).toHaveBeenCalledWith('/auth/login', {
        email: 'test@example.com',
        password: 'password123',
      });
      expect(mockTokenStorage.setToken).toHaveBeenCalledWith('new-token');
      expect(mockTokenStorage.setRefreshToken).toHaveBeenCalledWith('new-refresh-token');
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('should handle login errors', async () => {
      mockApiClient.post.mockRejectedValue(new Error('Invalid credentials'));

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await expect(result.current.login('test@example.com', 'wrong-password')).rejects.toThrow();
      });

      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe('Logout Method', () => {
    it('should clear authentication state on logout', async () => {
      mockTokenStorage.getToken.mockReturnValue('valid-token');
      mockApiClient.post.mockResolvedValue({
        data: { message: 'Logged out' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.logout();
      });

      expect(mockTokenStorage.removeToken).toHaveBeenCalled();
      expect(mockTokenStorage.removeRefreshToken).toHaveBeenCalled();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
    });
  });

  describe('Token Refresh', () => {
    it('should refresh token when expired', async () => {
      mockTokenStorage.getRefreshToken.mockReturnValue('refresh-token');
      mockApiClient.post.mockResolvedValue({
        data: { access_token: 'new-token' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.refreshToken();
      });

      expect(mockApiClient.post).toHaveBeenCalledWith('/auth/refresh', {
        refresh_token: 'refresh-token',
      });
      expect(mockTokenStorage.setToken).toHaveBeenCalledWith('new-token');
    });
  });
});
