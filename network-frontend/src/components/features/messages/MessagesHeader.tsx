"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Phone, Video, Info, MoreVertical, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { conversationResponse } from "@/types/conversation";
import { Badge } from "@/components/ui/badge";
import { useOnlineUsers } from "@/hooks/chat/useOnlineUsers";

interface MessagesHeaderProps {
  conversation: conversationResponse | null;
}

export function MessagesHeader({ conversation }: MessagesHeaderProps) {
  const displayName = conversation?.displayName;
  const displayAvatar = conversation?.displayAvatar;
  const { onlineUsers } = useOnlineUsers();

  console.log("conversation.targetUserId: ", conversation?.targetUserId);

  const isOnline =
    !conversation?.isGroup && conversation?.targetUserId
      ? onlineUsers.includes(conversation.targetUserId)
      : false;

  return (
    <div className="border-b border-gray-200 p-4 flex items-center justify-between bg-white shadow-sm">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 border-2 border-white shadow-md">
          {displayAvatar ? (
            <AvatarImage src={displayAvatar} alt={displayName} />
          ) : (
            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              {displayName?.charAt(0) ?? "?"}
            </AvatarFallback>
          )}
        </Avatar>
        <div>
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            {displayName}
            {conversation?.isGroup && (
              <Badge variant="outline" className="text-xs py-0 px-1.5">
                <Users className="h-3 w-3 mr-1" /> Nhóm
              </Badge>
            )}
          </h3>
          {!conversation?.isGroup && (
            <p className="text-xs text-muted-foreground flex items-center">
              <span
                className={`h-2 w-2 rounded-full mr-1 ${
                  isOnline ? "bg-green-500" : "bg-gray-400"
                }`}
              ></span>
              {isOnline ? "Đang hoạt động" : "Ngoại tuyến"}
            </p>
          )}
          {conversation?.isGroup && (
            <p className="text-xs text-muted-foreground">
              {conversation.memberCount || 0} thành viên
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full text-gray-600 hover:text-blue-600 hover:bg-blue-50"
        >
          <Phone className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full text-gray-600 hover:text-blue-600 hover:bg-blue-50"
        >
          <Video className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full text-gray-600 hover:text-blue-600 hover:bg-blue-50"
        >
          <Info className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full text-gray-600 hover:text-gray-800"
        >
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
