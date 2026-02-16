'use client';

import { useState, useCallback } from 'react';
import apiClient from '@/lib/apiClient';
import type { Incident } from '@/lib/types';

export const useIncidents = () => {
  const [incident, setIncident] = useState<Incident | null>(null);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createIncident = useCallback(
    async (sessionId: string, title: string, description: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await apiClient.createIncident(sessionId, title, description);
        const newIncident: Incident = response.data;
        setIncident(newIncident);
        return newIncident;
      } catch (err: any) {
        const message = err.response?.data?.detail || 'Failed to create incident';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const getIncident = useCallback(
    async (incidentId: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await apiClient.getIncident(incidentId);
        const incidentData: Incident = response.data;
        setIncident(incidentData);
        return incidentData;
      } catch (err: any) {
        const message = err.response?.data?.detail || 'Failed to get incident';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const listIncidents = useCallback(
    async (limit = 10, offset = 0, status?: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await apiClient.listIncidents(limit, offset, status);
        const incidentList: Incident[] = response.data.items;
        setIncidents(incidentList);
        return { items: incidentList, total: response.data.total };
      } catch (err: any) {
        const message = err.response?.data?.detail || 'Failed to list incidents';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const updateIncident = useCallback(
    async (incidentId: string, data: Partial<Incident>) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await apiClient.updateIncident(incidentId, data);
        const updatedIncident: Incident = response.data;
        setIncident(updatedIncident);
        setIncidents((prev: Incident[]) =>
          prev.map((inc: Incident) => (inc.id === incidentId ? updatedIncident : inc))
        );
        return updatedIncident;
      } catch (err: any) {
        const message = err.response?.data?.detail || 'Failed to update incident';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const escalateIncident = useCallback(
    async (incidentId: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await apiClient.escalateIncident(incidentId);
        const escalatedIncident: Incident = response.data;
        setIncident(escalatedIncident);
        setIncidents((prev: Incident[]) =>
          prev.map((inc: Incident) => (inc.id === incidentId ? escalatedIncident : inc))
        );
        return escalatedIncident;
      } catch (err: any) {
        const message = err.response?.data?.detail || 'Failed to escalate incident';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    incident,
    incidents,
    isLoading,
    error,
    createIncident,
    getIncident,
    listIncidents,
    updateIncident,
    escalateIncident,
  };
};
