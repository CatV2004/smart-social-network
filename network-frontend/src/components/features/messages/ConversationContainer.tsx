"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useConversation } from "@/hooks/chat/conversation/useConversation";
import { useConversationOperations } from "@/hooks/chat/conversation/useConversationOperations";
import { conversationResponse } from "@/types/conversation";
import { ConversationHeader } from "./ConversationHeader";
import { ConversationListSkeleton } from "./ConversationListSkeleton";
import { Button } from "@/components/ui/button";
import { ConversationList } from "./ConversationList";
import { CreateGroupModal } from "@/components/shared/modals/CreateGroupModal";
import useFriendsList from "@/hooks/useFriendsList";

export function ConversationContainer({}) {
  const params = useParams();
  const router = useRouter();
  const selectedConversationId = params.conversationId as string;

  const {
    conversations,
    loading,
    error,
    createNewConversation,
    refresh,
    loadMore,
    hasMore,
    getConversations,
  } = useConversation();
  const { markAsRead } = useConversationOperations();

  const [filterType, setFilterType] = useState<"all" | "unread" | "pinned">(
    "all"
  );
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { friends, loading: friendsLoading } = useFriendsList(
    isCreateGroupModalOpen
  );

  useEffect(() => {
    getConversations({
      page: 1,
      limit: 20,
      sortBy: "lastMessage.createdAt",
      sortOrder: "DESC",
    });
  }, [getConversations]);

  const handleFilterChange = (newFilterType: "all" | "unread" | "pinned") => {
    setFilterType(newFilterType);
  };

  const handleSelectConversation = async (
    conversation: conversationResponse
  ) => {
    try {
      await markAsRead(conversation.id);
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
    router.push(`/direct/tab/${conversation.id}`);
  };

  const handleCreateNewGroup = () => {
    setIsCreateGroupModalOpen(true);
  };

  const handleCreateGroup = async (groupData: {
    name: string;
    participantIds: string[];
  }) => {
    try {
      const newConversation = await createNewConversation({
        isGroup: true,
        name: groupData.name,
        memberIds: groupData.participantIds,
      });

      if (newConversation) {
        handleSelectConversation(newConversation);
      }
    } catch (error) {
      console.error("Failed to create group conversation:", error);
      throw error;
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      loadMore();
    }
  };

  const handleRefresh = () => {
    refresh();
    setFilterType("all");
    setSearchTerm("");
  };

  if (loading && conversations.length === 0) {
    return <ConversationListSkeleton />;
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-white p-4">
        <div className="text-center space-y-4">
          <div className="rounded-full bg-red-100 p-3 inline-flex">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <p className="text-red-600 font-medium">
            Lỗi khi tải danh sách hội thoại
          </p>
          <Button
            variant="outline"
            onClick={handleRefresh}
            className="rounded-lg border-gray-300"
          >
            Thử lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full h-full flex flex-col bg-white border-r border-gray-200">
        {/* Header */}
        <ConversationHeader
          searchTerm={searchTerm}
          filterType={filterType}
          onSearchChange={handleSearchChange}
          onFilterChange={handleFilterChange}
          onNewGroup={handleCreateNewGroup}
          isLoading={loading}
        />

        {/* Conversation List Content */}
        <div className="flex-1 overflow-y-auto p-3 bg-gray-50">
          <ConversationList
            conversations={conversations}
            selectedConversationId={selectedConversationId}
            hasMore={hasMore}
            isLoading={loading}
            isFiltering={filterType !== "all"}
            filterType={filterType}
            onSelectConversation={handleSelectConversation}
            onLoadMore={handleLoadMore}
          />
        </div>
      </div>
      <CreateGroupModal
        isOpen={isCreateGroupModalOpen}
        onClose={() => setIsCreateGroupModalOpen(false)}
        onGroupCreate={handleCreateGroup}
        friends={friends}
        isLoading={friendsLoading}
      />
    </>
  );
}
