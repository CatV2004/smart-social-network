"use client";

import { useParams } from "next/navigation";
import { MessagesHeader } from "@/components/features/messages/MessagesHeader";
import { MessageList } from "@/components/features/messages/MessageList";
import { MessageInput } from "@/components/features/messages/MessageInput";
import { Conversation, Message } from "@/types/message";
import { useEffect, useState } from "react";

// Mock data
const mockConversations: Record<string, Conversation> = {
  "1": {
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
  "2": {
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
  "3": {
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
  "4": {
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
  "5": {
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
  "6": {
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
};

const mockMessages: Record<string, Message[]> = {
  "1": [
    {
      id: "1",
      content: "Xin chào!",
      sender: {
        id: "2",
        username: "quachphongtang",
        fullName: "Quách Phong Tạng",
      },
      timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
      isRead: true,
      type: "text",
    },
    {
      id: "2",
      content: "Chào bạn! Mình khỏe, còn bạn?",
      sender: {
        id: "1",
        username: "currentuser",
        fullName: "Current User",
      },
      timestamp: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
      isRead: true,
      type: "text",
    },
    {
      id: "3",
      content: "Mình cũng khỏe. Bạn đang làm gì thế?",
      sender: {
        id: "2",
        username: "quachphongtang",
        fullName: "Quách Phong Tạng",
      },
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      isRead: false,
      type: "text",
    },
  ],
  "4": [
    {
      id: "10",
      content: "Chào bạn, mình cần hỏi về dự án",
      sender: {
        id: "5",
        username: "vanhuuduy",
        fullName: "Văn Hữu Duy",
      },
      timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      isRead: true,
      type: "text",
    },
    {
      id: "11",
      content: "Mình sẵn sàng giúp đỡ, bạn cần gì?",
      sender: {
        id: "1",
        username: "currentuser",
        fullName: "Current User",
      },
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      isRead: true,
      type: "text",
    },
    {
      id: "12",
      content: "Mình đang gặp vấn đề với API integration",
      sender: {
        id: "5",
        username: "vanhuuduy",
        fullName: "Văn Hữu Duy",
      },
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      isRead: true,
      type: "text",
    },
    {
      id: "13",
      content: "Mình có thể hướng dẫn bạn cách fix",
      sender: {
        id: "1",
        username: "currentuser",
        fullName: "Current User",
      },
      timestamp: new Date(Date.now() - 1000 * 60 * 28).toISOString(),
      isRead: true,
      type: "text",
    },
    {
      id: "14",
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
  ],
};

export default function ConversationPage() {
  const params = useParams();
  const conversationId = params.conversationId as string;
  const [messages, setMessages] = useState<Message[]>([]);

  const conversation = mockConversations[conversationId];
  const currentUserId = "1"; // ID của người dùng hiện tại

  useEffect(() => {
    // Load messages for this conversation
    setMessages(mockMessages[conversationId] || []);
  }, [conversationId]);

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: {
        id: currentUserId,
        username: "currentuser",
        fullName: "Current User",
      },
      timestamp: new Date().toISOString(),
      isRead: false,
      type: "text",
    };

    setMessages((prev) => [...prev, newMessage]);
  };

  if (!conversation) {
    return (
      <div className="h-full flex items-center justify-center">
        <p>Cuộc trò chuyện không tồn tại</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <MessagesHeader conversation={conversation} />
      <MessageList messages={messages} currentUserId={currentUserId} />
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
}
