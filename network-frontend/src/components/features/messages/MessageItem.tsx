"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageResponse } from "@/types/message";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";
import { Check, CheckCheck } from "lucide-react";
import { MediaRenderer } from "./media/MediaRenderer";
import { cn } from "@/lib/utils/cn";
// import { useMessageReads } from "@/hooks/chat/message/useMessageReads";

dayjs.locale("vi");
dayjs.extend(relativeTime);

interface MessageItemProps {
  message: MessageResponse;
  isOwnMessage: boolean;
  isLastOwnMessage?: boolean;
}

export function MessageItem({
  message,
  isOwnMessage,
  isLastOwnMessage,
}: MessageItemProps) {
  const hasAttachments = message.attachments && message.attachments.length > 0;
  const hasContent = message.content && message.content.trim().length > 0;

  const fullName = `${message.sender.user?.firstName} ${message.sender.user?.lastName}`;
  // const reads = useMessageReads(message.id) ?? [];

  const getAvatarFallback = () => {
    return fullName?.charAt(0)?.toUpperCase() || "?";
  };

  const formatTime = (date: string) => {
    return dayjs(date).format("HH:mm");
  };

  const renderStatusIcon = () => {
    // if (reads.length > 0) return null;
    if (message.status === "DELIVERED") {
      return <CheckCheck className="h-3 w-3 text-gray-400" />;
    }
    return <Check className="h-3 w-3 text-gray-400" />;
  };

  return (
    <div
      className={cn(
        "flex gap-2 mb-4 group",
        isOwnMessage ? "justify-end" : "justify-start"
      )}
    >
      {!isOwnMessage && (
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage
            src={message.sender.avatar || ""}
            alt={fullName || "User"}
            className="object-cover"
          />
          <AvatarFallback className="bg-gradient-to-r from-blue-400 to-blue-600 text-white text-xs">
            {getAvatarFallback()}
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={cn(
          "max-w-xs lg:max-w-md",
          isOwnMessage ? "order-first" : ""
        )}
      >
        {/* Hiển thị tên người gửi (nếu không phải mình) */}
        {!isOwnMessage && (
          <p className="text-xs text-muted-foreground mb-1 ml-1 font-medium">
            {fullName || "Unknown User"}
          </p>
        )}

        {/* Bubble tin nhắn */}
        <div
          className={cn(
            "rounded-2xl px-4 py-2 relative transition-colors",
            isOwnMessage
              ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md"
              : "bg-white border border-gray-200 rounded-bl-md shadow-sm"
          )}
        >
          {/* Nội dung */}
          {hasContent && (
            <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
              {message.content}
            </p>
          )}

          {/* File đính kèm */}
          {hasAttachments && (
            <div
              className={cn(
                "flex flex-col space-y-3",
                hasContent ? "mt-3" : ""
              )}
            >
              {message.attachments.map((attachment, index) => (
                <div key={attachment.publicId || attachment.url || index}>
                  <MediaRenderer
                    attachment={attachment}
                    isOwnMessage={isOwnMessage}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {isOwnMessage ? (
          <div className="flex items-center mt-1 gap-1 justify-end text-[10px] opacity-70">
            <span>{formatTime(message.createdAt)}</span>
            {renderStatusIcon()}
          </div>
        ) : (
          <div className="flex items-center gap-1 mt-1 text-[10px] opacity-70 justify-start">
            <span>{formatTime(message.createdAt)}</span>
          </div>
        )}
        {/* {isOwnMessage ? (
          reads.length > 0 && isLastOwnMessage ? (
            <div className="flex justify-end gap-1 mt-1">
              {reads.map((read) => (
                <Avatar
                  key={read.userId}
                  className="h-5 w-5 border border-white rounded-full shadow-sm"
                >
                  <AvatarImage
                    src={read.avatar}
                    alt="reader"
                    className="object-cover"
                  />
                  <AvatarFallback className="text-[10px]">
                    {read.userId.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
          ) : (
            // Các tin nhắn của mình khác
            <div className="flex items-center mt-1 gap-1 justify-end text-[10px] opacity-70">
              <span>{formatTime(message.createdAt)}</span>
              {renderStatusIcon()}
            </div>
          )
        ) : (
          // Tin nhắn người khác
          <div className="flex items-center gap-1 mt-1 text-[10px] opacity-70 justify-start">
            <span>{formatTime(message.createdAt)}</span>
          </div>
        )} */}
      </div>
    </div>
  );
}
