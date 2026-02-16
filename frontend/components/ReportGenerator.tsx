'use client';

import React, { useState } from 'react';
import { useReport } from '@/hooks';
import type { ReportGenerationParams, ReportFormat } from '@/lib/reportClient';

interface ReportGeneratorProps {
  sessionId?: string;
  onReportGenerated?: (reportId: string) => void;
  onError?: (error: string) => void;
}

export default function ReportGenerator({
  sessionId,
  onReportGenerated,
  onError,
}: ReportGeneratorProps): React.ReactElement {
  const { isLoading, error, progress, generate } = useReport();
  const [format, setFormat] = useState<ReportFormat>('pdf');
  const [includeDetails, setIncludeDetails] = useState(true);
  const [includeHistory, setIncludeHistory] = useState(true);
  const [includeCharts, setIncludeCharts] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [severity, setSeverity] = useState('all');

  const handleGenerateReport = async () => {
    try {
      const params: ReportGenerationParams = {
        format,
        sessionId,
        includeDetails,
        includeHistory,
        includeCharts: includeCharts && format !== 'json',
        filters: {
          severity: severity !== 'all' ? severity : undefined,
        },
      };

      if (startDate || endDate) {
        params.dateRange = {
          startDate: startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          endDate: endDate || new Date().toISOString().split('T')[0],
        };
      }

      const report = await generate(params);
      onReportGenerated?.(report.reportId);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate report';
      onError?.(message);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Generate Report</h2>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">Error: {error}</p>
        </div>
      )}

      {/* Format Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Report Format</label>
        <div className="space-y-2">
          {(['pdf', 'json', 'html'] as ReportFormat[]).map((fmt) => (
            <label key={fmt} className="flex items-center">
              <input
                type="radio"
                name="format"
                value={fmt}
                checked={format === fmt}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormat(e.target.value as ReportFormat)}
                disabled={isLoading}
                className="rounded border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700 capitalize">
                {fmt === 'pdf' ? '📄 PDF' : fmt === 'json' ? '📋 JSON' : '🌐 HTML'}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Date Range */}
      <div className="mb-6 grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Severity Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Severity</label>
        <select
          value={severity}
          onChange={(e) => setSeverity(e.target.value)}
          disabled={isLoading}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Levels</option>
          <option value="low">🟢 Low</option>
          <option value="medium">🟡 Medium</option>
          <option value="high">🟠 High</option>
          <option value="critical">🔴 Critical</option>
        </select>
      </div>

      {/* Options */}
      <div className="mb-6 space-y-3">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={includeDetails}
            onChange={(e) => setIncludeDetails(e.target.checked)}
            disabled={isLoading}
            className="rounded border-gray-300"
          />
          <span className="ml-2 text-sm text-gray-700">Include detailed findings</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={includeHistory}
            onChange={(e) => setIncludeHistory(e.target.checked)}
            disabled={isLoading}
            className="rounded border-gray-300"
          />
          <span className="ml-2 text-sm text-gray-700">Include analysis history</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={includeCharts}
            onChange={(e) => setIncludeCharts(e.target.checked)}
            disabled={isLoading || format === 'json'}
            className="rounded border-gray-300"
          />
          <span className="ml-2 text-sm text-gray-700">Include charts and visualizations</span>
          {format === 'json' && <span className="ml-2 text-xs text-gray-500">(N/A for JSON)</span>}
        </label>
      </div>

      {/* Progress Bar */}
      {isLoading && progress > 0 && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Generating report...</span>
            <span className="text-sm text-gray-500">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Generate Button */}
      <button
        onClick={handleGenerateReport}
        disabled={isLoading}
        className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition"
      >
        {isLoading ? (
          <>
            <span className="inline-block animate-spin mr-2">⏳</span>
            Generating Report...
          </>
        ) : (
          '📊 Generate Report'
        )}
      </button>

      {/* Info Box */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>💡 Tip:</strong> Reports include comprehensive analysis results, risk scores, incident summaries,
          and actionable recommendations.
        </p>
      </div>
    </div>
  );
}
