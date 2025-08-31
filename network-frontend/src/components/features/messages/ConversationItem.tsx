import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";
import { conversationResponse } from "@/types/conversation";
import { useAppSelector } from "@/redux/hooks";
import { cn } from "@/lib/utils/cn";
import { selectMyProfile } from "@/redux/features/profile/profileSelectors";

dayjs.extend(relativeTime);
dayjs.locale("vi");

interface ConversationItemProps {
  conversation: conversationResponse;
  isActive: boolean;
  onClick: () => void;
}

export function ConversationItem({
  conversation,
  isActive,
  onClick,
}: ConversationItemProps) {
  const profile = useAppSelector(selectMyProfile);
  console.log("profile: ", profile);
  const displayInfo = {
    name:
      conversation.displayName ||
      (conversation.isGroup ? "Nhóm chat" : "Người dùng"),
    avatar:
      conversation.displayAvatar ||
      (conversation.isGroup ? "/group-avatar.png" : "/user-avatar.png"),
    isGroup: conversation.isGroup,
  };

  const lastMessage = conversation.lastMessage;
  const hasUnread = conversation.unreadCount > 0;

  const getLastMessageContent = () => {
    if (!lastMessage) return "Bắt đầu cuộc trò chuyện";

    const { content, attachments, senderFullName, senderId } = lastMessage;

    let prefix = "";
    if (conversation.isGroup) {
      prefix = senderFullName;
    } else {
      prefix = senderId === profile?.user?.id ? "Bạn" : senderFullName;
    }

    if (attachments && attachments.length > 0) {
      const type = attachments[0].type;
      if (type === "image") return `${prefix}: 📷 Hình ảnh`;
      if (type === "video") return `${prefix}: 🎥 Video`;
      if (type === "file") return `${prefix}: 📎 Tệp tin`;
    }

    return `${prefix}: ${content}`;
  };

  const getMessagePreview = () => {
    const content = getLastMessageContent();
    return content.length > 50 ? content.substring(0, 50) + "..." : content;
  };

  return (
    <div
      className={cn(
        "flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 group border border-transparent",
        isActive
          ? "bg-blue-50 border-blue-200"
          : hasUnread
          ? "bg-white border-gray-200 hover:bg-gray-50"
          : "bg-white border-gray-100 hover:bg-gray-50"
      )}
      onClick={onClick}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <Avatar
          className={cn(
            "h-12 w-12 ring-2 transition-all",
            hasUnread ? "ring-blue-100" : "ring-gray-100"
          )}
        >
          <AvatarImage
            src={displayInfo.avatar}
            alt={displayInfo.name}
            className="object-cover"
          />
          <AvatarFallback className="bg-gradient-to-br from-gray-200 to-gray-100 text-gray-600">
            {displayInfo.name?.charAt(0)?.toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>

        {/* Group indicator */}
        {conversation.isGroup && (
          <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center">
            <span className="text-[10px] text-white font-bold">G</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="ml-4 flex-1 min-w-0 space-y-1">
        {/* Header: Name + Time */}
        <div className="flex justify-between items-center gap-2">
          <p
            className={cn(
              "text-base font-semibold truncate",
              hasUnread ? "text-gray-900" : "text-gray-700"
            )}
          >
            {displayInfo.name}
          </p>

          {lastMessage && (
            <span
              className={cn(
                "text-xs whitespace-nowrap flex-shrink-0",
                hasUnread ? "text-blue-600" : "text-gray-400"
              )}
            >
              {dayjs(lastMessage.createdAt).fromNow()}
            </span>
          )}
        </div>

        <div className="flex justify-between items-center gap-2">
          <p
            className={cn(
              "text-sm truncate flex-1",
              hasUnread ? "text-gray-900 font-medium" : "text-gray-500"
            )}
          >
            {getMessagePreview()}
          </p>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            {conversation.isPinned && (
              <svg
                className="h-3.5 w-3.5 text-gray-400"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M4 0h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm0 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H4z" />
                <path d="M8 4a.5.5 0 0 1 .5.5v3.5a.5.5 0 0 1-1 0V4.5A.5.5 0 0 1 8 4z" />
              </svg>
            )}

            {hasUnread && (
              <Badge
                className={cn(
                  "min-w-[20px] h-5 rounded-full p-0 flex items-center justify-center",
                  conversation.unreadCount > 9 ? "px-1" : "w-5",
                  "bg-blue-600 text-white text-xs font-medium"
                )}
              >
                {conversation.unreadCount > 99
                  ? "99+"
                  : conversation.unreadCount}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
