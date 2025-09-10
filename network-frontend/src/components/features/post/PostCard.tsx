// components/features/post/PostCard.tsx
"use client";

import { Post } from "@/types/post";
import { PostHeader } from "./PostHeader";
import { PostMedia } from "./PostMedia";
import { PostActions } from "./PostActions";
import { PostFooter } from "./PostFooter";
import { useState } from "react";
import { PostCommentModal } from "@/components/shared/modals/PostCommentModal";
import { motion } from "framer-motion";

interface PostCardProps {
  post: Post;
  onLike?: (postId: string, liked: boolean) => void;
  onSave?: (postId: string, saved: boolean) => void;
  onComment?: (postId: string) => void;
  onShare?: (postId: string) => void;
  onDelete?: (post: Post) => void;
  onEdit?: (post: Post) => void;
  onReport?: (post: Post) => void;
  updatingPostId: string | null;
  isUpdating: boolean;
  isDeleting?: boolean;
  hideOptions?: boolean;
  compact?: boolean;
}

export function PostCard({
  post,
  onLike,
  onSave,
  onComment,
  onShare,
  onDelete,
  onEdit,
  onReport,
  isDeleting = false,
  hideOptions = false,
  updatingPostId,
  isUpdating = false,
}: PostCardProps) {
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);

  const handleCommentClick = () => {
    setIsCommentModalOpen(true);
    onComment?.(post.id);
  };

  const handleDelete = () => {
    onDelete?.(post);
  };

  const handleEdit = () => {
    onEdit?.(post);
  };

  return (
    <>
      <motion.article
        className={`
          bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden
          ${hideOptions ? "mb-0" : "mb-6"}
          ${isDeleting ? "opacity-50 pointer-events-none" : ""}
          ${
            updatingPostId === post.id
              ? "ring-2 ring-blue-500 ring-opacity-50"
              : ""
          }
        `}
        initial={{ opacity: 1 }}
        animate={{
          opacity: isDeleting ? 0.5 : 1,
          scale: isDeleting ? 0.98 : 1,
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative p-4 ">
          <div className="flex justify-center">
            <div
              className="
                relative 
                overflow-hidden 
                rounded-2xl 
                border border-gray-200 
                bg-gradient-to-b from-white to-[#f9fafb] 
                shadow-[0_8px_20px_rgba(0,0,0,0.08),0_2px_6px_rgba(0,0,0,0.05)] 
                hover:scale-[1.01] hover:shadow-[0_12px_24px_rgba(0,0,0,0.12)] 
                transition-all duration-300 ease-in-out
                max-w-4xl w-full
              "
            >
              <PostMedia media={post.media} />
            </div>
          </div>

          {/* Header overlay */}
          <div className="absolute top-6 left-6 right-6 z-10">
            <PostHeader
              post={post}
              author={post.author}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onReport={onReport}
              isDeleting={isDeleting}
              hideOptions={hideOptions}
            />
          </div>
        </div>

        <PostActions
          isLiked={post.isReacted}
          isSaved={post.isSaved}
          likesCount={post.likesCount}
          commentsCount={post.commentsCount || 0}
          onLike={(liked) => onLike?.(post.id, liked)}
          onSave={(saved) => onSave?.(post.id, saved)}
          onComment={handleCommentClick}
          onShare={() => onShare?.(post.id)}
          isDeleting={isDeleting} // Truyền xuống PostActions
          hideOptions={hideOptions}
        />

        <PostFooter
          content={post.content}
          author={post.author}
          createdAt={post.createdAt}
          isDeleting={isDeleting} // Truyền xuống PostFooter
        />
      </motion.article>

      <PostCommentModal
        post={post}
        isOpen={isCommentModalOpen}
        onClose={() => setIsCommentModalOpen(false)}
      />
    </>
  );
}
