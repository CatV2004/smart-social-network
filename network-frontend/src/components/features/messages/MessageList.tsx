"use client";

import { useEffect, useRef } from "react";
import { Message } from "@/types/message";
import { MessageItem } from "./MessageItem";

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
}

export function MessageList({ messages, currentUserId }: MessageListProps) {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="space-y-4">
        {messages.map((message) => (
          <MessageItem
            key={message.id}
            message={message}
            isOwnMessage={message.sender.id === currentUserId}
          />
        ))}
        <div ref={endOfMessagesRef} />
      </div>
    </div>
  );
}
