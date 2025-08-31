"use client";

import { useState, useRef, FormEvent, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Paperclip, Send, Smile, Mic, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { MessageRequest } from "@/types/message";
import { useMessages } from "@/hooks/chat/message/useMessages";
import { markConversationAsRead } from "@/redux/features/chat/thunks/conversationThunks";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import debounce from "lodash.debounce";
import { selectMyProfile } from "@/redux/features/profile/profileSelectors";

interface MessageInputProps {
  conversationId: string;
  disabled?: boolean;
  onTyping?: (isTyping: boolean) => void;
}

export function MessageInput({
  conversationId,
  disabled,
  onTyping,
}: MessageInputProps) {
  const dispatch = useAppDispatch();
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentUserId = useAppSelector(selectMyProfile)?.user.id;

  const { sendNewMessage, newMessages } = useMessages(conversationId);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => {
    if (isTyping) {
      sendTypingDebounced(false);
    }
    onTyping?.(false);
  };

  const sendTypingDebounced = useCallback(
    debounce((typing: boolean) => {
      if (onTyping) {
        onTyping(typing);
      }
    }, 500),
    [onTyping]
  );

  useEffect(() => {
    if (conversationId) {
      dispatch(markConversationAsRead(conversationId));
    }
  }, [conversationId, dispatch]);

  useEffect(() => {
    if (isFocused && newMessages.length > 0) {
      const hasOthersMessages = newMessages.some(
        (msg) => msg.sender.user?.id !== currentUserId
      );
      if (hasOthersMessages) {
        dispatch(markConversationAsRead(conversationId));
      }
    }
  }, [isFocused, newMessages, conversationId, dispatch, currentUserId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if ((!message.trim() && files.length === 0) || disabled) return;

    if (isTyping && onTyping) {
      onTyping(false);
      setIsTyping(false);
    }

    const payload: MessageRequest = {
      conversationId,
      content: message.trim() || undefined,
      files: files.length > 0 ? files : undefined,
    };

    try {
      await sendNewMessage(payload);
      setMessage("");
      setFiles([]);
    } catch (err) {
      console.error("Send message failed:", err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMessage(value);

    if (value.trim().length > 0 && !isTyping) {
      sendTypingDebounced(true);
      onTyping?.(true);
    } else if (value.trim().length === 0 && isTyping) {
      sendTypingDebounced(false);
      onTyping?.(false);
    }
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setMessage((prev) => prev + emojiData.emoji);
    inputRef.current?.focus();

    if (!isTyping && onTyping) {
      sendTypingDebounced(true);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    return () => {
      sendTypingDebounced.cancel();
    };
  }, [sendTypingDebounced]);

  return (
    <div className="bg-white border-t border-gray-200">
      {/* File preview */}
      {files.length > 0 && (
        <div className="flex gap-2 p-3 bg-gray-50 border-b border-gray-200 overflow-x-auto">
          {files.map((file, idx) => (
            <div key={idx} className="relative flex-shrink-0">
              {file.type.startsWith("image/") ? (
                <div className="relative h-16 w-16 rounded-md overflow-hidden border">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="h-full w-full object-cover"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 hover:bg-red-600 text-white p-0"
                    onClick={() => removeFile(idx)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div className="relative h-16 w-40 rounded-md border bg-white p-2 flex items-center">
                  <Paperclip className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="text-xs truncate">{file.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 hover:bg-red-600 text-white p-0"
                    onClick={() => removeFile(idx)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-4 flex items-center gap-2">
        {/* File picker */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={disabled}
          className="rounded-full text-gray-500 hover:text-blue-600"
          onClick={() => fileInputRef.current?.click()}
        >
          <Paperclip className="h-5 w-5" />
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
          multiple
          onChange={handleFileChange}
        />

        {/* Emoji picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={disabled}
              className="rounded-full text-gray-500 hover:text-blue-600"
            >
              <Smile className="h-5 w-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              searchDisabled
              width="100%"
            />
          </PopoverContent>
        </Popover>

        {/* Message input */}
        <Input
          ref={inputRef}
          placeholder="Nhắn tin..."
          value={message}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className="flex-1 rounded-full bg-gray-100 border-none focus-visible:ring-2 focus-visible:ring-blue-500"
        />

        {/* Send button */}
        {message.trim() || files.length > 0 ? (
          <Button
            type="submit"
            size="icon"
            disabled={disabled}
            className="rounded-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
          >
            <Send className="h-5 w-5" />
          </Button>
        ) : (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={disabled}
            className="rounded-full text-gray-500 hover:text-blue-600"
          >
            <Mic className="h-5 w-5" />
          </Button>
        )}
      </form>
    </div>
  );
}
