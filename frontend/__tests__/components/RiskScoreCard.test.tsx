import React from 'react';
import { render, screen } from '@testing-library/react';
import RiskScoreCard from '@/components/RiskScoreCard';

describe('RiskScoreCard Component', () => {
  const defaultProps = {
    score: 45,
    level: 'medium',
    voiceScore: 40,
    videoScore: 35,
    documentScore: 50,
    livenessScore: 45,
    scamScore: 55,
  };

  describe('Rendering', () => {
    it('should render the component', () => {
      render(<RiskScoreCard {...defaultProps} />);
      expect(screen.getByText('Risk Assessment')).toBeInTheDocument();
    });

    it('should display the risk score', () => {
      render(<RiskScoreCard {...defaultProps} />);
      expect(screen.getByText('45')).toBeInTheDocument();
    });

    it('should display the risk level', () => {
      render(<RiskScoreCard {...defaultProps} />);
      expect(screen.getByText(/medium/i)).toBeInTheDocument();
    });

    it('should display all component scores', () => {
      render(<RiskScoreCard {...defaultProps} />);
      expect(screen.getByText('40')).toBeInTheDocument(); // voiceScore
      expect(screen.getByText('35')).toBeInTheDocument(); // videoScore
      expect(screen.getByText('50')).toBeInTheDocument(); // documentScore
      expect(screen.getByText('45')).toBeInTheDocument(); // livenessScore
      expect(screen.getByText('55')).toBeInTheDocument(); // scamScore
    });
  });

  describe('Risk Level Styling', () => {
    it('should apply low risk styling', () => {
      const { container } = render(
        <RiskScoreCard {...defaultProps} score={15} level="low" />
      );
      expect(container.firstChild).toHaveClass('bg-green');
    });

    it('should apply medium risk styling', () => {
      const { container } = render(
        <RiskScoreCard {...defaultProps} score={40} level="medium" />
      );
      expect(container.firstChild).toHaveClass('bg-yellow');
    });

    it('should apply high risk styling', () => {
      const { container } = render(
        <RiskScoreCard {...defaultProps} score={70} level="high" />
      );
      expect(container.firstChild).toHaveClass('bg-orange');
    });

    it('should apply critical risk styling', () => {
      const { container } = render(
        <RiskScoreCard {...defaultProps} score={90} level="critical" />
      );
      expect(container.firstChild).toHaveClass('bg-red');
    });
  });

  describe('Score Ranges', () => {
    it('should handle zero score', () => {
      render(<RiskScoreCard {...defaultProps} score={0} level="low" />);
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('should handle maximum score', () => {
      render(<RiskScoreCard {...defaultProps} score={100} level="critical" />);
      expect(screen.getByText('100')).toBeInTheDocument();
    });

    it('should handle fractional scores', () => {
      render(
        <RiskScoreCard
          {...defaultProps}
          score={45.5}
          voiceScore={40.2}
          videoScore={35.7}
          documentScore={50.1}
          livenessScore={45.8}
          scamScore={55.3}
        />
      );
      expect(screen.getByText('45.5')).toBeInTheDocument();
    });
  });
});
