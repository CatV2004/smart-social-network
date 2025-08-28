import { Attachment } from "@/types/message";
import { ImageMedia } from "./ImageMedia";
import { FileMedia } from "./FileMedia";
import { VideoMedia } from "./VideoMedia";

interface MediaRendererProps {
  attachment: Attachment;
  isOwnMessage: boolean;
}

export function MediaRenderer({
  attachment,
  isOwnMessage,
}: MediaRendererProps) {
  const { type } = attachment;

  if (type === "image") {
    return <ImageMedia attachment={attachment} isOwnMessage={isOwnMessage} />;
  }

  if (type === "video") {
    return <VideoMedia attachment={attachment} isOwnMessage={isOwnMessage} />;
  }

  if (!type) {
    return <FileMedia attachment={attachment} isOwnMessage={isOwnMessage} />;
  }

  if (type.startsWith("audio/")) {
    // Có thể tạo AudioMedia component nếu cần
    return <FileMedia attachment={attachment} isOwnMessage={isOwnMessage} />;
  }

  // Mặc định hiển thị dạng file
  return <FileMedia attachment={attachment} isOwnMessage={isOwnMessage} />;
}
