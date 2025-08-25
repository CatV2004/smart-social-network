import { Button } from "@/components/ui/button";
import { MessageSquare, Lock } from "lucide-react";

export default function InboxPage() {
  return (
    <div className="h-full flex items-center justify-center flex-col gap-4 text-muted-foreground p-8">
      <div className="bg-primary/10 p-6 rounded-full">
        <MessageSquare className="h-12 w-12 text-primary" />
      </div>
      <h3 className="text-2xl font-semibold text-foreground">
        Tin nhắn của bạn
      </h3>
      <p className="text-center max-w-md">
        Gửi ảnh và tin nhân riêng tư cho bạn bè hoặc nhóm
      </p>
      <Button className="mt-4">Gửi tin nhắn</Button>
      <div className="flex items-center gap-2 mt-8 text-xs">
        <Lock className="h-3 w-3" />
        <span>Tin nhắn của bạn được mã hóa end-to-end</span>
      </div>
    </div>
  );
}
