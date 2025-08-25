import { Message } from "@/types/message";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import dayjs from "dayjs";
import "dayjs/locale/vi";

dayjs.locale("vi");

interface MessageItemProps {
  message: Message;
  isOwnMessage: boolean;
}

export function MessageItem({ message, isOwnMessage }: MessageItemProps) {
  return (
    <div
      className={`flex gap-2 mb-4 ${
        isOwnMessage ? "justify-end" : "justify-start"
      }`}
    >
      {!isOwnMessage && (
        <Avatar className="h-8 w-8">
          <AvatarImage
            src={message.sender.avatar}
            alt={message.sender.fullName}
          />
          <AvatarFallback>{message.sender.fullName.charAt(0)}</AvatarFallback>
        </Avatar>
      )}
      <div className={`max-w-xs ${isOwnMessage ? "order-first" : ""}`}>
        {!isOwnMessage && (
          <p className="text-xs text-muted-foreground mb-1 ml-1">
            {message.sender.fullName}
          </p>
        )}
        <div
          className={`rounded-lg px-3 py-2 ${
            isOwnMessage ? "bg-primary text-primary-foreground" : "bg-muted"
          }`}
        >
          <p className="text-sm">{message.content}</p>
        </div>
        <p
          className={`text-xs text-muted-foreground mt-1 ${
            isOwnMessage ? "text-right" : "text-left"
          }`}
        >
          {dayjs(message.timestamp).format("HH:mm")}
        </p>
      </div>
    </div>
  );
}
