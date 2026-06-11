import { useEffect, useRef, useState, useCallback } from "react";

export const useWebSocket = (url, options = {}) => {
  const { reconnectInterval = 5000, maxReconnectAttempts = 5, onMessage, onError } = options;
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const reconnectAttempts = useRef(0);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      reconnectAttempts.current = 0;
      // Console statement removed
    };

    ws.onclose = () => {
      setIsConnected(false);
      // Console statement removed

      if (reconnectAttempts.current < maxReconnectAttempts) {
        reconnectTimeoutRef.current = setTimeout(() => {
          reconnectAttempts.current += 1;
          connect();
        }, reconnectInterval);
      }
    };

    ws.onerror = (error) => {
      // Console statement removed
      onError?.(error);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setLastMessage(data);
        onMessage?.(data);
      } catch (error) {
        // Console statement removed
      }
    };
  }, [url, maxReconnectAttempts, reconnectInterval, onMessage, onError]);

  useEffect(() => {
    connect();
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  const sendMessage = useCallback((message) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      // Console statement removed
    }
  }, []);

  const subscribe = useCallback(
    (channels) => {
      sendMessage({ type: "subscribe", channels });
    },
    [sendMessage]
  );

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (wsRef.current) {
      wsRef.current.close();
    }
  }, []);

  return {
    isConnected,
    lastMessage,
    sendMessage,
    subscribe,
    disconnect,
    reconnect: connect,
  };
};

export default useWebSocket;
