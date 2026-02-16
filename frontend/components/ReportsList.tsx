'use client';

import React, { useEffect, useState } from 'react';
import { useReport } from '@/hooks';

interface ReportsListProps {
  onReportSelected?: (reportId: string) => void;
  maxReports?: number;
}

export default function ReportsList({ onReportSelected, maxReports = 10 }: ReportsListProps): React.ReactElement {
  const { reports, isLoading, error, fetchReports } = useReport();
  const [displayReports, setDisplayReports] = useState<any[]>([]);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      await fetchReports({ limit: maxReports });
    } catch (err) {
      console.error('Failed to load reports:', err);
    }
  };

  useEffect(() => {
    setDisplayReports(reports.slice(0, maxReports));
  }, [reports, maxReports]);

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-sm text-red-700">Error loading reports: {error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Recent Reports</h3>
      </div>

      {isLoading ? (
        <div className="p-8 text-center">
          <p className="text-gray-500">Loading reports...</p>
        </div>
      ) : displayReports.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          <p>No reports available</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {displayReports.map((report: any) => (
            <div key={report.reportId} className="p-4 hover:bg-gray-50 cursor-pointer transition">
              <div className="flex items-center justify-between">
                <div className="flex-1" onClick={() => onReportSelected?.(report.reportId)}>
                  <h4 className="font-medium text-gray-900">{report.fileName}</h4>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="inline-block px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-700 rounded">
                      {report.format.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(report.generatedAt).toLocaleDateString()}
                    </span>
                    <span className="text-xs text-gray-500">
                      {(report.fileSize / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                </div>
                <a
                  href={report.downloadUrl}
                  download={report.fileName}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  ⬇️ Download
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
