'use client';

import React, { useState } from 'react';

interface ScoreHistoryItem {
  date: string;
  score: number;
  level: 'low' | 'medium' | 'high' | 'critical';
}

interface ScoreHistoryProps {
  history: ScoreHistoryItem[];
  title?: string;
}

export const ScoreHistory: React.FC<ScoreHistoryProps> = ({ history, title = 'Score History' }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const getLevelColor = (level: string): string => {
    switch (level) {
      case 'low':
        return 'bg-green-500 hover:bg-green-600';
      case 'medium':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'high':
        return 'bg-orange-500 hover:bg-orange-600';
      case 'critical':
        return 'bg-red-500 hover:bg-red-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const maxScore = Math.max(100, ...history.map((h) => h.score));
  const minScore = 0;

  return (
    <div className="w-full bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-6">{title}</h3>

      {history.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No history available</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Bar chart */}
          <div className="space-y-3">
            <div className="flex items-end gap-2 h-40 border-b border-gray-300 pb-4">
              {history.map((item, index) => {
                const percentage = ((item.score - minScore) / (maxScore - minScore)) * 100;
                return (
                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <div className="w-full flex justify-center mb-2">
                      {hoveredIndex === index && (
                        <div className="text-sm font-bold text-gray-700">{item.score}</div>
                      )}
                    </div>
                    <div className={`w-full ${getLevelColor(item.level)} rounded-t transition-all duration-200`} style={{ height: `${percentage}%` }} />
                  </div>
                );
              })}
            </div>

            {/* X-axis labels */}
            <div className="flex gap-2">
              {history.map((item, index) => (
                <div key={index} className="flex-1 text-center">
                  <p className="text-xs text-gray-600">{new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Table view */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="text-left font-semibold text-gray-700 py-2">Date</th>
                  <th className="text-right font-semibold text-gray-700 py-2">Score</th>
                  <th className="text-center font-semibold text-gray-700 py-2">Level</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3">{new Date(item.date).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                    <td className="text-right font-semibold text-gray-900">{item.score}</td>
                    <td className="text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded text-white text-xs font-semibold`}
                        style={{
                          backgroundColor:
                            item.level === 'low'
                              ? '#22c55e'
                              : item.level === 'medium'
                                ? '#eab308'
                                : item.level === 'high'
                                  ? '#f97316'
                                  : '#ef4444',
                        }}
                      >
                        {item.level.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
            <div className="text-center">
              <p className="text-xs text-gray-600 mb-1">Average</p>
              <p className="text-lg font-bold text-gray-900">
                {Math.round(history.reduce((sum, h) => sum + h.score, 0) / history.length)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-600 mb-1">Highest</p>
              <p className="text-lg font-bold text-red-600">{Math.max(...history.map((h) => h.score))}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-600 mb-1">Lowest</p>
              <p className="text-lg font-bold text-green-600">{Math.min(...history.map((h) => h.score))}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScoreHistory;
