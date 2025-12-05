'use client';

import { useState, useCallback, useEffect } from 'react';
import apiClient from '@/lib/apiClient';
import { getToken, setToken, removeToken, getStoredUser, setStoredUser } from '@/lib/tokenStorage';
import type { User, AuthResponse } from '@/lib/types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load user from storage on mount
  useEffect(() => {
    const storedUser = getStoredUser();
    const token = getToken();

    if (storedUser && token) {
      setUser(storedUser);
      setIsAuthenticated(true);
    }
  }, []);

  const register = useCallback(
    async (email: string, username: string, password: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await apiClient.register(email, username, password);
        const data: AuthResponse = response.data;

        setToken(data.access_token);
        setStoredUser(data.user);
        setUser(data.user);
        setIsAuthenticated(true);

        return data;
      } catch (err: any) {
        const message = err.response?.data?.detail || 'Registration failed';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const login = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      setError(null);

      try {
        console.log('useAuth: Calling API login...');
        const response = await apiClient.login(email, password);
        console.log('useAuth: API response received', response);
        const data: AuthResponse = response.data;

        setToken(data.access_token);
        setStoredUser(data.user);
        setUser(data.user);
        setIsAuthenticated(true);

        return data;
      } catch (err: any) {
        console.error('useAuth: Login error', err);
        const message = err.response?.data?.detail || err.message || 'Login failed - cannot connect to server';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await apiClient.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      removeToken();
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  }, []);

  const getCurrentUser = useCallback(async () => {
    try {
      const response = await apiClient.getCurrentUser();
      const userData: User = response.data;
      setUser(userData);
      setStoredUser(userData);
      setIsAuthenticated(true);
      return userData;
    } catch (err: any) {
      setIsAuthenticated(false);
      setUser(null);
      throw err;
    }
  }, []);

  const updateProfile = useCallback(
    async (data: Partial<User>) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await apiClient.updateProfile(data);
        const updatedUser: User = response.data;
        setUser(updatedUser);
        setStoredUser(updatedUser);
        return updatedUser;
      } catch (err: any) {
        const message = err.response?.data?.detail || 'Update failed';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const requestPasswordReset = useCallback(
    async (email: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await apiClient.requestPasswordReset(email);
        return response.data;
      } catch (err: any) {
        const message = err.response?.data?.detail || 'Password reset request failed';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const resetPassword = useCallback(
    async (token: string, newPassword: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await apiClient.resetPassword(token, newPassword);
        return response.data;
      } catch (err: any) {
        const message = err.response?.data?.detail || 'Password reset failed';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    register,
    login,
    logout,
    getCurrentUser,
    updateProfile,
    requestPasswordReset,
    resetPassword,
  };
};
