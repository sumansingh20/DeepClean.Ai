'use client';

import { useState, useCallback } from 'react';
import apiClient from '@/lib/apiClient';
import type { Session } from '@/lib/types';

export const useSession = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSession = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.createSession();
      const newSession: Session = response.data;
      setSession(newSession);
      return newSession;
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Failed to create session';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getSession = useCallback(
    async (sessionId: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await apiClient.getSession(sessionId);
        const sessionData: Session = response.data;
        setSession(sessionData);
        return sessionData;
      } catch (err: any) {
        const message = err.response?.data?.detail || 'Failed to get session';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const listSessions = useCallback(
    async (limit = 10, offset = 0, status?: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await apiClient.listSessions(limit, offset, status);
        const sessionList: Session[] = response.data.items;
        setSessions(sessionList);
        return { items: sessionList, total: response.data.total };
      } catch (err: any) {
        const message = err.response?.data?.detail || 'Failed to list sessions';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const deleteSession = useCallback(
    async (sessionId: string) => {
      setIsLoading(true);
      setError(null);

      try {
        await apiClient.deleteSession(sessionId);
        setSessions((prev: Session[]) => prev.filter((s: Session) => s.id !== sessionId));
        if (session?.id === sessionId) {
          setSession(null);
        }
      } catch (err: any) {
        const message = err.response?.data?.detail || 'Failed to delete session';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [session]
  );

  const cancelSession = useCallback(
    async (sessionId: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await apiClient.cancelSession(sessionId);
        const updatedSession: Session = response.data;
        setSession(updatedSession);
        setSessions((prev: Session[]) =>
          prev.map((s: Session) => (s.id === sessionId ? updatedSession : s))
        );
        return updatedSession;
      } catch (err: any) {
        const message = err.response?.data?.detail || 'Failed to cancel session';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    session,
    sessions,
    isLoading,
    error,
    createSession,
    getSession,
    listSessions,
    deleteSession,
    cancelSession,
  };
};
