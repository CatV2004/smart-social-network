"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Paperclip, Send, Smile } from "lucide-react";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export function MessageInput({ onSendMessage, disabled }: MessageInputProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 border-t flex items-center gap-2"
    >
      <Button type="button" variant="ghost" size="icon" disabled={disabled}>
        <Paperclip className="h-5 w-5" />
      </Button>
      <Button type="button" variant="ghost" size="icon" disabled={disabled}>
        <Smile className="h-5 w-5" />
      </Button>
      <Input
        placeholder="Nhắn tin..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={disabled}
        className="flex-1"
      />
      <Button type="submit" size="icon" disabled={disabled || !message.trim()}>
        <Send className="h-5 w-5" />
      </Button>
    </form>
  );
}
