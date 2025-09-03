"use client";

import { useEffect, useRef, useCallback } from "react";
import { useSingleSocket } from "@/context/SingleSocketContext";
import { MessageResponse } from "@/types/message";
import { useAppDispatch } from "@/redux/hooks";
import {
  inCreaseUnreadCount,
  updateConversationLastMessage,
} from "@/redux/features/chat/slices/conversationSlice";

export function useSocketMessages() {
  const {
    socket,
    isConnected,
    joinConversation,
    leaveConversation,
    sendTyping,
    onNewMessage,
    onUserTyping,
  } = useSingleSocket();

  const dispatch = useAppDispatch();
  const messageListenersRef = useRef<Set<() => void>>(new Set());
  const typingListenersRef = useRef<Set<() => void>>(new Set());

  // const handleGlobalMessage = useCallback(
  //   (message: MessageResponse) => {
  //     console.log("Global new message:", message);

  //     dispatch(
  //       updateConversationLastMessage({
  //         conversationId: message.conversationId,
  //         lastMessage: message,
  //       })
  //     );

  //     dispatch(inCreaseUnreadCount({ conversationId: message.conversationId }));
  //   },
  //   [dispatch]
  // );

  // const subscribeNewMessage = useCallback(
  //   (callback: (msg: MessageResponse) => void) => {
  //     // ✅ luôn bọc callback của bạn kèm global handler
  //     const combinedCallback = (msg: MessageResponse) => {
  //       handleGlobalMessage(msg); // global update
  //       callback(msg); // custom logic (MessageContainer)
  //     };

  //     const unsubscribe = onNewMessage(combinedCallback);
  //     messageListenersRef.current.add(unsubscribe);

  //     return () => {
  //       unsubscribe();
  //       messageListenersRef.current.delete(unsubscribe);
  //     };
  //   },
  //   [onNewMessage, handleGlobalMessage]
  // );
  const subscribeNewMessage = useCallback(
    (callback: (msg: MessageResponse) => void) => {
      const unsubscribe = onNewMessage((msg: MessageResponse) => {
        callback(msg); // chỉ append message vào UI
      });
      messageListenersRef.current.add(unsubscribe);
      return () => {
        unsubscribe();
        messageListenersRef.current.delete(unsubscribe);
      };
    },
    [onNewMessage]
  );

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

  useEffect(() => {
    return () => {
      messageListenersRef.current.forEach((unsubscribe) => unsubscribe());
      typingListenersRef.current.forEach((unsubscribe) => unsubscribe());
      messageListenersRef.current.clear();
      typingListenersRef.current.clear();
    };
  }, [onNewMessage]);

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
