import { Attachment } from "@/types/message";
import { FileText, Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface FileMediaProps {
  attachment: Attachment;
  isOwnMessage: boolean;
}

export function FileMedia({ attachment, isOwnMessage }: FileMediaProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getFileIcon = (type: string) => {
    if (type.includes("pdf"))
      return <FileText className="h-5 w-5 text-red-500" />;
    if (type.includes("word") || type.includes("document"))
      return <FileText className="h-5 w-5 text-blue-500" />;
    if (type.includes("sheet") || type.includes("excel"))
      return <FileText className="h-5 w-5 text-green-500" />;
    if (type.includes("zip") || type.includes("rar"))
      return <FileText className="h-5 w-5 text-yellow-500" />;

    return <FileText className="h-5 w-5 text-gray-500" />;
  };

  const getFileExtension = (type: string, originalName: string) => {
    if (type && type.includes("/")) {
      return type.split("/")[1]?.toUpperCase();
    }

    const parts = originalName?.split(".");
    return parts && parts.length > 1 ? parts.pop()?.toUpperCase() : "FILE";
  };

  return (
    <div
      className={`p-3 rounded-lg flex items-center gap-3 transition-all duration-200 ${
        isOwnMessage
          ? "bg-blue-100 border border-blue-200"
          : "bg-gray-100 border border-gray-200"
      } ${isHovered ? "shadow-md transform scale-105" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex-shrink-0">{getFileIcon(attachment.type)}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">
          Tệp đính kèm
        </p>
        <p className="text-xs text-muted-foreground">
          {getFileExtension(attachment.type, "download")} •{" "}
        </p>
      </div>

      {/* Chỉ hiển thị buttons khi hover */}
      {isHovered && (
        <div className="flex gap-1 opacity-100 transition-opacity duration-200">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => {
              window.open(attachment.url, "_blank");
            }}
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => {
              const link = document.createElement("a");
              link.href = attachment.url;
              link.download = "download";
              link.click();
            }}
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
