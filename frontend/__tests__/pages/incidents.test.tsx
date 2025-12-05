import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import IncidentsPage from '@/app/incidents/page';

jest.mock('@/hooks', () => ({
  useAuth: () => ({
    isAuthenticated: true,
    user: { id: 'user-123', email: 'test@example.com' },
  }),
  useIncidents: () => ({
    getIncidents: jest.fn().mockResolvedValue([
      {
        id: 'incident-1',
        session_id: 'session-123',
        severity: 'critical',
        status: 'open',
        description: 'Suspicious video detected',
        created_at: '2025-12-03T10:00:00Z',
      },
      {
        id: 'incident-2',
        session_id: 'session-124',
        severity: 'high',
        status: 'investigating',
        description: 'Deepfake audio suspected',
        created_at: '2025-12-02T10:00:00Z',
      },
    ]),
    getIncident: jest.fn(),
    updateIncident: jest.fn(),
    escalateIncident: jest.fn(),
  }),
}));

jest.mock('@/components', () => ({
  IncidentList: ({ incidents, onSelectIncident }: any) => (
    <div>
      {incidents.map((incident: any) => (
        <button key={incident.id} onClick={() => onSelectIncident(incident)}>
          {incident.description}
        </button>
      ))}
    </div>
  ),
  IncidentDetails: ({ incident, onClose }: any) => (
    <div>
      {incident ? (
        <>
          <h2>{incident.description}</h2>
          <button onClick={onClose}>Close</button>
        </>
      ) : (
        <p>Select an incident</p>
      )}
    </div>
  ),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('Incidents Page Integration', () => {
  describe('Page Rendering', () => {
    it('should render incidents page', () => {
      render(<IncidentsPage />);
      expect(screen.getByText(/Incident Management/i)).toBeInTheDocument();
    });

    it('should display statistics dashboard', async () => {
      render(<IncidentsPage />);
      await waitFor(() => {
        expect(screen.getByText(/Total Incidents/i)).toBeInTheDocument();
        expect(screen.getByText(/Open/i)).toBeInTheDocument();
        expect(screen.getByText(/Critical/i)).toBeInTheDocument();
        expect(screen.getByText(/Resolved/i)).toBeInTheDocument();
      });
    });
  });

  describe('Filtering', () => {
    it('should have status filter', () => {
      render(<IncidentsPage />);
      expect(screen.getByText(/Filter by Status/i)).toBeInTheDocument();
    });

    it('should have severity filter', () => {
      render(<IncidentsPage />);
      expect(screen.getByText(/Filter by Severity/i)).toBeInTheDocument();
    });

    it('should filter by status', async () => {
      render(<IncidentsPage />);
      const statusSelect = screen.getByDisplayValue(/all/i);
      fireEvent.change(statusSelect, { target: { value: 'open' } });
      await waitFor(() => {
        expect(statusSelect).toHaveValue('open');
      });
    });

    it('should filter by severity', async () => {
      render(<IncidentsPage />);
      const severitySelect = screen.getByDisplayValue(/severity/i);
      fireEvent.change(severitySelect, { target: { value: 'critical' } });
      await waitFor(() => {
        expect(severitySelect).toHaveValue('critical');
      });
    });
  });

  describe('Incident Display', () => {
    it('should display incident list', async () => {
      render(<IncidentsPage />);
      await waitFor(() => {
        expect(screen.getByText('Suspicious video detected')).toBeInTheDocument();
      });
    });

    it('should show incident details on selection', async () => {
      render(<IncidentsPage />);
      await waitFor(() => {
        const incidentButton = screen.getByText('Suspicious video detected');
        fireEvent.click(incidentButton);
      });
      expect(screen.getByText('Suspicious video detected')).toBeInTheDocument();
    });
  });

  describe('Statistics', () => {
    it('should display total incidents count', async () => {
      render(<IncidentsPage />);
      await waitFor(() => {
        expect(screen.getByText(/2/)).toBeInTheDocument();
      });
    });

    it('should display open incidents count', async () => {
      render(<IncidentsPage />);
      await waitFor(() => {
        expect(screen.getByText(/Open/i)).toBeInTheDocument();
      });
    });

    it('should display critical incidents count', async () => {
      render(<IncidentsPage />);
      await waitFor(() => {
        expect(screen.getByText(/Critical/i)).toBeInTheDocument();
      });
    });

    it('should display resolved incidents count', async () => {
      render(<IncidentsPage />);
      await waitFor(() => {
        expect(screen.getByText(/Resolved/i)).toBeInTheDocument();
      });
    });
  });

  describe('Dual-Column Layout', () => {
    it('should have list and details columns', () => {
      const { container } = render(<IncidentsPage />);
      const columns = container.querySelectorAll('[class*="lg:col-span"]');
      expect(columns.length).toBeGreaterThanOrEqual(2);
    });

    it('should show list on left', () => {
      render(<IncidentsPage />);
      expect(screen.getByText(/Incident List/i)).toBeInTheDocument();
    });

    it('should show details on right', () => {
      render(<IncidentsPage />);
      expect(screen.getByText(/Select an incident|Incident Details/i)).toBeInTheDocument();
    });
  });

  describe('Incident Actions', () => {
    it('should allow closing incident details', async () => {
      render(<IncidentsPage />);
      await waitFor(() => {
        const incidentButton = screen.getByText('Suspicious video detected');
        fireEvent.click(incidentButton);
      });
      const closeButton = screen.getByText('Close');
      fireEvent.click(closeButton);
      expect(screen.getByText(/Select an incident/i)).toBeInTheDocument();
    });
  });

  describe('Responsive Layout', () => {
    it('should have responsive grid', () => {
      const { container } = render(<IncidentsPage />);
      const grid = container.querySelector('[class*="grid"]');
      expect(grid).toHaveClass('grid-cols-1', 'lg:grid-cols-3');
    });
  });
});
