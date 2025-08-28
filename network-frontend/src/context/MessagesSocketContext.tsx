"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { io, Socket } from "socket.io-client";
import { getCookie } from "cookies-next";
import { useAppSelector } from "@/redux/hooks";
import { selectIsAuthenticated } from "@/redux/features/auth/authSelectors";
import { selectCurrentUser } from "@/redux/features/user/userSelectors";
import { MessageResponse } from "@/types/message";

interface MessagesSocketContextValue {
  socket: Socket | null;
  isConnected: boolean;
  joinConversation: (conversationId: string) => void;
  leaveConversation: (conversationId: string) => void;
  sendTyping: (conversationId: string, isTyping: boolean) => void;
  onNewMessage: (callback: (message: MessageResponse) => void) => () => void;
  onUserTyping: (
    callback: (data: { userId: string; isTyping: boolean }) => void
  ) => () => void;
}

const MessagesSocketContext = createContext<
  MessagesSocketContextValue | undefined
>(undefined);

export const MessagesSocketProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectCurrentUser);
  const socketRef = useRef<Socket | null>(null);
  const isConnectingRef = useRef(false);

  const newMessageListenersRef = useRef<Map<string, (message: any) => void>>(
    new Map()
  );
  const userTypingListenersRef = useRef<Map<string, (data: any) => void>>(
    new Map()
  );

  useEffect(() => {
    if (!isAuthenticated || !user) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
        setIsConnected(false);
        newMessageListenersRef.current.clear();
        userTypingListenersRef.current.clear();
      }
      return;
    }

    const token = getCookie("accessToken");
    if (socketRef.current && socketRef.current.connected) {
      return;
    }

    if (isConnectingRef.current) {
      return;
    }

    isConnectingRef.current = true;

    const socketUrl =
      (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000") +
      "/messages";

    const newSocket = io(socketUrl, {
      path: process.env.NEXT_PUBLIC_SOCKET_PATH || "/socket.io",
      transports: ["websocket", "polling"],
      auth: { token, userId: user.id },
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on("connect", () => {
      setIsConnected(true);
      isConnectingRef.current = false;
    });

    newSocket.on("disconnect", (reason) => {
      setIsConnected(false);
      isConnectingRef.current = false;
    });

    newSocket.on("connect_error", (error) => {
      setIsConnected(false);
      isConnectingRef.current = false;
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    return () => {
      newMessageListenersRef.current.forEach((callback) => {
        newSocket.off("new_message", callback);
      });
      userTypingListenersRef.current.forEach((callback) => {
        newSocket.off("user_typing", callback);
      });
    };
  }, [isAuthenticated, user?.id]);

  // Tất cả các hàm đều sử dụng socketRef.current để đảm bảo consistency
  const joinConversation = useCallback((conversationId: string) => {
    socketRef.current?.emit("join_conversation", conversationId);
  }, []);

  const leaveConversation = useCallback((conversationId: string) => {
    socketRef.current?.emit("leave_conversation", conversationId);
  }, []);

  const sendTyping = useCallback(
    (conversationId: string, isTyping: boolean) => {
      socketRef.current?.emit("typing", { conversationId, isTyping });
    },
    []
  );

  const onNewMessage = useCallback((callback: (message: any) => void) => {
    if (!socketRef.current) {
      return () => {};
    }

    const key = crypto.randomUUID();
    newMessageListenersRef.current.set(key, callback);
    socketRef.current.on("new_message", callback);

    return () => {
      socketRef.current?.off("new_message", callback);
      newMessageListenersRef.current.delete(key);
    };
  }, []);

  const onUserTyping = useCallback(
    (callback: (data: { userId: string; isTyping: boolean }) => void) => {
      if (!socketRef.current) {
        return () => {};
      }

      const key = crypto.randomUUID();
      userTypingListenersRef.current.set(key, callback);
      socketRef.current.on("user_typing", callback);

      return () => {
        socketRef.current?.off("user_typing", callback);
        userTypingListenersRef.current.delete(key);
      };
    },
    []
  );

  return (
    <MessagesSocketContext.Provider
      value={{
        socket,
        isConnected,
        joinConversation,
        leaveConversation,
        sendTyping,
        onNewMessage,
        onUserTyping,
      }}
    >
      {children}
    </MessagesSocketContext.Provider>
  );
};

export const useMessagesSocket = (): MessagesSocketContextValue => {
  const context = useContext(MessagesSocketContext);
  if (!context)
    throw new Error(
      "useMessagesSocket must be used within MessagesSocketProvider"
    );
  return context;
};
