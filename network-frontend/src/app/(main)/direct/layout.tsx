"use client";

import { ConversationContainer } from "@/components/features/messages/ConversationContainer";

export default function DirectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar chứa danh sách hội thoại */}
      <div className="w-100 border-r border-gray-200 h-full flex flex-col bg-white">
        <ConversationContainer />
      </div>

      {/* Phần nội dung chính - chi tiết hội thoại */}
      <div className="flex-1 flex flex-col">{children}</div>
    </div>
  );
}
