// context/BaseSocketProvider.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { getCookie } from "cookies-next";
import { useAppSelector } from "@/redux/hooks";
import { selectIsAuthenticated } from "@/redux/features/auth/authSelectors";
import { selectCurrentUser } from "@/redux/features/user/userSelectors";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

function createSocketContext() {
  return createContext<SocketContextType>({
    socket: null,
    isConnected: false,
  });
}

export function createSocketProvider(namespace: string) {
  const SocketContext = createSocketContext();

  const Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const user = useAppSelector(selectCurrentUser);

    useEffect(() => {
      if (!isAuthenticated || !user) {
        if (socket) {
          socket.disconnect();
          setSocket(null);
          setIsConnected(false);
        }
        return;
      }

      const token = getCookie("accessToken");
      if (!token) return;

      const newSocket = io(
        (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000") +
          namespace,
        {
          path: process.env.NEXT_PUBLIC_SOCKET_PATH || "/socket.io",
          transports: ["websocket", "polling"],
          auth: { token, userId: user.id },
          autoConnect: true,
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
        }
      );

      newSocket.on("connect", () => {
        console.log(`[${namespace}] Connected with ID:`, newSocket.id);
        setIsConnected(true);
      });

      newSocket.on("disconnect", (reason) => {
        console.log(`[${namespace}] Disconnected:`, reason);
        setIsConnected(false);
      });

      newSocket.on("connect_error", (error) => {
        console.error(`[${namespace}] Connection error:`, error.message);
        setIsConnected(false);
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }, [isAuthenticated, user]);

    return (
      <SocketContext.Provider value={{ socket, isConnected }}>
        {children}
      </SocketContext.Provider>
    );
  };

  const useSocket = () => useContext(SocketContext);

  return { Provider, useSocket };
}
