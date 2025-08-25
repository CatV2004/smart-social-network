import { Conversation } from "@/types/message";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";

dayjs.extend(relativeTime);
dayjs.locale("vi");

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
}

export function ConversationItem({
  conversation,
  isActive,
  onClick,
}: ConversationItemProps) {
  const displayUser = conversation.isGroup
    ? { name: conversation.groupName, avatar: conversation.groupAvatar }
    : {
        name: conversation.participants[0].fullName,
        avatar: conversation.participants[0].avatar,
        username: conversation.participants[0].username,
        isOnline: conversation.participants[0].isOnline,
      };

  return (
    <div
      className={`flex items-center p-4 hover:bg-accent cursor-pointer ${
        isActive ? "bg-accent" : ""
      }`}
      onClick={onClick}
    >
      <div className="relative">
        <Avatar className="h-12 w-12">
          <AvatarImage src={displayUser.avatar} alt={displayUser.name} />
          <AvatarFallback>{displayUser.name?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>
        {!conversation.isGroup && displayUser.isOnline && (
          <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
        )}
      </div>
      <div className="ml-4 flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <p className="text-sm font-medium truncate">{displayUser.name}</p>
          {conversation.lastMessage && (
            <span className="text-xs text-muted-foreground">
              {dayjs(conversation.lastMessage.timestamp).fromNow()}
            </span>
          )}
        </div>
        <div className="flex justify-between items-center mt-1">
          <p className="text-xs text-muted-foreground truncate">
            {conversation.lastMessage?.content || "Bắt đầu cuộc trò chuyện"}
          </p>
          {conversation.unreadCount > 0 && (
            <Badge
              variant="default"
              className="h-5 w-5 rounded-full p-0 flex items-center justify-center"
            >
              {conversation.unreadCount}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
