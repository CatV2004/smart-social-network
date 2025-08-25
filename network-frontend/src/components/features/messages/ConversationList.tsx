"use client";

import { useState } from "react";
import { Conversation } from "@/types/message";
import { ConversationItem } from "./ConversationItem";
import { Input } from "@/components/ui/input";
import { Search, MessageSquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversationId?: string;
  onSelectConversation?: (conversationId: string) => void; // Thêm prop này
}

export function ConversationList({
  conversations,
  selectedConversationId,
  onSelectConversation, // Nhận prop
}: ConversationListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const filteredConversations = conversations.filter((conversation) => {
    const displayName = conversation.isGroup
      ? conversation.groupName
      : conversation.participants[0].fullName;

    return displayName?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleSelectConversation = (conversationId: string) => {
    if (onSelectConversation) {
      onSelectConversation(conversationId); // Gọi callback nếu có
    }
    router.push(`/direct/t/${conversationId}`);
  };

  const handleNewMessage = () => {
    // Logic để tạo tin nhắn mới
    console.log("Create new message");
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Tin nhắn</h2>
          <Button variant="ghost" size="icon" onClick={handleNewMessage}>
            <MessageSquarePlus className="h-5 w-5" />
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm"
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.map((conversation) => (
          <ConversationItem
            key={conversation.id}
            conversation={conversation}
            isActive={selectedConversationId === conversation.id}
            onClick={() => handleSelectConversation(conversation.id)}
          />
        ))}
      </div>
    </div>
  );
}
