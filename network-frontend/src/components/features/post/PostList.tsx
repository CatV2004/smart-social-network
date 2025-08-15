// components/features/post/PostList.tsx
import { Post } from "@/types/post";
import { PostCard } from "./PostCard";
import LoadingSkeleton from "@/components/common/LoadingSkeleton";

interface PostListProps {
  posts: Post[];
  isLoading?: boolean;
  onLikePost?: (postId: string, liked: boolean) => void;
  onSavePost?: (postId: string, saved: boolean) => void;
  onCommentPost?: (postId: string) => void;
  onSharePost?: (postId: string) => void;
}

export function PostList({
  posts,
  isLoading = false,
  onLikePost,
  onSavePost,
  onCommentPost,
  onSharePost,
}: PostListProps) {
  if (isLoading) {
    return <LoadingSkeleton type="posts" count={3} />;
  }
  console.log("posts: ", posts)

  return (
    <div className="mx-auto max-w-screen-sm">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onLike={onLikePost}
          onSave={onSavePost}
          onComment={onCommentPost}
          onShare={onSharePost}
        />
      ))}
    </div>
  );
}
