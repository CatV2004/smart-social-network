// components/features/comment/CommentItem.tsx
"use client";

import { Comment } from "@/types/comment";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Icons } from "@/lib/icons";
import { cn } from "@/lib/utils/cn";

interface CommentItemProps {
  comment: Comment;
  onReply?: (comment: Comment) => void;
  isReplying?: boolean;
}

export function CommentItem({
  comment,
  onReply,
  isReplying,
}: CommentItemProps) {
  const fullName = `${comment.author.user?.firstName || ""} ${
    comment.author.user?.lastName || ""
  }`.trim();

  return (
    <div className="p-4">
      <div className="flex gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={comment.author.avatar} />
          <AvatarFallback>
            {comment.author.user?.firstName?.charAt(0)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">{fullName}</span>

            <span className="text-gray-500 text-xs">
              {new Date(comment.createdAt).toLocaleString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
              {comment.isEdited && " · Đã chỉnh sửa"}
            </span>

            {comment.isPinned && (
              <span className="ml-2 text-xs bg-yellow-100 text-yellow-600 px-2 py-0.5 rounded-full">
                Ghim
              </span>
            )}
          </div>

          <p className="text-sm mt-1">{comment.content}</p>

          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
            <button className="flex items-center gap-1 hover:text-gray-700">
              <FontAwesomeIcon
                icon={Icons.heartWhite}
                className={cn("hover:text-red-500", "text-gray-500")}
                size="xs"
              />
            </button>

            <button
              className={cn(
                "hover:text-gray-700 cursor-pointer",
                isReplying && "text-blue-500 font-medium cursor-pointer"
              )}
              onClick={() => onReply?.(comment)}
            >
              {isReplying ? "Đang phản hồi..." : "Phản hồi"}
            </button>

            {comment.repliesCount > 0 && (
              <button className="hover:text-gray-700 font-medium cursor-pointer">
                {comment.repliesCount} phản hồi
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
