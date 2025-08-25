"use client";

import { useState } from "react";
import { ConversationList } from "@/components/features/messages/ConversationList";
import { Conversation } from "@/types/message";

// Mock data
const mockConversations: Conversation[] = [
  {
    id: "1",
    participants: [
      {
        id: "2",
        username: "quachphongtang",
        fullName: "Quách Phong Tạng",
        isOnline: true,
      },
    ],
    lastMessage: {
      id: "101",
      content: "Xin chào, bạn khỏe không?",
      sender: {
        id: "2",
        username: "quachphongtang",
        fullName: "Quách Phong Tạng",
      },
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      isRead: false,
      type: "text",
    },
    unreadCount: 1,
    isGroup: false,
  },
  {
    id: "2",
    participants: [
      {
        id: "3",
        username: "vothanhnhan",
        fullName: "Võ Thành Nhân",
        isOnline: false,
      },
    ],
    lastMessage: {
      id: "102",
      content: "Hẹn gặp bạn vào ngày mai!",
      sender: {
        id: "1",
        username: "currentuser",
        fullName: "Current User",
      },
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      isRead: true,
      type: "text",
    },
    unreadCount: 0,
    isGroup: false,
  },
  {
    id: "3",
    participants: [
      {
        id: "4",
        username: "nguyendanghoanghieu",
        fullName: "Nguyễn Đặng Hoàng Hiếu",
        isOnline: false,
      },
    ],
    lastMessage: {
      id: "103",
      content: "Bạn đã gửi một file đính kèm",
      sender: {
        id: "4",
        username: "nguyendanghoanghieu",
        fullName: "Nguyễn Đặng Hoàng Hiếu",
      },
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
      isRead: true,
      type: "file",
    },
    unreadCount: 0,
    isGroup: false,
  },
  {
    id: "4",
    participants: [
      {
        id: "5",
        username: "vanhuuduy",
        fullName: "Văn Hữu Duy",
        isOnline: true,
      },
    ],
    lastMessage: {
      id: "104",
      content: "Cảm ơn bạn đã giúp đỡ!",
      sender: {
        id: "5",
        username: "vanhuuduy",
        fullName: "Văn Hữu Duy",
      },
      timestamp: new Date(Date.now() - 1000 * 60 * 26).toISOString(),
      isRead: false,
      type: "text",
    },
    unreadCount: 2,
    isGroup: false,
  },
  {
    id: "5",
    participants: [
      {
        id: "6",
        username: "nayươi",
        fullName: "Na Người",
        isOnline: false,
      },
    ],
    lastMessage: {
      id: "105",
      content: "Dự án đang tiến triển tốt",
      sender: {
        id: "6",
        username: "nayươi",
        fullName: "Na Người",
      },
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      isRead: true,
      type: "text",
    },
    unreadCount: 0,
    isGroup: false,
  },
  {
    id: "6",
    participants: [
      {
        id: "7",
        username: "chiksteak",
        fullName: "CHI-K' | Steak & Pasta",
        isOnline: true,
      },
    ],
    lastMessage: {
      id: "106",
      content: "Đặt bàn thành công cho 4 người",
      sender: {
        id: "7",
        username: "chiksteak",
        fullName: "CHI-K' | Steak & Pasta",
      },
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
      isRead: true,
      type: "text",
    },
    unreadCount: 0,
    isGroup: false,
  },
];

export default function DirectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId);
  };

  return (
    <div className="flex h-screen bg-background">
      <div className="w-80 border-r h-full flex flex-col">
        <ConversationList
          conversations={mockConversations}
          selectedConversationId={selectedConversationId || undefined}
          onSelectConversation={handleSelectConversation}
        />
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}
