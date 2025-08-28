"use client";

import { conversationResponse } from "@/types/conversation";
import { conversationApi } from "@/lib/api/conversation.api";
import { useEffect, useState } from "react";

interface TypingIndicatorProps {
  typingUsers: Set<string>;
  conversation: conversationResponse | null;
}

export function TypingIndicator({
  typingUsers,
  conversation,
}: TypingIndicatorProps) {
  const [membersMap, setMembersMap] = useState<Record<string, string>>({});
  useEffect(() => {
    if (!conversation) return;

    const fetchMembers = async () => {
      try {
        const res = await conversationApi.getConversationMembers(
          conversation.id
        );
        const map: Record<string, string> = {};
        res.data.forEach((member) => {
          map[member.profile.user!.id] = member.profile.user!.username;
        });
        setMembersMap(map);
      } catch (err) {
        console.error("Failed to fetch conversation members:", err);
      }
    };

    fetchMembers();
  }, [conversation]);

  // Map userId trong typingUsers sang username
  const typingUserNames = Array.from(typingUsers)
    .map((userId) => membersMap[userId] || `User ${userId.substring(0, 8)}`)
    .filter(Boolean);

  if (typingUserNames.length === 0) return null;

  return (
    <div className="px-4 py-2 flex items-center text-sm text-gray-500">
      <div className="flex items-center">
        <div className="flex space-x-1 mr-2">
          <div
            className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          />
          <div
            className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          />
          <div
            className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          />
        </div>
        <span>
          {typingUserNames.length === 1
            ? `${typingUserNames[0]} đang soạn tin...`
            : `${typingUserNames.join(", ")} đang soạn tin...`}
        </span>
      </div>
    </div>
  );
}
