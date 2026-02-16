import { useState, useCallback } from 'react';
import {
  generateReport,
  downloadReport,
  getReportStatus,
  listReports,
  deleteReport,
  type ReportFormat,
  type ReportGenerationParams,
  type ReportResponse,
} from '@/lib/reportClient';

interface ReportState {
  reports: ReportResponse[];
  currentReport: ReportResponse | null;
  isLoading: boolean;
  error: string | null;
  progress: number;
}

/**
 * Hook for managing report generation and downloads
 */
export function useReport() {
  const [state, setState] = useState<ReportState>({
    reports: [],
    currentReport: null,
    isLoading: false,
    error: null,
    progress: 0,
  });

  /**
   * Generate a new report
   */
  const generate = useCallback(async (params: ReportGenerationParams) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null, progress: 0 }));

    try {
      const report = await generateReport(params);
      setState((prev) => ({
        ...prev,
        currentReport: report,
        isLoading: false,
        progress: 100,
      }));
      return report;
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Report generation failed';
      setState((prev) => ({ ...prev, isLoading: false, error }));
      throw err;
    }
  }, []);

  /**
   * Download generated report
   */
  const download = useCallback(async (reportId: string, fileName: string, format: ReportFormat) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      await downloadReport(reportId, fileName, format);
      setState((prev) => ({ ...prev, isLoading: false }));
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Download failed';
      setState((prev) => ({ ...prev, isLoading: false, error }));
      throw err;
    }
  }, []);

  /**
   * Check report generation status
   */
  const checkStatus = useCallback(async (reportId: string) => {
    try {
      const status = await getReportStatus(reportId);
      setState((prev) => ({ ...prev, progress: status.progress }));
      return status;
    } catch (err) {
      console.error('Failed to check report status:', err);
      throw err;
    }
  }, []);

  /**
   * Fetch user's reports list
   */
  const fetchReports = useCallback(
    async (filters?: {
      format?: ReportFormat;
      startDate?: string;
      endDate?: string;
      limit?: number;
      offset?: number;
    }) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const result = await listReports(filters);
        setState((prev) => ({
          ...prev,
          reports: result.reports,
          isLoading: false,
        }));
        return result;
      } catch (err) {
        const error = err instanceof Error ? err.message : 'Failed to fetch reports';
        setState((prev) => ({ ...prev, isLoading: false, error }));
        throw err;
      }
    },
    []
  );

  /**
   * Delete a report
   */
  const delete_ = useCallback(async (reportId: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      await deleteReport(reportId);
      setState((prev) => ({
        ...prev,
        reports: prev.reports.filter((r) => r.reportId !== reportId),
        isLoading: false,
      }));
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Delete failed';
      setState((prev) => ({ ...prev, isLoading: false, error }));
      throw err;
    }
  }, []);

  /**
   * Clear current report
   */
  const clearCurrent = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentReport: null,
      progress: 0,
      error: null,
    }));
  }, []);

  /**
   * Clear error message
   */
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    // State
    reports: state.reports,
    currentReport: state.currentReport,
    isLoading: state.isLoading,
    error: state.error,
    progress: state.progress,

    // Methods
    generate,
    download,
    checkStatus,
    fetchReports,
    delete: delete_,
    clearCurrent,
    clearError,
  };
}
