import { Attachment } from "@/types/message";
import { Play, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface VideoMediaProps {
  attachment: Attachment;
  isOwnMessage: boolean;
}

export function VideoMedia({ attachment, isOwnMessage }: VideoMediaProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="relative">
      {!isPlaying ? (
        <>
          <div className="w-64 h-36 bg-gray-200 rounded-lg flex items-center justify-center cursor-pointer transition-transform duration-200 hover:scale-105">
            <div className="text-center">
              <Button
                variant="ghost"
                size="icon"
                className="h-12 w-12 rounded-full bg-white bg-opacity-80 text-gray-800 hover:bg-white hover:bg-opacity-100 mb-2"
                onClick={() => setIsPlaying(true)}
              >
                <Play className="h-6 w-6 fill-current" />
              </Button>
              <p className="text-xs text-gray-600">Video</p>
            </div>
          </div>
          <div className="absolute top-2 right-2 opacity-0 hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-full bg-white bg-opacity-80 text-gray-800 hover:bg-white hover:bg-opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                const link = document.createElement("a");
                link.href = attachment.url;
                link.download = "download";
                link.click();
              }}
            >
              <Download className="h-3 w-3" />
            </Button>
          </div>
        </>
      ) : (
        <video
          controls
          className="rounded-lg max-w-full max-h-64 transition-transform duration-200 hover:scale-105"
          onEnded={() => setIsPlaying(false)}
        >
          <source src={attachment.url} type={attachment.type} />
          Trình duyệt của bạn không hỗ trợ video.
        </video>
      )}
    </div>
  );
}
