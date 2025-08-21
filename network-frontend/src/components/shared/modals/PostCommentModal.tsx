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
  
  // Lấy danh sách bình luận - chỉ gọi khi modal mở và có post
  const {
    data: commentsData,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
  } = useGetComments(post?.id || "", isOpen && !!post);

  // Hook tạo bình luận
  const { mutateAsync: createComment, isPending: isCreating } =
    useCreateComment(post?.id || "");

  // Hook xóa bình luận
  const { mutateAsync: deleteComment, isPending: isDeleting } =
    useDeleteComment(post?.id || "");

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
    if (!post) return;

    try {
      if (replyingTo) {
        const parentCommentId = replyingTo.parentId ?? replyingTo.id;
        await createComment({
          content,
          postId: post.id,
          parentCommentId,
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

  // Xử lý reply comment
  const handleReplyComment = (comment: Comment) => {
    setReplyingTo(comment);
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
  };

  // 👇 KIỂM TRA POST SAU TẤT CẢ CÁC HOOK
  if (!post) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" className="h-[90vh]">
      <div className="flex flex-col md:flex-row h-full bg-white rounded-xl overflow-hidden shadow-2xl">
        {/* Phần bài viết bên trái */}
        <div className="md:w-3/5 bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col border-r border-gray-100">
          <div className="p-6">
            <PostHeader
              post={post}
              author={post.author}
              className="text-gray-800"
              optionsClassName="text-gray-500 hover:text-gray-700"
              hideOptions={true}
            />
            {/* Content */}
            {post.content && (
              <p className="mt-4 text-gray-600 text-sm leading-relaxed whitespace-pre-line break-words">
                {post.content}
              </p>
            )}
          </div>

          <div className="flex-1 flex items-center justify-center p-4 pb-8 bg-[#f3f8fd] overflow-hidden">
            <PostMedia
              media={post.media}
              className="max-h-full max-w-full object-contain rounded-xl shadow-md border border-gray-100"
            />
          </div>
        </div>

        {/* Phần comment bên phải */}
        <div className="md:w-2/5 flex flex-col h-full bg-white">
          {/* Header */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-lg text-gray-800">Bình luận</h3>
              {post.commentsCount > 0 && (
                <span className="bg-blue-100 text-blue-600 text-xs font-medium px-2 py-0.5 rounded-full">
                  {post.commentsCount}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
              aria-label="Đóng modal"
            >
              <FontAwesomeIcon icon={Icons.close} className="w-4 h-4" />
            </button>
          </div>

          {/* Danh sách comment */}
          <div className="flex-1 overflow-y-auto bg-gray-50/50">
            {error ? (
              <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                <FontAwesomeIcon
                  icon={Icons.warning}
                  className="text-red-400 text-2xl mb-3"
                />
                <p className="text-red-500 font-medium">
                  Đã xảy ra lỗi khi tải bình luận
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  Vui lòng thử lại sau
                </p>
              </div>
            ) : isLoading ? (
              <div className="flex flex-col items-center justify-center h-full">
                <FontAwesomeIcon
                  icon={Icons.spinner}
                  className="animate-spin text-blue-500 text-xl mb-2"
                />
                <p className="text-gray-500 text-sm">Đang tải bình luận...</p>
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
                {!isLoading && comments.length === 0 && (
                  <div className="h-full flex items-center justify-center">
                    <CommentEmpty />
                  </div>
                )}
              </>
            )}
          </div>

          {/* Form thêm comment */}
          <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4">
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
