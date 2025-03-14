"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface WebSocketContextProps {
  socket: Socket | null;
  isConnected: boolean;
  connectionError: string | null;
  reconnect: () => void;
}

const WebSocketContext = createContext<WebSocketContextProps>({
  socket: null,
  isConnected: false,
  connectionError: null,
  reconnect: () => {},
});

export const useWebSocket = () => useContext(WebSocketContext);

interface WebSocketProviderProps {
  children: React.ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  const initializeSocket = () => {
    try {
      // Clear any previous errors
      setConnectionError(null);

      // Create socket with error handling and reconnection options
      const socketInstance = io(
        process.env.NEXT_PUBLIC_WEBSOCKET_URL || "http://localhost:3001",
        {
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          timeout: 10000,
          autoConnect: true,
          transports: ["websocket", "polling"],
        }
      );

      // Connection events
      socketInstance.on("connect", () => {
        console.log("WebSocket connected");
        setIsConnected(true);
        setConnectionError(null);
        setReconnectAttempts(0);
      });

      socketInstance.on("disconnect", (reason) => {
        console.log(`WebSocket disconnected: ${reason}`);
        setIsConnected(false);

        if (reason === "io server disconnect") {
          // Server disconnected us, need to manually reconnect
          setTimeout(() => socketInstance.connect(), 1000);
        }
      });

      socketInstance.on("connect_error", (error) => {
        console.error("WebSocket connection error:", error.message);
        setIsConnected(false);
        setConnectionError(`Connection error: ${error.message}`);
        setReconnectAttempts((prev) => prev + 1);

        // If we're in development and the backend might not be running
        if (process.env.NODE_ENV === "development" && reconnectAttempts < 2) {
          console.log("Development mode: WebSocket backend may not be running");
          setConnectionError("Backend may not be running. Using mock data.");
        }
      });

      // Handle errors that occur after connection
      socketInstance.on("error", (error) => {
        console.error("WebSocket error:", error);
        setConnectionError(`Socket error: ${error}`);
      });

      setSocket(socketInstance);

      // Cleanup
      return () => {
        console.log("Cleaning up WebSocket connection");
        socketInstance.disconnect();
        socketInstance.removeAllListeners();
        setSocket(null);
      };
    } catch (error) {
      console.error("Error initializing WebSocket:", error);
      setConnectionError(`Failed to initialize socket: ${error}`);
      return () => {};
    }
  };

  // Initialize socket connection
  useEffect(() => {
    const cleanup = initializeSocket();
    return cleanup;
  }, []);

  // Function to manually reconnect
  const reconnect = () => {
    if (socket) {
      socket.disconnect();
      socket.removeAllListeners();
    }
    initializeSocket();
  };

  return (
    <WebSocketContext.Provider
      value={{ socket, isConnected, connectionError, reconnect }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};
