"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
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
    const socketRef = useRef<Socket | null>(null);
    const isConnectingRef = useRef(false);

    useEffect(() => {
      console.log(
        `[${namespace}] Auth status changed:`,
        isAuthenticated,
        "User:",
        user?.id
      );

      if (!isAuthenticated || !user) {
        // Disconnect nếu không authenticated
        if (socketRef.current) {
          console.log(`[${namespace}] Disconnecting due to no auth`);
          socketRef.current.disconnect();
          socketRef.current = null;
          setSocket(null);
          setIsConnected(false);
        }
        return;
      }

      const token = getCookie("accessToken");
      console.log(`[${namespace}] Token exists:`, !!token);

      if (!token) {
        console.log(`[${namespace}] No token, skipping connection`);
        return;
      }

      // Nếu đã có socket connected thì không tạo mới
      if (socketRef.current && socketRef.current.connected) {
        console.log(
          `[${namespace}] Socket already connected:`,
          socketRef.current.id
        );
        return;
      }

      // Nếu đang connecting thì không tạo mới
      if (isConnectingRef.current) {
        console.log(`[${namespace}] Already connecting, skipping`);
        return;
      }

      isConnectingRef.current = true;

      const socketUrl =
        (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000") +
        namespace;
      console.log(`[${namespace}] Connecting to:`, socketUrl);

      const newSocket = io(socketUrl, {
        path: process.env.NEXT_PUBLIC_SOCKET_PATH || "/socket.io",
        transports: ["websocket", "polling"],
        auth: {
          token,
          userId: user.id,
        },
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      // Thêm event listeners
      newSocket.on("connect", () => {
        console.log(`[${namespace}] Connected with ID:`, newSocket.id);
        setIsConnected(true);
        isConnectingRef.current = false;
      });

      newSocket.on("disconnect", (reason) => {
        console.log(`[${namespace}] Disconnected:`, reason);
        setIsConnected(false);
        isConnectingRef.current = false;
      });

      newSocket.on("connect_error", (error) => {
        console.error(`[${namespace}] Connection error:`, error.message);
        setIsConnected(false);
        isConnectingRef.current = false;
      });

      socketRef.current = newSocket;
      setSocket(newSocket);

      // Cleanup chỉ chạy khi component unmount hoặc auth thay đổi
      return () => {
        console.log(`[${namespace}] Cleanup function called`);
        // KHÔNG disconnect ở đây nữa, chỉ log
        // Socket sẽ được quản lý bởi auth state changes
      };
    }, [isAuthenticated, user?.id, namespace]); // Thêm namespace vào dependencies

    return (
      <SocketContext.Provider value={{ socket, isConnected }}>
        {children}
      </SocketContext.Provider>
    );
  };

  const useSocket = () => useContext(SocketContext);

  return { Provider, useSocket };
}
