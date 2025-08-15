"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Icons } from "@/lib/icons";
import { cn } from "@/lib/utils/cn";

interface PostActionsProps {
  isLiked?: boolean;
  isSaved?: boolean;
  onLike?: (liked: boolean) => void;
  onSave?: (saved: boolean) => void;
  onComment?: () => void;
  onShare?: () => void;
}

export function PostActions({
  isLiked = false,
  isSaved = false,
  onLike,
  onSave,
  onComment,
  onShare,
}: PostActionsProps) {
  return (
    <div className="flex items-center gap-4 p-3 border-b">
      <button className="cursor-pointer" onClick={() => onLike?.(!isLiked)}>
        <FontAwesomeIcon
          icon={isLiked ? Icons.heartRed : Icons.heartWhite}
          className={cn(
            "text-2xl transition-colors duration-200",
            isLiked ? "text-red-500" : "text-black"
          )}
        />
      </button>

      <button className="cursor-pointer" onClick={onComment}>
        <FontAwesomeIcon icon={Icons.comment} className="text-2xl" />
      </button>

      <button className="cursor-pointer" onClick={onShare}>
        <FontAwesomeIcon icon={Icons.share} className="text-2xl" />
      </button>

      <button
        className="ml-auto cursor-pointer"
        onClick={() => onSave?.(!isSaved)}
      >
        <FontAwesomeIcon
          icon={isSaved ? Icons.saveBlack : Icons.saveWhite}
          className="text-2xl"
        />
      </button>
    </div>
  );
}
