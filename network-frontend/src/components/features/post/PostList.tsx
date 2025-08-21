// components/features/post/PostList.tsx
import { Post } from "@/types/post";
import { PostCard } from "./PostCard";
import LoadingSkeleton from "@/components/common/LoadingSkeleton";
import { motion, AnimatePresence } from "framer-motion";

interface PostListProps {
  posts: Post[];
  isLoading?: boolean;
  onLikePost?: (postId: string, liked: boolean) => void;
  onSavePost?: (postId: string, saved: boolean) => void;
  onCommentPost?: (postId: string) => void;
  onSharePost?: (postId: string) => void;
  onDeletePost: (post: Post) => void;
  onEditPost: (post: Post) => void;
  deletingPostId?: string | null;
  updatingPostId?: string | null;
  isUpdating: boolean;
}

export function PostList({
  posts,
  isLoading = false,
  onLikePost,
  onSavePost,
  onCommentPost,
  onSharePost,
  onDeletePost,
  onEditPost,
  deletingPostId,
  updatingPostId = null,
  isUpdating = false,
}: PostListProps) {
  if (isLoading) {
    return <LoadingSkeleton type="posts" count={3} />;
  }

  return (
    <div className="mx-auto max-w-screen-sm">
      <AnimatePresence initial={false}>
        {posts.map((post) => (
          <motion.div
            key={post.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: post.id === deletingPostId ? 0 : 1,
              y: 0,
              scale: post.id === deletingPostId ? 0.9 : 1,
            }}
            exit={{
              opacity: 0,
              height: 0,
              transition: { duration: 0.3 },
            }}
            transition={{
              type: "spring",
              stiffness: 350,
              damping: 25,
              opacity: { duration: 0.2 },
            }}
            className={
              post.id === deletingPostId ? "opacity-50 pointer-events-none" : ""
            }
          >
            <PostCard
              post={post}
              onLike={onLikePost}
              onSave={onSavePost}
              onComment={onCommentPost}
              onShare={onSharePost}
              onDelete={onDeletePost}
              isDeleting={post.id === deletingPostId}
              onEdit={onEditPost}
              updatingPostId={updatingPostId}
              isUpdating={isUpdating}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
