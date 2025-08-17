// components/shared/modals/PostCommentModal.tsx
"use client";

import { Post } from "@/types/post";
import { Modal } from "@/components/ui/modal";
import { PostHeader } from "@/components/features/post/PostHeader";
import { PostMedia } from "@/components/features/post/PostMedia";
import { CommentList } from "@/components/features/comment/CommentList";
import { CommentForm } from "@/components/features/comment/CommentForm";
import { CommentEmpty } from "@/components/features/comment/CommentEmpty";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Icons } from "@/lib/icons";
import { useToast } from "@/components/ui/use-toast";
import { useCallback, useMemo, useState } from "react";
import { Comment } from "@/types/comment";
import { useCreateComment } from "@/hooks/comment/useCreateComment";
import { useDeleteComment } from "@/hooks/comment/useDeleteComment";
import { useGetComments } from "@/hooks/comment/useGetComments";

interface PostCommentModalProps {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PostCommentModal({
  post,
  isOpen,
  onClose,
}: PostCommentModalProps) {
  const { toast } = useToast();
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null);
  if (!post) return null;

  // Lấy danh sách bình luận
  const {
    data: commentsData,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
  } = useGetComments(post.id, isOpen);

  // Hook tạo bình luận
  const { mutateAsync: createComment, isPending: isCreating } =
    useCreateComment(post.id);

  // Hook xóa bình luận
  const { mutateAsync: deleteComment, isPending: isDeleting } =
    useDeleteComment(post.id);

  // Format comments từ infinite query
  const comments = useMemo(
    () => commentsData?.pages.flatMap((page) => page.data) || [],
    [commentsData]
  );

  // Tải thêm bình luận
  const loadMore = useCallback(() => {
    if (hasNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, fetchNextPage]);

  // Xử lý submit bình luận
  const handleSubmitComment = async (content: string) => {
    try {
      if (replyingTo) {
        await createComment({
          content,
          postId: post.id,
          parentCommentId: replyingTo.id,
          replyToId: replyingTo.author.id,
        });
      } else {
        await createComment({
          content,
          postId: post.id,
        });
      }

      toast({
        title: "Thành công",
        description: replyingTo
          ? "Phản hồi đã được đăng"
          : "Bình luận đã được đăng",
      });

      setReplyingTo(null);
    } catch (error) {
      toast({
        title: "Lỗi",
        description: replyingTo
          ? "Đăng phản hồi thất bại"
          : "Đăng bình luận thất bại",
        variant: "destructive",
      });
    }
  };

  // Xử lý xóa bình luận
  const handleDeleteComment = async (commentId: string) => {
    if (confirm("Bạn chắc chắn muốn xóa bình luận này?")) {
      try {
        await deleteComment(commentId);
        toast({
          title: "Thành công",
          description: "Bình luận đã được xóa",
        });
      } catch (error) {
        toast({
          title: "Lỗi",
          description: "Xóa bình luận thất bại",
          variant: "destructive",
        });
      }
    }
  };

  // Xử lý reply comment (nếu cần)
  const handleReplyComment = (comment: Comment) => {
    setReplyingTo(comment);
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl" className="h-[90vh]">
      <div className="flex flex-col md:flex-row h-full bg-white rounded-lg overflow-hidden">
        {/* Phần bài viết bên trái */}
        <div className="md:w-1/2 border-r bg-black flex flex-col">
          <div className="p-4 border-b border-gray-800 bg-black">
            <PostHeader
              author={post.author}
              className="text-white"
              optionsClassName="text-gray-300 hover:text-white"
            />
          </div>

          <div className="flex-1 flex items-center justify-center overflow-hidden">
            <PostMedia
              media={post.media}
              className="max-h-full max-w-full object-contain"
            />
          </div>
        </div>

        {/* Phần comment bên phải */}
        <div className="md:w-1/2 flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b flex items-center justify-between sticky top-0 bg-white z-10">
            <h3 className="font-bold text-lg">Bình luận</h3>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Đóng modal"
            >
              <FontAwesomeIcon icon={Icons.close} className="text-gray-500" />
            </button>
          </div>

          {/* Danh sách comment */}
          <div className="flex-1 overflow-y-auto">
            {error ? (
              <div className="p-4 text-red-500 text-center">
                Đã xảy ra lỗi khi tải bình luận
              </div>
            ) : isLoading ? (
              <div className="flex justify-center p-4">
                <FontAwesomeIcon
                  icon={Icons.spinner}
                  className="animate-spin text-gray-500"
                />
              </div>
            ) : (
              <>
                <CommentList
                  comments={comments}
                  isLoading={isLoading}
                  hasMore={hasNextPage}
                  onLoadMore={loadMore}
                  onDeleteComment={handleDeleteComment}
                  onReplyComment={handleReplyComment}
                  isDeleting={isDeleting}
                />
                {!isLoading && comments.length === 0 && <CommentEmpty />}
              </>
            )}
          </div>

          {/* Form thêm comment */}
          <div className="sticky bottom-0 bg-white border-t p-4">
            <CommentForm
              avatarUrl={post.author.avatar}
              avatarFallback={`${post.author.user?.firstName?.charAt(0) ?? ""}${
                post.author.user?.lastName?.charAt(0) ?? ""
              }`}
              onSubmit={handleSubmitComment}
              isSubmitting={isCreating}
              replyingTo={replyingTo}
              onCancelReply={handleCancelReply}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}
