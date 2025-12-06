import { useEffect, useRef, useState, useCallback } from 'react';

export interface WebSocketMessage {
  type: 'session_update' | 'analysis_progress' | 'result_ready' | 'error' | 'ping' | 'pong';
  data: any;
  timestamp: string;
}

export interface AnalysisProgress {
  session_id: string;
  status: 'processing' | 'completed' | 'failed';
  progress_percent: number;
  current_stage: string;
  details?: {
    voice_progress?: number;
    video_progress?: number;
    document_progress?: number;
    liveness_progress?: number;
  };
}

export interface SessionUpdate {
  session_id: string;
  status: 'active' | 'completed' | 'failed' | 'cancelled';
  timestamp: string;
}

interface UseWebSocketOptions {
  url?: string;
  sessionId?: string;
  enabled?: boolean;
  reconnectAttempts?: number;
  reconnectInterval?: number;
}

export const useWebSocket = ({
  url = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/ws',
  sessionId,
  enabled = true,
  reconnectAttempts = 5,
  reconnectInterval = 3000,
}: UseWebSocketOptions = {}) => {
  const ws = useRef<WebSocket | null>(null);
  const reconnectCount = useRef(0);
  const pingTimer = useRef<NodeJS.Timeout | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [progress, setProgress] = useState<AnalysisProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const listeners = useRef<Map<string, ((data: any) => void)[]>>(new Map());

  const connect = useCallback(() => {
    if (!enabled || ws.current?.readyState === WebSocket.OPEN) return;

    try {
      const wsUrl = sessionId ? `${url}?session_id=${sessionId}` : url;
      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = () => {
        setIsConnected(true);
        setError(null);
        reconnectCount.current = 0;

        if (ws.current) {
          ws.current.send(JSON.stringify({ type: 'ping', timestamp: new Date().toISOString() }));
        }

        pingTimer.current = setInterval(() => {
          if (ws.current?.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify({ type: 'ping', timestamp: new Date().toISOString() }));
          }
        }, 30000);
      };

      ws.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          setLastMessage(message);

          if (message.type === 'analysis_progress') {
            setProgress(message.data as AnalysisProgress);
          }

          const eventListeners = listeners.current.get(message.type) || [];
          eventListeners.forEach((listener) => listener(message.data));
        } catch (err) {
          console.error('WebSocket parse error:', err);
        }
      };

      ws.current.onerror = (event) => {
        setError('WebSocket connection error');
      };

      ws.current.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);

        if (pingTimer.current) {
          clearInterval(pingTimer.current);
        }

        // Attempt to reconnect
        if (enabled && reconnectCount.current < reconnectAttempts) {
          reconnectCount.current += 1;
          console.log(`Attempting to reconnect (${reconnectCount.current}/${reconnectAttempts})...`);
          setTimeout(connect, reconnectInterval);
        } else if (reconnectCount.current >= reconnectAttempts) {
          setError('Failed to connect after multiple attempts');
        }
      };
    } catch (err) {
      console.error('Failed to create WebSocket:', err);
      setError('Failed to establish WebSocket connection');
    }
  }, [enabled, sessionId, url, reconnectAttempts, reconnectInterval]);

  const disconnect = useCallback(() => {
    if (pingTimer.current) {
      clearInterval(pingTimer.current);
    }
    if (ws.current) {
      ws.current.close();
      ws.current = null;
    }
    setIsConnected(false);
  }, []);

  const send = useCallback((message: WebSocketMessage | Record<string, any>) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      const payload =
        'type' in message
          ? message
          : { ...message, timestamp: new Date().toISOString() };
      ws.current.send(JSON.stringify(payload));
    } else {
      console.warn('WebSocket is not connected');
    }
  }, []);

  const on = useCallback((eventType: string, listener: (data: any) => void) => {
    if (!listeners.current.has(eventType)) {
      listeners.current.set(eventType, []);
    }
    listeners.current.get(eventType)!.push(listener);

    // Return unsubscribe function
    return () => {
      const eventListeners = listeners.current.get(eventType);
      if (eventListeners) {
        const index = eventListeners.indexOf(listener);
        if (index > -1) {
          eventListeners.splice(index, 1);
        }
      }
    };
  }, []);

  const off = useCallback((eventType: string, listener: (data: any) => void) => {
    const eventListeners = listeners.current.get(eventType);
    if (eventListeners) {
      const index = eventListeners.indexOf(listener);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  }, []);

  useEffect(() => {
    if (enabled) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [enabled, sessionId, connect, disconnect]);

  return {
    isConnected,
    lastMessage,
    progress,
    error,
    send,
    on,
    off,
    reconnect: connect,
    disconnect,
  };
};

export default useWebSocket;
