import React from 'react';
import { render, screen } from '@testing-library/react';
import IncidentList from '@/components/IncidentList';

describe('IncidentList Component', () => {
  const mockIncidents = [
    {
      id: 'incident-1',
      session_id: 'session-123',
      severity: 'critical',
      status: 'open',
      description: 'Suspicious video detected',
      created_at: '2025-12-03T10:00:00Z',
      updated_at: '2025-12-03T10:00:00Z',
    },
    {
      id: 'incident-2',
      session_id: 'session-124',
      severity: 'medium',
      status: 'investigating',
      description: 'Potential deepfake audio',
      created_at: '2025-12-02T10:00:00Z',
      updated_at: '2025-12-02T10:00:00Z',
    },
  ];

  const defaultProps = {
    incidents: mockIncidents,
    onSelectIncident: jest.fn(),
    isLoading: false,
    onLoadMore: jest.fn(),
  };

  describe('Rendering', () => {
    it('should render incidents list', () => {
      render(<IncidentList {...defaultProps} />);
      expect(screen.getByText('Suspicious video detected')).toBeInTheDocument();
      expect(screen.getByText('Potential deepfake audio')).toBeInTheDocument();
    });

    it('should display incident IDs', () => {
      render(<IncidentList {...defaultProps} />);
      expect(screen.getByText(/incident-1/)).toBeInTheDocument();
      expect(screen.getByText(/incident-2/)).toBeInTheDocument();
    });

    it('should display severity badges', () => {
      render(<IncidentList {...defaultProps} />);
      expect(screen.getByText('🔴')).toBeInTheDocument(); // critical
      expect(screen.getByText('🟡')).toBeInTheDocument(); // medium
    });

    it('should display status badges', () => {
      render(<IncidentList {...defaultProps} />);
      expect(screen.getByText(/open/i)).toBeInTheDocument();
      expect(screen.getByText(/investigating/i)).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('should show empty state when no incidents', () => {
      render(<IncidentList {...defaultProps} incidents={[]} />);
      expect(screen.getByText(/no incidents/i)).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('should show loading indicator', () => {
      render(<IncidentList {...defaultProps} isLoading={true} />);
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });
  });

  describe('Pagination', () => {
    it('should show load more button', () => {
      render(<IncidentList {...defaultProps} />);
      const loadMoreButton = screen.getByText(/load more/i);
      expect(loadMoreButton).toBeInTheDocument();
    });

    it('should call onLoadMore callback', () => {
      const onLoadMore = jest.fn();
      render(<IncidentList {...defaultProps} onLoadMore={onLoadMore} />);
      const loadMoreButton = screen.getByText(/load more/i);
      loadMoreButton.click();
      expect(onLoadMore).toHaveBeenCalled();
    });
  });

  describe('Selection', () => {
    it('should call onSelectIncident when clicking incident', () => {
      const onSelectIncident = jest.fn();
      render(<IncidentList {...defaultProps} onSelectIncident={onSelectIncident} />);
      const incidentCard = screen.getByText('Suspicious video detected').closest('button');
      if (incidentCard) incidentCard.click();
      expect(onSelectIncident).toHaveBeenCalledWith(expect.objectContaining({ id: 'incident-1' }));
    });
  });

  describe('Severity Indicators', () => {
    it('should show correct icon for critical severity', () => {
      const criticalIncidents = [
        {
          ...mockIncidents[0],
          severity: 'critical',
        },
      ];
      render(<IncidentList {...defaultProps} incidents={criticalIncidents} />);
      expect(screen.getByText('🔴')).toBeInTheDocument();
    });

    it('should show correct icon for low severity', () => {
      const lowSeverityIncidents = [
        {
          ...mockIncidents[0],
          severity: 'low',
        },
      ];
      render(<IncidentList {...defaultProps} incidents={lowSeverityIncidents} />);
      expect(screen.getByText('🟢')).toBeInTheDocument();
    });
  });
});
