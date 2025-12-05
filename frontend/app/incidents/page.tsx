'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks';
import { useRouter } from 'next/navigation';
import IncidentList, { Incident } from '@/components/IncidentList';
import IncidentDetails, { IncidentDetail } from '@/components/IncidentDetails';

export default function IncidentsPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<IncidentDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'investigating' | 'escalated' | 'resolved'>('all');
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'low' | 'medium' | 'high' | 'critical'>('all');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    loadIncidents();
  }, [isAuthenticated, router, filterStatus, filterSeverity]);

  const loadIncidents = async () => {
    setIsLoading(true);
    try {
      // Mock data - replace with actual API call
      const mockIncidents: Incident[] = [
        {
          id: 'INC001',
          session_id: 'sess_123456',
          title: 'Suspicious Voice Pattern Detected',
          description: 'AI detected deepfake indicators in voice sample. Audio analysis shows unusual frequency patterns.',
          status: 'investigating',
          severity: 'high',
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 'INC002',
          session_id: 'sess_654321',
          title: 'Document Authenticity Failed',
          description: 'Document verification system flagged potential forgery. Image artifacts detected.',
          status: 'open',
          severity: 'critical',
          created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 'INC003',
          session_id: 'sess_789012',
          title: 'Liveness Check Failed',
          description: 'Biometric liveness check failed multiple times. Possible video replay attack detected.',
          status: 'escalated',
          severity: 'critical',
          created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 'INC004',
          session_id: 'sess_345678',
          title: 'Video Analysis Anomaly',
          description: 'Facial recognition detected potential deepfake markers. Further review recommended.',
          status: 'resolved',
          severity: 'medium',
          created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ];

      // Apply filters
      let filtered = mockIncidents;
      if (filterStatus !== 'all') {
        filtered = filtered.filter((i) => i.status === filterStatus);
      }
      if (filterSeverity !== 'all') {
        filtered = filtered.filter((i) => i.severity === filterSeverity);
      }

      setIncidents(filtered);
    } catch (error) {
      console.error('Failed to load incidents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectIncident = (incident: Incident) => {
    // In a real app, fetch full details from API
    const detailedIncident: IncidentDetail = {
      ...incident,
      details: {
        evidence:
          incident.severity === 'critical'
            ? [
                'Audio frequency analysis shows unnatural patterns',
                'Document metadata mismatch detected',
                'Facial recognition confidence below threshold',
              ]
            : ['Pattern anomaly in analysis data'],
        timeline: [
          {
            timestamp: incident.created_at,
            event: 'Incident created - Detection triggered',
          },
          {
            timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
            event: 'Analysis completed',
          },
          {
            timestamp: new Date().toISOString(),
            event: 'Current status',
          },
        ],
        notes:
          incident.severity === 'critical'
            ? 'Requires immediate human review. Multiple detection systems flagged this submission.'
            : 'Standard review process in progress.',
      },
    };
    setSelectedIncident(detailedIncident);
  };

  const handleUpdateStatus = async (incidentId: string, newStatus: string) => {
    // In a real app, call API to update
    setIncidents((prev) =>
      prev.map((i) =>
        i.id === incidentId
          ? {
              ...i,
              status: newStatus as any,
              updated_at: new Date().toISOString(),
            }
          : i
      )
    );
    if (selectedIncident) {
      setSelectedIncident({
        ...selectedIncident,
        status: newStatus as any,
        updated_at: new Date().toISOString(),
      });
    }
  };

  const handleEscalate = async (incidentId: string) => {
    await handleUpdateStatus(incidentId, 'escalated');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Incident Management</h1>
          <p className="text-gray-600">Monitor and manage detection alerts and incidents</p>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Filter by Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              aria-label="Filter incidents by status"
            >
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="investigating">Investigating</option>
              <option value="escalated">Escalated</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Filter by Severity</label>
            <select
              value={filterSeverity}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterSeverity(e.target.value as any)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              aria-label="Filter incidents by severity"
            >
              <option value="all">All Severities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-sm text-gray-600 mb-1">Total Incidents</p>
            <p className="text-2xl font-bold text-gray-900">{incidents.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-sm text-gray-600 mb-1">Open</p>
            <p className="text-2xl font-bold text-blue-600">{incidents.filter((i) => i.status === 'open').length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-sm text-gray-600 mb-1">Critical</p>
            <p className="text-2xl font-bold text-red-600">{incidents.filter((i) => i.severity === 'critical').length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-sm text-gray-600 mb-1">Resolved</p>
            <p className="text-2xl font-bold text-green-600">{incidents.filter((i) => i.status === 'resolved').length}</p>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Incident List */}
          <div className="lg:col-span-2">
            <IncidentList incidents={incidents} onSelectIncident={handleSelectIncident} isLoading={isLoading} />
          </div>

          {/* Incident Details */}
          <div>
            {selectedIncident ? (
              <IncidentDetails
                incident={selectedIncident}
                onClose={() => setSelectedIncident(null)}
                onUpdateStatus={handleUpdateStatus}
                onEscalate={handleEscalate}
              />
            ) : (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-gray-600 mb-4">Select an incident to view details</p>
                <p className="text-sm text-gray-500">Click on any incident from the list</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
