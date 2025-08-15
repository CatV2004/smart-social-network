// components/features/post/PostCard.tsx
"use client";

import { Post } from "@/types/post";
import { PostHeader } from "./PostHeader";
import { PostMedia } from "./PostMedia";
import { PostActions } from "./PostActions";
import { PostFooter } from "./PostFooter";

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
  console.log("post.likesCoun: ", post);
  return (
    <article className="bg-white border rounded-lg mb-6 overflow-hidden">
      {/* Header hiển thị avatar + tên tác giả */}
      <PostHeader author={post.author} />

      {/* Media hiển thị ảnh/video */}
      <PostMedia media={post.media} />

      {/* Actions: like, comment, share, save */}
      <PostActions
        isLiked={post.isReacted}
        isSaved={post.isSaved}
        onLike={(liked) => onLike?.(post.id, liked)}
        onSave={(saved) => onSave?.(post.id, saved)}
        onComment={() => onComment?.(post.id)}
        onShare={() => onShare?.(post.id)}
      />

      {/* Footer: nội dung + số like/comment */}
      <PostFooter
        content={post.content}
        author={post.author}
        likesCount={post.likesCount}
        commentsCount={post.commentsCount || 0}
        createdAt={post.createdAt}
      />
    </article>
  );
}
