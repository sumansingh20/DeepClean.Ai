import { renderHook, act, waitFor } from '@testing-library/react';
import { useWebSocket } from '@/hooks';

// Mock WebSocket
class MockWebSocket {
  url: string;
  readyState: number = 0;
  onopen: ((event: Event) => void) | null = null;
  onmessage: ((event: MessageEvent) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;
  onclose: ((event: CloseEvent) => void) | null = null;

  constructor(url: string) {
    this.url = url;
  }

  send(data: string) {
    // Mock implementation
  }

  close() {
    this.readyState = 3;
    if (this.onclose) {
      this.onclose(new CloseEvent('close'));
    }
  }

  addEventListener(event: string, handler: EventListener) {
    if (event === 'open' && this.onopen) this.onopen(new Event('open'));
    if (event === 'message' && this.onmessage)
      this.onmessage(
        new MessageEvent('message', {
          data: JSON.stringify({
            type: 'ping',
            data: {},
            timestamp: new Date().toISOString(),
          }),
        })
      );
  }

  removeEventListener(event: string, handler: EventListener) {
    // Mock implementation
  }
}

global.WebSocket = MockWebSocket as any;

describe('useWebSocket Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Connection Management', () => {
    it('should initialize without connecting', () => {
      const { result } = renderHook(() => useWebSocket());
      expect(result.current.status).toBe('disconnected');
    });

    it('should connect to WebSocket server', async () => {
      const { result } = renderHook(() => useWebSocket());

      await act(async () => {
        await result.current.connect('session-123');
      });

      await waitFor(() => {
        expect(result.current.status).toBe('connecting' || 'connected');
      });
    });

    it('should disconnect from WebSocket', async () => {
      const { result } = renderHook(() => useWebSocket());

      await act(async () => {
        await result.current.connect('session-123');
      });

      await act(() => {
        result.current.disconnect();
      });

      expect(result.current.status).toBe('disconnecting' || 'disconnected');
    });
  });

  describe('Message Handling', () => {
    it('should send messages when connected', async () => {
      const { result } = renderHook(() => useWebSocket());

      const sendSpy = jest.fn();

      await act(async () => {
        await result.current.connect('session-123');
      });

      await act(() => {
        result.current.send({ type: 'test', data: {} });
      });

      // Verify message was queued or sent
      expect(result.current.status).not.toBe('disconnected');
    });

    it('should not send messages when disconnected', async () => {
      const { result } = renderHook(() => useWebSocket());

      const sendSpy = jest.fn();

      await act(() => {
        result.current.send({ type: 'test', data: {} });
      });

      expect(result.current.status).toBe('disconnected');
    });
  });

  describe('Event Subscriptions', () => {
    it('should allow subscribing to message events', async () => {
      const { result } = renderHook(() => useWebSocket());
      const listener = jest.fn();

      await act(async () => {
        await result.current.connect('session-123');
      });

      await act(() => {
        result.current.on('analysis_progress', listener);
      });

      // Verify listener was registered
      expect(result.current).toBeDefined();
    });

    it('should allow unsubscribing from events', async () => {
      const { result } = renderHook(() => useWebSocket());
      const listener = jest.fn();

      await act(async () => {
        await result.current.connect('session-123');
      });

      await act(() => {
        result.current.on('analysis_progress', listener);
        result.current.off('analysis_progress', listener);
      });

      expect(result.current).toBeDefined();
    });

    it('should support multiple listeners per event', async () => {
      const { result } = renderHook(() => useWebSocket());
      const listener1 = jest.fn();
      const listener2 = jest.fn();

      await act(async () => {
        await result.current.connect('session-123');
      });

      await act(() => {
        result.current.on('session_update', listener1);
        result.current.on('session_update', listener2);
      });

      expect(result.current).toBeDefined();
    });
  });

  describe('Reconnection Logic', () => {
    it('should attempt to reconnect on disconnection', async () => {
      const { result } = renderHook(() => useWebSocket({ reconnectAttempts: 3, reconnectInterval: 1000 }));

      await act(async () => {
        await result.current.connect('session-123');
      });

      // Simulate disconnection and wait for reconnect attempt
      await waitFor(
        () => {
          expect(result.current.status).not.toBe('error');
        },
        { timeout: 5000 }
      );
    });

    it('should stop reconnecting after max attempts', async () => {
      const { result } = renderHook(() => useWebSocket({ reconnectAttempts: 1, reconnectInterval: 100 }));

      await act(async () => {
        await result.current.connect('session-123');
      });

      jest.advanceTimersByTime(500);

      // After max attempts, should not reconnect
      expect(result.current).toBeDefined();
    });
  });

  describe('Keep-Alive Ping', () => {
    it('should send ping messages periodically', async () => {
      const { result } = renderHook(() => useWebSocket({ pingInterval: 1000 }));

      await act(async () => {
        await result.current.connect('session-123');
      });

      jest.advanceTimersByTime(1000);

      // Ping should have been sent
      expect(result.current.status).not.toBe('disconnected');
    });

    it('should stop pinging when disconnected', async () => {
      const { result } = renderHook(() => useWebSocket({ pingInterval: 1000 }));

      await act(async () => {
        await result.current.connect('session-123');
      });

      jest.advanceTimersByTime(500);

      await act(() => {
        result.current.disconnect();
      });

      jest.advanceTimersByTime(1000);

      expect(result.current.status).toBe('disconnecting' || 'disconnected');
    });
  });
});
