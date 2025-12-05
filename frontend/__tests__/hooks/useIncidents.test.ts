import { renderHook, act } from '@testing-library/react';
import { useIncidents } from '@/hooks';
import { apiClient } from '@/lib/apiClient';

jest.mock('@/lib/apiClient');

const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe('useIncidents Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Get Incidents', () => {
    it('should fetch incidents with filters', async () => {
      const mockIncidents = [
        {
          id: 'incident-1',
          session_id: 'session-123',
          severity: 'critical',
          status: 'open',
          created_at: '2025-12-03T10:00:00Z',
        },
        {
          id: 'incident-2',
          session_id: 'session-124',
          severity: 'high',
          status: 'investigating',
          created_at: '2025-12-02T10:00:00Z',
        },
      ];

      mockApiClient.get.mockResolvedValue({
        data: { incidents: mockIncidents, total: 2 },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      });

      const { result } = renderHook(() => useIncidents());

      let incidents;
      await act(async () => {
        incidents = await result.current.getIncidents({ status: 'open' });
      });

      expect(incidents).toEqual(mockIncidents);
      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/incidents?status=open',
        expect.any(Object)
      );
    });

    it('should fetch incidents by user', async () => {
      const mockIncidents = [
        {
          id: 'incident-1',
          user_id: 'user-123',
          severity: 'medium',
          status: 'resolved',
        },
      ];

      mockApiClient.get.mockResolvedValue({
        data: mockIncidents,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      });

      const { result } = renderHook(() => useIncidents());

      let incidents;
      await act(async () => {
        incidents = await result.current.getIncidentsByUser('user-123');
      });

      expect(incidents).toEqual(mockIncidents);
      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/incidents/user/user-123',
        expect.any(Object)
      );
    });
  });

  describe('Get Single Incident', () => {
    it('should fetch a specific incident', async () => {
      const mockIncident = {
        id: 'incident-1',
        session_id: 'session-123',
        severity: 'critical',
        status: 'open',
        description: 'Suspicious video detected',
        notes: 'Requires investigation',
        created_at: '2025-12-03T10:00:00Z',
      };

      mockApiClient.get.mockResolvedValue({
        data: mockIncident,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      });

      const { result } = renderHook(() => useIncidents());

      let incident;
      await act(async () => {
        incident = await result.current.getIncident('incident-1');
      });

      expect(incident).toEqual(mockIncident);
      expect(mockApiClient.get).toHaveBeenCalledWith('/incidents/incident-1', expect.any(Object));
    });
  });

  describe('Update Incident', () => {
    it('should update incident status', async () => {
      const updatedIncident = {
        id: 'incident-1',
        status: 'resolved',
        updated_at: '2025-12-03T11:00:00Z',
      };

      mockApiClient.put.mockResolvedValue({
        data: updatedIncident,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      });

      const { result } = renderHook(() => useIncidents());

      let incident;
      await act(async () => {
        incident = await result.current.updateIncident('incident-1', { status: 'resolved' });
      });

      expect(incident).toEqual(updatedIncident);
      expect(mockApiClient.put).toHaveBeenCalledWith('/incidents/incident-1', {
        status: 'resolved',
      });
    });

    it('should escalate incident', async () => {
      mockApiClient.post.mockResolvedValue({
        data: { message: 'Incident escalated' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      });

      const { result } = renderHook(() => useIncidents());

      await act(async () => {
        await result.current.escalateIncident('incident-1', 'Security team notified');
      });

      expect(mockApiClient.post).toHaveBeenCalledWith('/incidents/incident-1/escalate', {
        reason: 'Security team notified',
      });
    });
  });

  describe('Create Incident', () => {
    it('should create a new incident', async () => {
      const newIncident = {
        id: 'incident-new',
        session_id: 'session-125',
        severity: 'critical',
        status: 'open',
        created_at: '2025-12-03T12:00:00Z',
      };

      mockApiClient.post.mockResolvedValue({
        data: newIncident,
        status: 201,
        statusText: 'Created',
        headers: {},
        config: {} as any,
      });

      const { result } = renderHook(() => useIncidents());

      let incident;
      await act(async () => {
        incident = await result.current.createIncident({
          session_id: 'session-125',
          severity: 'critical',
        });
      });

      expect(incident).toEqual(newIncident);
      expect(mockApiClient.post).toHaveBeenCalledWith('/incidents', {
        session_id: 'session-125',
        severity: 'critical',
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle fetch errors gracefully', async () => {
      mockApiClient.get.mockRejectedValue(new Error('Server error'));

      const { result } = renderHook(() => useIncidents());

      await act(async () => {
        await expect(result.current.getIncidents()).rejects.toThrow();
      });
    });

    it('should handle update errors', async () => {
      mockApiClient.put.mockRejectedValue(new Error('Validation error'));

      const { result } = renderHook(() => useIncidents());

      await act(async () => {
        await expect(
          result.current.updateIncident('incident-1', { status: 'invalid' })
        ).rejects.toThrow();
      });
    });
  });
});
