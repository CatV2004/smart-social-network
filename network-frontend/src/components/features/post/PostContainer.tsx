"use client";

import { useEffect, useState } from "react";
import { useFeedPosts } from "@/hooks/useFeedPosts";
import { PostList } from "./PostList";
import { Button } from "@/components/ui/button";
import postApi from "@/lib/api/post.api";
import { Post } from "@/types/post";

export function PostContainer() {
  const { items, isLoading, hasMore, loadMore, reload } = useFeedPosts();
  const [posts, setPosts] = useState<Post[]>([]);

  // đồng bộ posts từ hook
  useEffect(() => {
    setPosts(items);
  }, [items]);

  const updatePost = (postId: string, patch: Partial<Post>) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, ...patch } : p))
    );
  };

  const handleLike = async (postId: string, liked: boolean) => {
    const original = posts.find((p) => p.id === postId);
    updatePost(postId, {
      isReacted: liked,
      likesCount: (original?.likesCount || 0) + (liked ? 1 : -1),
    });

    try {
      await postApi.likePost(postId, liked);
    } catch {
      reload(); // rollback bằng cách refetch
    }
  };

  const handleSave = async (postId: string, saved: boolean) => {
    updatePost(postId, { isSaved: saved });

    try {
      await postApi.savePost(postId, saved);
    } catch {
      reload();
    }
  };

  return (
    <div className="max-w-xl mx-auto w-full">
      <PostList
        posts={posts}
        isLoading={isLoading && posts.length === 0}
        onLikePost={handleLike}
        onSavePost={handleSave}
      />

      {hasMore && (
        <div className="flex justify-center my-4">
          <Button onClick={loadMore} disabled={isLoading} variant="outline">
            {isLoading ? "Đang tải..." : "Tải thêm"}
          </Button>
        </div>
      )}
    </div>
  );
}
