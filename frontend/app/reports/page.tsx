'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks';
import { useReport } from '@/hooks';
import { ReportGenerator } from '@/components';

export default function ReportsPage(): React.ReactElement {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { reports, isLoading, error, fetchReports, delete: deleteReport, clearError } = useReport();
  const [selectedFormat, setSelectedFormat] = useState<'all' | 'pdf' | 'json' | 'html'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'size'>('date');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    loadReports();
  }, [isAuthenticated, router]);

  const loadReports = async () => {
    try {
      await fetchReports(selectedFormat !== 'all' ? { format: selectedFormat as any } : undefined);
    } catch (err) {
      console.error('Failed to load reports:', err);
    }
  };

  const handleReportGenerated = () => {
    loadReports();
  };

  const handleDeleteReport = async (reportId: string) => {
    if (confirm('Are you sure you want to delete this report?')) {
      try {
        await deleteReport(reportId);
        loadReports();
      } catch (err) {
        console.error('Failed to delete report:', err);
      }
    }
  };

  const filteredReports = reports.filter((report: any) => {
    if (selectedFormat === 'all') return true;
    return report.format === selectedFormat;
  });

  const sortedReports = [...filteredReports].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime();
    }
    return b.fileSize - a.fileSize;
  });

  if (!isAuthenticated) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">Reports</h1>
        <p className="text-gray-600">Generate, manage, and download analysis reports</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Generator */}
        <div className="lg:col-span-1">
          <ReportGenerator onReportGenerated={handleReportGenerated} onError={clearError} />
        </div>

        {/* Reports List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow">
            {/* Filters */}
            <div className="border-b border-gray-200 p-6">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex gap-2">
                  <select
                    value={selectedFormat}
                    onChange={(e) => {
                      setSelectedFormat(e.target.value as any);
                      loadReports();
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="all">All Formats</option>
                    <option value="pdf">PDF</option>
                    <option value="json">JSON</option>
                    <option value="html">HTML</option>
                  </select>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="date">Sort by Date</option>
                    <option value="size">Sort by Size</option>
                  </select>
                </div>

                <button
                  onClick={loadReports}
                  disabled={isLoading}
                  className="px-3 py-2 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-700 disabled:opacity-50"
                >
                  🔄 Refresh
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-6 bg-red-50 border-l-4 border-red-500">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Reports Table */}
            <div className="overflow-x-auto">
              {sortedReports.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <p className="text-base mb-2">No reports generated yet</p>
                  <p className="text-sm">Use the report generator to create your first report</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">File Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Format</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Size</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Generated</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {sortedReports.map((report) => (
                      <tr key={report.reportId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{report.fileName}</td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                              report.format === 'pdf'
                                ? 'bg-red-100 text-red-800'
                                : report.format === 'json'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {report.format.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {(report.fileSize / 1024 / 1024).toFixed(2)} MB
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(report.generatedAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex gap-2">
                            <a
                              href={report.downloadUrl}
                              download={report.fileName}
                              className="text-blue-600 hover:text-blue-700 font-medium"
                            >
                              ⬇️ Download
                            </a>
                            <button
                              onClick={() => handleDeleteReport(report.reportId)}
                              className="text-red-600 hover:text-red-700 font-medium"
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Stats */}
            {sortedReports.length > 0 && (
              <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
                <p className="text-sm text-gray-600">
                  <strong>{sortedReports.length}</strong> report{sortedReports.length !== 1 ? 's' : ''} • Total size:{' '}
                  <strong>{(sortedReports.reduce((sum, r) => sum + r.fileSize, 0) / 1024 / 1024).toFixed(2)} MB</strong>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold mb-2">📄 PDF Reports</h3>
          <p className="text-sm text-gray-600">
            Professional formatted reports with charts, styling, and pagination for printing and sharing.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold mb-2">📋 JSON Export</h3>
          <p className="text-sm text-gray-600">
            Structured data export for integration with external tools and data analysis platforms.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold mb-2">🌐 HTML Reports</h3>
          <p className="text-sm text-gray-600">
            Interactive HTML reports viewable in any browser with full formatting and embedded resources.
          </p>
        </div>
      </div>
    </div>
  );
}
