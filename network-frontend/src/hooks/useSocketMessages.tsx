"use client";

import { useEffect, useRef, useCallback } from "react";
import { useMessagesSocket as useMessagesSocketContext } from "@/context/MessagesSocketContext";

export function useMessagesSocket() {
  const {
    socket,
    isConnected,
    joinConversation,
    leaveConversation,
    sendTyping,
    onNewMessage,
    onUserTyping,
  } = useMessagesSocketContext();

  const messageListenersRef = useRef<Set<() => void>>(new Set());
  const typingListenersRef = useRef<Set<() => void>>(new Set());

  // Helper cho new_message
  const subscribeNewMessage = useCallback(
    (callback: (msg: any) => void) => {
      const unsubscribe = onNewMessage(callback);
      messageListenersRef.current.add(unsubscribe);
      return () => {
        unsubscribe();
        messageListenersRef.current.delete(unsubscribe);
      };
    },
    [onNewMessage]
  );

  // Helper cho user_typing
  const subscribeUserTyping = useCallback(
    (callback: (data: { userId: string; isTyping: boolean }) => void) => {
      const unsubscribe = onUserTyping(callback);
      typingListenersRef.current.add(unsubscribe);
      return () => {
        unsubscribe();
        typingListenersRef.current.delete(unsubscribe);
      };
    },
    [onUserTyping]
  );

  // Cleanup khi unmount
  useEffect(() => {
    return () => {
      messageListenersRef.current.forEach((unsubscribe) => unsubscribe());
      typingListenersRef.current.forEach((unsubscribe) => unsubscribe());
      messageListenersRef.current.clear();
      typingListenersRef.current.clear();
    };
  }, []);

  return {
    socket,
    isConnected,
    joinConversation,
    leaveConversation,
    sendTyping,
    subscribeNewMessage,
    subscribeUserTyping,
  };
}
