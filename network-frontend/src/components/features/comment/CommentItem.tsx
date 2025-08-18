// components/features/comment/CommentItem.tsx
"use client";

import { Comment } from "@/types/comment";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Icons } from "@/lib/icons";
import { cn } from "@/lib/utils/cn";
import { MentionText } from "@/components/common/MentionText";
import { useEffect, useMemo, useState } from "react";
import { useGetReplies } from "@/hooks/comment/useGetReplies";
import { CommentList } from "./CommentList";

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
  const [showReplies, setShowReplies] = useState(false);
  const {
    data: repliesData,
    isLoading: isLoadingReplies,
    fetchNextPage: fetchMoreReplies,
    hasNextPage: hasMoreReplies,
  } = useGetReplies(comment.id, showReplies);

  const replies = useMemo(
    () => repliesData?.pages.flatMap((page) => page.data) || [],
    [repliesData]
  );

  useEffect(() => {
    if (isReplying) {
      setShowReplies(true);
    }
  }, [isReplying]);

  const toggleReplies = () => {
    setShowReplies(!showReplies);
  };

  const fullName = `${comment.author.user?.firstName || ""} ${
    comment.author.user?.lastName || ""
  }`.trim();

  return (
    <div className="p-4 border-none mb-0">
      {" "}
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

          <p className="text-sm mt-1">
            <MentionText content={comment.content} />
          </p>

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
              <button
                className="text-xs text-blue-500 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                onClick={toggleReplies}
              >
                {showReplies ? (
                  <>
                    <FontAwesomeIcon icon={Icons.chevronUp} size="xs" />
                    Ẩn {comment.repliesCount} phản hồi
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={Icons.chevronDown} size="xs" />
                    Xem {comment.repliesCount} phản hồi
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
      {showReplies && (
        <div className="ml-11 mt-2 pl-4 border-l-2 border-gray-200">
          <CommentList
            comments={replies}
            isLoading={isLoadingReplies}
            hasMore={hasMoreReplies}
            onLoadMore={fetchMoreReplies}
            onReplyComment={onReply}
          />
        </div>
      )}
    </div>
  );
}
