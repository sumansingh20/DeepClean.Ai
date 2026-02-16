'use client';

import React, { useState } from 'react';

export interface Incident {
  id: string;
  session_id: string;
  title: string;
  description: string;
  status: 'open' | 'investigating' | 'escalated' | 'resolved';
  severity: 'low' | 'medium' | 'high' | 'critical';
  created_at: string;
  updated_at: string;
}

interface IncidentListProps {
  incidents: Incident[];
  onSelectIncident: (incident: Incident) => void;
  isLoading?: boolean;
  onLoadMore?: () => void;
}

export const IncidentList: React.FC<IncidentListProps> = ({
  incidents,
  onSelectIncident,
  isLoading = false,
  onLoadMore,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-800';
      case 'investigating':
        return 'bg-yellow-100 text-yellow-800';
      case 'escalated':
        return 'bg-orange-100 text-orange-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case 'low':
        return 'text-green-600';
      case 'medium':
        return 'text-yellow-600';
      case 'high':
        return 'text-orange-600';
      case 'critical':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getSeverityIcon = (severity: string): string => {
    switch (severity) {
      case 'low':
        return '🟢';
      case 'medium':
        return '🟡';
      case 'high':
        return '🟠';
      case 'critical':
        return '🔴';
      default:
        return '⚪';
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
      {incidents.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          <p className="text-lg font-medium">No incidents found</p>
          <p className="text-sm mt-2">All systems operating normally</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {incidents.map((incident) => (
            <div
              key={incident.id}
              onClick={() => {
                setSelectedId(incident.id);
                onSelectIncident(incident);
              }}
              className={`p-4 hover:bg-gray-50 cursor-pointer transition border-l-4 ${
                selectedId === incident.id
                  ? 'bg-indigo-50 border-l-indigo-600'
                  : 'border-l-transparent hover:border-l-gray-300'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <span>{getSeverityIcon(incident.severity)}</span>
                    {incident.title}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">{incident.description}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex gap-2">
                  <span className={`inline-block px-2 py-1 rounded font-medium ${getStatusColor(incident.status)}`}>
                    {incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
                  </span>
                  <span className={`inline-block px-2 py-1 font-medium ${getSeverityColor(incident.severity)}`}>
                    {incident.severity.toUpperCase()}
                  </span>
                </div>
                <div className="text-gray-500">
                  <p>{new Date(incident.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              {incident.session_id && (
                <p className="text-xs text-gray-500 mt-2">Session: {incident.session_id.slice(0, 12)}...</p>
              )}
            </div>
          ))}
        </div>
      )}

      {onLoadMore && !isLoading && incidents.length > 0 && (
        <div className="p-4 border-t border-gray-200 text-center">
          <button
            onClick={onLoadMore}
            className="px-4 py-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Load More
          </button>
        </div>
      )}

      {isLoading && (
        <div className="p-4 border-t border-gray-200 text-center">
          <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600" />
          <p className="text-sm text-gray-600 ml-2 inline">Loading...</p>
        </div>
      )}
    </div>
  );
};

export default IncidentList;
