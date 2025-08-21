"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Icons } from "@/lib/icons";
import { cn } from "@/lib/utils/cn";

interface PostActionsProps {
  isLiked?: boolean;
  isSaved?: boolean;
  likesCount?: number;
  commentsCount?: number;
  onLike?: (liked: boolean) => void;
  onSave?: (saved: boolean) => void;
  onComment?: () => void;
  onShare?: () => void;
  isDeleting?: boolean; // Thêm prop mới
  hideOptions: boolean;
}

export function PostActions({
  isLiked = false,
  isSaved = false,
  likesCount = 0,
  commentsCount = 0,
  onLike,
  onSave,
  onComment,
  onShare,
  isDeleting = false, // Default value
  hideOptions,
}: PostActionsProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-6 px-4 py-2.5 border-t border-gray-100",
        (isDeleting || hideOptions) && "opacity-50 pointer-events-none" // Thêm class khi đang xóa
      )}
    >
      {/* Like Button with Count */}
      <button
        className="flex items-center gap-1.5 group"
        onClick={() => onLike?.(!isLiked)}
        disabled={isDeleting} // Vô hiệu hóa khi đang xóa
      >
        <div className="relative p-1.5 rounded-full group-hover:bg-red-50 transition-colors cursor-pointer">
          <FontAwesomeIcon
            icon={isLiked ? Icons.heartRed : Icons.heartWhite}
            className={cn(
              "text-xl transition-all",
              isLiked
                ? "text-red-500 scale-110"
                : "text-gray-700 group-hover:text-red-400",
              isDeleting && "opacity-50" // Làm mờ icon khi đang xóa
            )}
          />
        </div>
        {likesCount > 0 && (
          <span
            className={cn(
              "text-sm font-medium",
              isLiked ? "text-red-500" : "text-gray-500",
              isDeleting && "opacity-50" // Làm mờ số lượng khi đang xóa
            )}
          >
            {likesCount.toLocaleString()}
          </span>
        )}
      </button>

      {/* Comment Button with Count */}
      <button
        className="flex items-center gap-1.5 group cursor-pointer"
        onClick={onComment}
        disabled={isDeleting} // Vô hiệu hóa khi đang xóa
      >
        <div className="p-1.5 rounded-full group-hover:bg-blue-50 transition-colors">
          <FontAwesomeIcon
            icon={Icons.comment}
            className={cn(
              "text-xl text-gray-700 group-hover:text-blue-500 transition-colors",
              isDeleting && "opacity-50" // Làm mờ icon khi đang xóa
            )}
          />
        </div>
        {commentsCount > 0 && (
          <span
            className={cn(
              "text-sm font-medium text-gray-500",
              isDeleting && "opacity-50" // Làm mờ số lượng khi đang xóa
            )}
          >
            {commentsCount.toLocaleString()}
          </span>
        )}
      </button>

      {/* Share Button */}
      <button
        className="p-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
        onClick={onShare}
        disabled={isDeleting} // Vô hiệu hóa khi đang xóa
      >
        <FontAwesomeIcon
          icon={Icons.share}
          className={cn(
            "text-xl text-gray-700 hover:text-gray-900 transition-colors",
            isDeleting && "opacity-50" // Làm mờ icon khi đang xóa
          )}
        />
      </button>

      {/* Save Button */}
      <button
        className="ml-auto p-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
        onClick={() => onSave?.(!isSaved)}
        disabled={isDeleting} // Vô hiệu hóa khi đang xóa
      >
        <FontAwesomeIcon
          icon={isSaved ? Icons.saveBlack : Icons.saveWhite}
          className={cn(
            "text-xl transition-colors",
            isSaved ? "text-gray-900" : "text-gray-700 hover:text-gray-900",
            isDeleting && "opacity-50" // Làm mờ icon khi đang xóa
          )}
        />
      </button>
    </div>
  );
}
