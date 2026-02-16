'use client';

import React, { useEffect, useState } from 'react';
import { useWebSocket } from '@/hooks';

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface NotificationCenterProps {
  sessionId?: string;
  maxNotifications?: number;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  sessionId,
  maxNotifications = 10,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { isConnected, on } = useWebSocket({ sessionId, enabled: !!sessionId });

  useEffect(() => {
    const unsubscribe = on('analysis_progress', (data) => {
      const newNotif: Notification = {
        id: `notif_${Date.now()}`,
        type: data.status === 'failed' ? 'error' : 'info',
        title: 'Analysis Update',
        message: `${data.current_stage} - ${data.progress_percent}% complete`,
        timestamp: new Date().toISOString(),
        read: false,
      };
      setNotifications((prev) => [newNotif, ...prev].slice(0, maxNotifications));
    });

    return () => {
      unsubscribe();
    };
  }, [on, maxNotifications]);

  useEffect(() => {
    const unsubscribe = on('result_ready', (_data) => {
      const newNotif: Notification = {
        id: `notif_${Date.now()}`,
        type: 'success',
        title: 'Analysis Complete',
        message: 'Your analysis results are ready to view',
        timestamp: new Date().toISOString(),
        read: false,
      };
      setNotifications((prev) => [newNotif, ...prev].slice(0, maxNotifications));
    });

    return () => {
      unsubscribe();
    };
  }, [on, maxNotifications]);

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getTypeColor = (type: string): string => {
    switch (type) {
      case 'info':
        return 'bg-blue-50 border-blue-300 text-blue-800';
      case 'success':
        return 'bg-green-50 border-green-300 text-green-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-300 text-yellow-800';
      case 'error':
        return 'bg-red-50 border-red-300 text-red-800';
      default:
        return 'bg-gray-50 border-gray-300 text-gray-800';
    }
  };

  const getTypeIcon = (type: string): string => {
    switch (type) {
      case 'info':
        return 'ℹ️';
      case 'success':
        return '✓';
      case 'warning':
        return '⚠️';
      case 'error':
        return '✕';
      default:
        return '◆';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md space-y-3">
      {!isConnected && (
        <div className={`border-l-4 rounded p-4 ${getTypeColor('warning')}`}>
          <div className="flex items-start gap-3">
            <span className="text-lg">{getTypeIcon('warning')}</span>
            <div>
              <h4 className="font-semibold text-sm">Connection Status</h4>
              <p className="text-xs opacity-75">Connecting to server...</p>
            </div>
          </div>
        </div>
      )}

      {notifications.map((notif) => (
        <div
          key={notif.id}
          className={`border-l-4 rounded p-4 shadow-lg animate-slideIn ${getTypeColor(notif.type)}`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1">
              <span className="text-lg">{getTypeIcon(notif.type)}</span>
              <div>
                <h4 className="font-semibold text-sm">{notif.title}</h4>
                <p className="text-xs opacity-75 mt-1">{notif.message}</p>
              </div>
            </div>
            <button
              onClick={() => removeNotification(notif.id)}
              className="text-lg opacity-50 hover:opacity-100 transition"
            >
              ✕
            </button>
          </div>
        </div>
      ))}

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default NotificationCenter;
