// components/features/comment/CommentList.tsx
"use client";

import { Comment } from "@/types/comment";
import { CommentItem } from "./CommentItem";
import { Button } from "@/components/ui/button";

interface CommentListProps {
  comments: Comment[];
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  onDeleteComment?: (commentId: string) => void;
  onReplyComment?: (comment: Comment) => void;
  isDeleting?: boolean;
  replyingTo?: Comment | null;
}

export function CommentList({
  comments,
  isLoading,
  hasMore,
  onLoadMore,
  onReplyComment,
  replyingTo,
}: CommentListProps) {
  if (isLoading && comments.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Đang tải bình luận...
      </div>
    );
  }

  return (
    <div className="divide-y">
      {comments.map((comment) => (
        <CommentItem
          key={`comment-${comment.id}`}
          comment={comment}
          onReply={onReplyComment}
          isReplying={replyingTo?.id === comment.id}
        />
      ))}

      {hasMore && (
        <div className="p-4 text-center">
          <Button variant="ghost" onClick={onLoadMore} disabled={isLoading}>
            {isLoading ? "Đang tải..." : "Xem thêm bình luận"}
          </Button>
        </div>
      )}
    </div>
  );
}
