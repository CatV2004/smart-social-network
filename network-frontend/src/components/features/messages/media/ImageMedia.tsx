import { Attachment } from "@/types/message";
import { Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ImageMediaProps {
  attachment: Attachment;
  isOwnMessage: boolean;
}

export function ImageMedia({ attachment, isOwnMessage }: ImageMediaProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  return (
    <>
      <div className="relative">
        <img
          src={attachment.url}
          alt={"Image"}
          className="rounded-lg max-w-full max-h-64 object-cover cursor-pointer transition-transform duration-200 hover:scale-105"
          onClick={() => setIsPreviewOpen(true)}
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 opacity-0 hover:bg-opacity-30 hover:opacity-100 transition-all duration-200 flex items-center justify-center rounded-lg">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full bg-white bg-opacity-80 text-gray-800 hover:bg-white hover:bg-opacity-100"
            onClick={() => setIsPreviewOpen(true)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full bg-white bg-opacity-80 text-gray-800 hover:bg-white hover:bg-opacity-100 ml-2"
            onClick={(e) => {
              e.stopPropagation();
              const link = document.createElement("a");
              link.href = attachment.url;
              link.download = "download";
              link.click();
            }}
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent
          className="max-w-4xl"
          overlayProps={{ dimOpacity: 10, blur: false }}
        >
          <DialogHeader>
            <DialogTitle>Xem hình ảnh</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center">
            <img
              src={attachment.url}
              alt="Image"
              className="max-h-[70vh] max-w-full object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
