// components/features/post/PostCard.tsx
"use client";

import { Post } from "@/types/post";
import { PostHeader } from "./PostHeader";
import { PostMedia } from "./PostMedia";
import { PostActions } from "./PostActions";
import { PostFooter } from "./PostFooter";
import { useState } from "react";
import { PostCommentModal } from "@/components/shared/modals/PostCommentModal";

interface PostCardProps {
  post: Post;
  onLike?: (postId: string, liked: boolean) => void;
  onSave?: (postId: string, saved: boolean) => void;
  onComment?: (postId: string) => void;
  onShare?: (postId: string) => void;
}

export function PostCard({
  post,
  onLike,
  onSave,
  onComment,
  onShare,
}: PostCardProps) {
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);

  const handleCommentClick = () => {
    setIsCommentModalOpen(true);
    onComment?.(post.id);
  };

  return (
    <>
      <article className="bg-white border rounded-lg mb-6 overflow-hidden">
        <PostHeader author={post.author} />
        <PostMedia media={post.media} />
        <PostActions
          isLiked={post.isReacted}
          isSaved={post.isSaved}
          onLike={(liked) => onLike?.(post.id, liked)}
          onSave={(saved) => onSave?.(post.id, saved)}
          onComment={handleCommentClick}
          onShare={() => onShare?.(post.id)}
        />
        <PostFooter
          content={post.content}
          author={post.author}
          likesCount={post.likesCount}
          commentsCount={post.commentsCount || 0}
          createdAt={post.createdAt}
          onComment={handleCommentClick}
        />
      </article>

      <PostCommentModal
        post={post}
        isOpen={isCommentModalOpen}
        onClose={() => setIsCommentModalOpen(false)}
      />
    </>
  );
}
