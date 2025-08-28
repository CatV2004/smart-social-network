// src/components/chat/ConversationListSkeleton.tsx
import { Search, MessageSquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ConversationListSkeleton() {
  return (
    <div className="w-full h-full flex flex-col bg-white border-r border-gray-200">
      {/* Header Skeleton */}
      <div className="p-5 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-5">
          <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              disabled
              className="rounded-full"
            >
              <MessageSquarePlus className="h-5 w-5 text-gray-400" />
            </Button>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Tìm kiếm"
            className="pl-9 bg-gray-100 border-gray-200 rounded-lg"
            disabled
          />
        </div>
      </div>

      {/* Conversation List Skeleton */}
      <div className="flex-1 overflow-y-auto p-3 bg-gray-50 space-y-2">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="flex items-center p-3 rounded-lg bg-white border border-gray-100 animate-pulse"
          >
            <div className="rounded-full bg-gray-200 h-12 w-12"></div>
            <div className="ml-4 flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
