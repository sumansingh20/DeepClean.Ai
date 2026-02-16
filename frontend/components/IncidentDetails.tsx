'use client';

import React, { useState } from 'react';

export interface IncidentDetail {
  id: string;
  session_id: string;
  title: string;
  description: string;
  status: 'open' | 'investigating' | 'escalated' | 'resolved';
  severity: 'low' | 'medium' | 'high' | 'critical';
  created_at: string;
  updated_at: string;
  details?: {
    evidence?: string[];
    timeline?: { timestamp: string; event: string }[];
    assignee?: string;
    notes?: string;
  };
}

interface IncidentDetailsProps {
  incident: IncidentDetail | null;
  onClose: () => void;
  onUpdateStatus?: (incidentId: string, newStatus: string) => void;
  onEscalate?: (incidentId: string) => void;
}

export const IncidentDetails: React.FC<IncidentDetailsProps> = ({
  incident,
  onClose,
  onUpdateStatus,
  onEscalate,
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState(incident?.status || 'open');

  if (!incident) return null;

  const handleStatusChange = async () => {
    if (onUpdateStatus && newStatus !== incident.status) {
      setIsUpdating(true);
      try {
        await onUpdateStatus(incident.id, newStatus);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleEscalate = async () => {
    if (onEscalate) {
      setIsUpdating(true);
      try {
        await onEscalate(incident.id);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case 'low':
        return 'bg-green-100 border-green-300 text-green-800';
      case 'medium':
        return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'high':
        return 'bg-orange-100 border-orange-300 text-orange-800';
      case 'critical':
        return 'bg-red-100 border-red-300 text-red-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-lg p-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 pb-6 border-b border-gray-200">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{incident.title}</h2>
          <p className="text-sm text-gray-600">ID: {incident.id}</p>
          <p className="text-sm text-gray-600">Session: {incident.session_id}</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-2xl"
        >
          ✕
        </button>
      </div>

      {/* Status and Severity */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Current Status</label>
          <select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value as 'open' | 'investigating' | 'escalated' | 'resolved')}
            aria-label="Incident status"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          >
            <option value="open">Open</option>
            <option value="investigating">Investigating</option>
            <option value="escalated">Escalated</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Severity</label>
          <div className={`${getSeverityColor(incident.severity)} border-2 rounded px-3 py-2 text-center font-semibold text-sm`}>
            {incident.severity.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
        <p className="text-gray-700 text-sm leading-relaxed">{incident.description}</p>
      </div>

      {/* Timeline */}
      {incident.details?.timeline && incident.details.timeline.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Timeline</h3>
          <div className="space-y-3">
            {incident.details.timeline.map((entry, idx) => (
              <div key={idx} className="flex gap-3">
                <div className="flex-shrink-0 w-2 h-2 bg-indigo-600 rounded-full mt-2" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{entry.event}</p>
                  <p className="text-xs text-gray-500">{new Date(entry.timestamp).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Evidence */}
      {incident.details?.evidence && incident.details.evidence.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Evidence</h3>
          <ul className="space-y-2">
            {incident.details.evidence.map((item, idx) => (
              <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                <span className="text-indigo-600">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Notes */}
      {incident.details?.notes && (
        <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Notes</h3>
          <p className="text-sm text-gray-700">{incident.details.notes}</p>
        </div>
      )}

      {/* Timestamps */}
      <div className="text-xs text-gray-500 mb-6 pb-6 border-b border-gray-200">
        <p>Created: {new Date(incident.created_at).toLocaleString()}</p>
        <p>Updated: {new Date(incident.updated_at).toLocaleString()}</p>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        {newStatus !== incident.status && (
          <button
            onClick={handleStatusChange}
            disabled={isUpdating}
            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50 transition font-medium text-sm"
          >
            {isUpdating ? 'Updating...' : 'Update Status'}
          </button>
        )}
        {incident.status !== 'escalated' && (
          <button
            onClick={handleEscalate}
            disabled={isUpdating}
            className="flex-1 px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-50 transition font-medium text-sm"
          >
            {isUpdating ? 'Escalating...' : 'Escalate'}
          </button>
        )}
        <button
          onClick={onClose}
          className="px-6 py-2 bg-gray-300 text-gray-900 rounded hover:bg-gray-400 transition font-medium text-sm"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default IncidentDetails;
