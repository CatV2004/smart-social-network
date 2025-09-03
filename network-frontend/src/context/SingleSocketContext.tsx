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
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectIsAuthenticated } from "@/redux/features/auth/authSelectors";
import { MessageResponse } from "@/types/message";
import { Notification } from "@/types/notification";
import { selectMyProfile } from "@/redux/features/profile/profileSelectors";
import {
  userWentOffline,
  userWentOnline,
} from "@/redux/features/onlineStatus/onlineStatusSlice";

interface SingleSocketContextValue {
  socket: Socket | null;
  isConnected: boolean;
  // Messages methods
  joinConversation: (conversationId: string) => void;
  leaveConversation: (conversationId: string) => void;
  sendTyping: (conversationId: string, isTyping: boolean) => void;
  // Notifications methods
  joinNotifications: () => void;
  leaveNotifications: () => void;
  markNotificationRead: (notificationId: string) => void;
  markAllNotificationsRead: () => void;
  // Event listeners
  onNewMessage: (callback: (message: MessageResponse) => void) => () => void;
  onUserTyping: (
    callback: (data: { userId: string; isTyping: boolean }) => void
  ) => () => void;
  onNewNotification: (
    callback: (notification: Notification) => void
  ) => () => void;
  onNewNotificationsBatch: (
    callback: (notifications: Notification[]) => void
  ) => () => void;

  onUserOnline: (callback: (data: { userId: string }) => void) => () => void;
  onUserOffline: (callback: (data: { userId: string }) => void) => () => void;
}

const SingleSocketContext = createContext<SingleSocketContextValue | undefined>(
  undefined
);

