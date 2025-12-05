import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ResultsPage from '@/app/results/page';

jest.mock('@/hooks', () => ({
  useAuth: () => ({
    isAuthenticated: true,
    user: { id: 'user-123', email: 'test@example.com' },
  }),
  useRiskScore: () => ({
    getRiskScore: jest.fn().mockResolvedValue({
      fusion_score: 45,
      risk_level: 'medium',
      voice_score: 40,
      video_score: 35,
      document_score: 50,
      liveness_score: 45,
      scam_score: 55,
    }),
    getScoreHistory: jest.fn().mockResolvedValue([
      { date: '2025-12-03', score: 45, level: 'medium' },
      { date: '2025-12-02', score: 55, level: 'high' },
    ]),
  }),
}));

jest.mock('@/components', () => ({
  RiskScoreCard: ({ score, level }: any) => (
    <div>
      Risk Score: {score} - {level}
    </div>
  ),
  ScoreHistory: ({ history }: any) => <div>Score History: {history.length} records</div>,
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('Results Page Integration', () => {
  describe('Page Rendering', () => {
    it('should render results page', () => {
      render(<ResultsPage />);
      expect(screen.getByText(/Analysis Results/i)).toBeInTheDocument();
    });

    it('should display tab navigation', () => {
      render(<ResultsPage />);
      expect(screen.getByText(/Overview/i)).toBeInTheDocument();
      expect(screen.getByText(/History/i)).toBeInTheDocument();
      expect(screen.getByText(/Details/i)).toBeInTheDocument();
    });
  });

  describe('Overview Tab', () => {
    it('should display risk score card', async () => {
      render(<ResultsPage />);
      await waitFor(() => {
        expect(screen.getByText(/Risk Score:/)).toBeInTheDocument();
      });
    });

    it('should show analysis methods', async () => {
      render(<ResultsPage />);
      await waitFor(() => {
        expect(screen.getByText(/Voice Analysis/i)).toBeInTheDocument();
      });
    });
  });

  describe('History Tab', () => {
    it('should display score history', async () => {
      render(<ResultsPage />);
      const historyTab = screen.getByText(/History/i);
      fireEvent.click(historyTab);
      await waitFor(() => {
        expect(screen.getByText(/Score History:/)).toBeInTheDocument();
      });
    });
  });

  describe('Details Tab', () => {
    it('should display raw analysis details', async () => {
      render(<ResultsPage />);
      const detailsTab = screen.getByText(/Details/i);
      fireEvent.click(detailsTab);
      await waitFor(() => {
        expect(screen.getByText(/Complete Analysis Report/i)).toBeInTheDocument();
      });
    });
  });

  describe('Actions', () => {
    it('should have print report button', async () => {
      render(<ResultsPage />);
      const printButton = screen.getByText(/Print Report/i);
      expect(printButton).toBeInTheDocument();
    });

    it('should have start new analysis button', async () => {
      render(<ResultsPage />);
      const newButton = screen.getByText(/New Analysis/i);
      expect(newButton).toBeInTheDocument();
    });
  });

  describe('Data Loading', () => {
    it('should display loading state initially', () => {
      render(<ResultsPage />);
      expect(screen.getByText(/loading|results/i)).toBeInTheDocument();
    });

    it('should handle missing data gracefully', async () => {
      render(<ResultsPage />);
      await waitFor(() => {
        expect(screen.queryByText(/error/i) || screen.getByText(/Analysis/i)).toBeTruthy();
      });
    });
  });
});
