"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { MessageItem } from "./MessageItem";
import { MessageResponse } from "@/types/message";
import { Button } from "@/components/ui/button";
import { ChevronDown, Loader2 } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser } from "@/redux/features/user/userSelectors";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

interface MessageListProps {
  messages: MessageResponse[];
  onLoadMore?: () => void;
  hasMore?: boolean;
  loading?: boolean;
}

export function MessageList({
  messages,
  onLoadMore,
  hasMore = false,
  loading = false,
}: MessageListProps) {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const isInitialLoadRef = useRef(true);
  const user = useAppSelector(selectCurrentUser);
  const currentUserId = user?.id;

  console.log("messagee: ", messages);

  const handleLoadMore = useCallback(() => {
    if (onLoadMore) {
      onLoadMore();
    }
  }, [onLoadMore]);

  const { containerRef, handleScroll, isLoadingMore } = useInfiniteScroll({
    hasMore: !!hasMore,
    loading: loading,
    onLoadMore: handleLoadMore,
    threshold: 100,
  });

  // Đảo ngược mảng messages để tin nhắn mới ở dưới
  const displayedMessages = [...messages].reverse();

  const lastOwnMessageId = displayedMessages
    .filter((m) => m.sender.user?.id === currentUserId)
    .at(-1)?.id;

  // Luôn scroll tới cuối khi component mount
  useEffect(() => {
    if (displayedMessages.length > 0) {
      requestAnimationFrame(() => {
        endOfMessagesRef.current?.scrollIntoView({
          behavior: "auto",
          block: "end",
        });
        isInitialLoadRef.current = false;
        setIsAtBottom(true);
      });
    }
  }, [displayedMessages.length]);

  // Scroll tới cuối khi có tin nhắn mới và đang ở bottom
  useEffect(() => {
    if (isAtBottom && displayedMessages.length > 0 && !isLoadingMore) {
      requestAnimationFrame(() => {
        endOfMessagesRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      });
    }
  }, [displayedMessages.length, isAtBottom, isLoadingMore]);

  const handleScrollWithTracking = (e: React.UIEvent<HTMLDivElement>) => {
    handleScroll();
    const target = e.currentTarget;
    const { scrollTop, scrollHeight, clientHeight } = target;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    setIsAtBottom(distanceFromBottom < 100);
    setShowScrollButton(distanceFromBottom > 300);
  };

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      endOfMessagesRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
      setIsAtBottom(true);
      setShowScrollButton(false);
    });
  };

  // Nhóm tin nhắn theo ngày
  const groupMessagesByDate = () => {
    const groups: { date: string; messages: MessageResponse[] }[] = [];
    displayedMessages.forEach((message) => {
      const messageDate = new Date(message.createdAt).toDateString();
      const lastGroup = groups[groups.length - 1];
      if (lastGroup && lastGroup.date === messageDate) {
        lastGroup.messages.push(message);
      } else {
        groups.push({ date: messageDate, messages: [message] });
      }
    });
    return groups;
  };

  const messageGroups = groupMessagesByDate();

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto p-4 pb-0 relative"
      onScroll={handleScrollWithTracking}
    >
      {/* Loading indicator */}
      {(isLoadingMore || loading) && (
        <div className="sticky top-0 flex justify-center z-10 mb-4 transition-all duration-300">
          <div className="bg-background/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-sm border">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Đang tải thêm tin nhắn...
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {messageGroups.map((group, groupIndex) => (
          <div key={groupIndex}>
            {/* Date separator */}
            <div className="flex justify-center my-6">
              <div className="bg-muted/50 text-muted-foreground text-xs px-3 py-1.5 rounded-full border">
                {new Date(group.date).toLocaleDateString("vi-VI", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </div>
            </div>

            {/* Messages in group */}
            {group.messages.map((message) => (
              <MessageItem
                key={message.id}
                message={message}
                isOwnMessage={message.sender.user?.id === currentUserId}
                isLastOwnMessage={message.id === lastOwnMessageId}
              />
            ))}
          </div>
        ))}
        <div ref={endOfMessagesRef} className="h-0" />
      </div>

      {/* Nút scroll to bottom */}
      {showScrollButton && (
        <Button
          onClick={scrollToBottom}
          size="icon"
          className="fixed bottom-20 right-6 h-12 w-12 rounded-full shadow-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 z-50"
        >
          <ChevronDown className="h-6 w-6" />
          <span className="sr-only">Xuống tin nhắn mới nhất</span>
        </Button>
      )}
    </div>
  );
}
