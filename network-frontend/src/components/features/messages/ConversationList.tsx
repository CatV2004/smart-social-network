import { ConversationItem } from "./ConversationItem";
import { Button } from "@/components/ui/button";
import { Loader2, MessageSquarePlus } from "lucide-react";
import { conversationResponse } from "@/types/conversation";

interface ConversationListProps {
  conversations: conversationResponse[];
  selectedConversationId?: string;
  hasMore: boolean;
  isLoading: boolean;
  isFiltering: boolean;
  filterType: "all" | "unread" | "pinned";
  onSelectConversation: (conversation: conversationResponse) => void;
  onLoadMore: () => void;
}

export function ConversationList({
  conversations,
  selectedConversationId,
  hasMore,
  isLoading,
  isFiltering,
  filterType,
  onSelectConversation,
  onLoadMore,
}: ConversationListProps) {

  if (conversations.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500 p-4">
        <div className="rounded-full bg-gray-200 p-4 mb-3">
          <MessageSquarePlus className="h-8 w-8 text-gray-400" />
        </div>
        <p className="text-center text-sm font-medium">
          {filterType === "unread"
            ? "Không có hội thoại chưa đọc"
            : filterType === "pinned"
            ? "Không có hội thoại được ghim"
            : isFiltering
            ? "Không tìm thấy kết quả phù hợp"
            : "Bắt đầu cuộc trò chuyện mới"}
        </p>
        <p className="text-center text-xs mt-1 text-gray-400">
          {filterType === "all" &&
            !isFiltering &&
            "Nhấn vào nút + để bắt đầu trò chuyện"}
        </p>
        {filterType === "all" && !isFiltering && (
          <Button
            variant="outline"
            size="sm"
            className="mt-4 rounded-lg"
          >
            <MessageSquarePlus className="h-4 w-4 mr-2" />
            Trò chuyện mới
          </Button>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="space-y-1">
        {conversations.map((conversation) => (
          <ConversationItem
            key={conversation.id}
            conversation={conversation}
            isActive={selectedConversationId === conversation.id}
            onClick={() => onSelectConversation(conversation)}
          />
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onLoadMore}
            disabled={isLoading}
            className="rounded-lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Đang tải...
              </>
            ) : (
              "Tải thêm"
            )}
          </Button>
        </div>
      )}
    </>
  );
}
