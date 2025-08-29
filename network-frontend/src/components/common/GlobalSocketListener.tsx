"use client";

import { useAppDispatch } from "@/redux/hooks";
import {
  inCreaseUnreadCount,
  updateConversationLastMessage,
} from "@/redux/features/chat/slices/conversationSlice";
import { MessageResponse } from "@/types/message";
import { useEffect } from "react";
import { useSingleSocket } from "@/context/SingleSocketContext";

export function GlobalSocketListener() {
  const { onNewMessage } = useSingleSocket();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleGlobalMessage = (message: MessageResponse) => {
      dispatch(
        updateConversationLastMessage({
          conversationId: message.conversationId,
          lastMessage: message,
        })
      );
      dispatch(inCreaseUnreadCount({ conversationId: message.conversationId }));
    };

    const unsubscribe = onNewMessage(handleGlobalMessage);
    return unsubscribe;
  }, [dispatch, onNewMessage]);

  return null;
}
