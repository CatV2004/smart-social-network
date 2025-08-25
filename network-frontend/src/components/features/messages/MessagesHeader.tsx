import { Conversation } from "@/types/message";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Phone, Video, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MessagesHeaderProps {
  conversation: Conversation;
}

export function MessagesHeader({ conversation }: MessagesHeaderProps) {
  const displayUser = conversation.isGroup
    ? { name: conversation.groupName, avatar: conversation.groupAvatar }
    : {
        name: conversation.participants[0].fullName,
        avatar: conversation.participants[0].avatar,
        isOnline: conversation.participants[0].isOnline,
      };

  return (
    <div className="border-b p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={displayUser.avatar} alt={displayUser.name} />
          <AvatarFallback>{displayUser.name?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold">{displayUser.name}</h3>
          {!conversation.isGroup && (
            <p className="text-xs text-muted-foreground">
              {displayUser.isOnline ? "Đang hoạt động" : "Không hoạt động"}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Phone className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <Video className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <Info className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