export const SingleSocketProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const profile = useAppSelector(selectMyProfile);
  const socketRef = useRef<Socket | null>(null);
  const isConnectingRef = useRef(false);
  const dispatch = useAppDispatch();

  const newMessageListenersRef = useRef<Map<string, (message: any) => void>>(
    new Map()
  );
  const userTypingListenersRef = useRef<Map<string, (data: any) => void>>(
    new Map()
  );
  const newNotificationListenersRef = useRef<
    Map<string, (notification: any) => void>
  >(new Map());
  const newNotificationsBatchListenersRef = useRef<
    Map<string, (notifications: any[]) => void>
  >(new Map());

  useEffect(() => {
    if (!isAuthenticated || !profile) {
      if (socketRef.current) {
        console.log("Disconnecting due to no auth");
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
        setIsConnected(false);
        // Clear all listeners
        newMessageListenersRef.current.clear();
        userTypingListenersRef.current.clear();
        newNotificationListenersRef.current.clear();
        newNotificationsBatchListenersRef.current.clear();
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
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    console.log("Connecting to main socket:", socketUrl);

    const newSocket = io(socketUrl, {
      path: process.env.NEXT_PUBLIC_SOCKET_PATH || "/socket.io",
      transports: ["websocket", "polling"],
      auth: { token, userId: profile?.user.id },
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    const handleUserOnline = (data: { userId: string }) => {
      dispatch(userWentOnline(data.userId));
    };

    const handleUserOffline = (data: { userId: string }) => {
      dispatch(userWentOffline(data.userId));
    };

    newSocket.on("user_online", handleUserOnline);
    newSocket.on("user_offline", handleUserOffline);

    newSocket.on("connect", () => {
      console.log("Connected to main socket with ID:", newSocket.id);
      setIsConnected(true);
      isConnectingRef.current = false;
      newSocket.emit("join_notifications");
    });

    newSocket.on("connect", () => {
      console.log("Connected to main socket with ID:", newSocket.id);
      setIsConnected(true);
      isConnectingRef.current = false;

      // Auto join notifications khi connect
      newSocket.emit("join_notifications");
    });

    newSocket.on("disconnect", (reason) => {
      console.log("Disconnected from main socket:", reason);
      setIsConnected(false);
      isConnectingRef.current = false;
    });

    newSocket.on("connect_error", (error) => {
      console.error("Connection error:", error.message);
      setIsConnected(false);
      isConnectingRef.current = false;
    });

    // Setup event listeners từ server
    newMessageListenersRef.current.forEach((callback) => {
      newSocket.on("new_message", callback);
    });

    userTypingListenersRef.current.forEach((callback) => {
      newSocket.on("user_typing", callback);
    });

    newNotificationListenersRef.current.forEach((callback) => {
      newSocket.on("new_notification", callback);
    });

    newNotificationsBatchListenersRef.current.forEach((callback) => {
      newSocket.on("new_notifications_batch", callback);
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    return () => {
      // Cleanup listeners khi unmount
      newMessageListenersRef.current.forEach((callback) => {
        newSocket.off("new_message", callback);
      });
      userTypingListenersRef.current.forEach((callback) => {
        newSocket.off("user_typing", callback);
      });
      newNotificationListenersRef.current.forEach((callback) => {
        newSocket.off("new_notification", callback);
      });
      newNotificationsBatchListenersRef.current.forEach((callback) => {
        newSocket.off("new_notifications_batch", callback);
      });
      newSocket.off("user_online", handleUserOnline);
      newSocket.off("user_offline", handleUserOffline);
    };
  }, [isAuthenticated, profile?.user?.id]);

  // Messages methods
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

  // Notifications methods
  const joinNotifications = useCallback(() => {
    socketRef.current?.emit("join_notifications");
  }, []);

  const leaveNotifications = useCallback(() => {
    socketRef.current?.emit("leave_notifications");
  }, []);

  const markNotificationRead = useCallback((notificationId: string) => {
    socketRef.current?.emit("mark_notification_read", { notificationId });
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    socketRef.current?.emit("mark_all_notifications_read");
  }, []);

  // Event listeners
  const onNewMessage = useCallback((callback: (message: any) => void) => {
    if (!socketRef.current) return () => {};

    const key = crypto.randomUUID();
    newMessageListenersRef.current.set(key, callback);
    socketRef.current.on("new_message", callback);

    return () => {
      socketRef.current?.off("new_message", callback);
      newMessageListenersRef.current.delete(key);
    };
  }, []);

  const onUserTyping = useCallback((callback: (data: any) => void) => {
    if (!socketRef.current) return () => {};

    const key = crypto.randomUUID();
    userTypingListenersRef.current.set(key, callback);
    socketRef.current.on("user_typing", callback);

    return () => {
      socketRef.current?.off("user_typing", callback);
      userTypingListenersRef.current.delete(key);
    };
  }, []);

  const onNewNotification = useCallback(
    (callback: (notification: any) => void) => {
      if (!socketRef.current) return () => {};

      const key = crypto.randomUUID();
      newNotificationListenersRef.current.set(key, callback);
      socketRef.current.on("new_notification", callback);

      return () => {
        socketRef.current?.off("new_notification", callback);
        newNotificationListenersRef.current.delete(key);
      };
    },
    []
  );

  const onNewNotificationsBatch = useCallback(
    (callback: (notifications: any[]) => void) => {
      if (!socketRef.current) return () => {};

      const key = crypto.randomUUID();
      newNotificationsBatchListenersRef.current.set(key, callback);
      socketRef.current.on("new_notifications_batch", callback);

      return () => {
        socketRef.current?.off("new_notifications_batch", callback);
        newNotificationsBatchListenersRef.current.delete(key);
      };
    },
    []
  );

  const onUserOnline = useCallback(
    (callback: (data: { userId: string }) => void) => {
      if (!socketRef.current) return () => {};
      const key = crypto.randomUUID();
      socketRef.current.on("user_online", callback);
      return () => socketRef.current?.off("user_online", callback);
    },
    []
  );

  const onUserOffline = useCallback(
    (callback: (data: { userId: string }) => void) => {
      if (!socketRef.current) return () => {};
      const key = crypto.randomUUID();
      socketRef.current.on("user_offline", callback);
      return () => socketRef.current?.off("user_offline", callback);
    },
    []
  );

  return (
    <SingleSocketContext.Provider
      value={{
        socket,
        isConnected,
        joinConversation,
        leaveConversation,
        sendTyping,
        joinNotifications,
        leaveNotifications,
        markNotificationRead,
        markAllNotificationsRead,
        onNewMessage,
        onUserTyping,
        onNewNotification,
        onNewNotificationsBatch,
        onUserOnline,
        onUserOffline,
      }}
    >
      {children}
    </SingleSocketContext.Provider>
  );
};

export const useSingleSocket = (): SingleSocketContextValue => {
  const context = useContext(SingleSocketContext);
  if (!context)
    throw new Error("useSingleSocket must be used within SingleSocketProvider");
  return context;
};
