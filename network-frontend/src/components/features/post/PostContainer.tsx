"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useFeedPosts } from "@/hooks/useFeedPosts";
import { PostList } from "./PostList";
import LoadingSkeleton from "@/components/common/LoadingSkeleton";
import postApi from "@/lib/api/post.api";
import { Post } from "@/types/post";
import { motion, AnimatePresence } from "framer-motion";
import { FiLoader } from "react-icons/fi";

export function PostContainer() {
  const { items, isLoading, hasMore, loadMore, reload } = useFeedPosts();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Đồng bộ state posts
  useEffect(() => {
    setPosts(items);
    setError(null);
  }, [items]);

  // Xử lý load thêm bài viết
  const handleLoadMore = useCallback(async () => {
    if (!hasMore || isLoading || isLoadingMore) return;

    setIsLoadingMore(true);
    setError(null);

    try {
      loadingTimeoutRef.current = setTimeout(() => {
        setIsLoadingMore(false);
      }, 600);

      await loadMore();
    } catch (err) {
      setError("Không thể tải thêm bài viết");
      setTimeout(() => setError(null), 3000);
    } finally {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
      setIsLoadingMore(false);
    }
  }, [hasMore, isLoading, loadMore, isLoadingMore]);

  // Infinite scroll với IntersectionObserver
  useEffect(() => {
    const currentSentinel = sentinelRef.current;
    if (!currentSentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          handleLoadMore();
        }
      },
      {
        root: null,
        rootMargin: "300px",
        threshold: 0.1,
      }
    );

    observer.observe(currentSentinel);

    return () => {
      if (currentSentinel) {
        observer.unobserve(currentSentinel);
      }
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, [handleLoadMore]);

  // Cập nhật bài viết
  const updatePost = useCallback((postId: string, patch: Partial<Post>) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, ...patch } : p))
    );
  }, []);

  const handleLike = async (postId: string, liked: boolean) => {
    const originalPost = posts.find((p) => p.id === postId);
    if (!originalPost) return;

    // Optimistic update
    updatePost(postId, {
      isReacted: liked,
      likesCount: originalPost.likesCount + (liked ? 1 : -1),
    });

    try {
      await postApi.likePost(postId, liked);
    } catch {
      // Rollback
      updatePost(postId, {
        isReacted: originalPost.isReacted,
        likesCount: originalPost.likesCount,
      });
    }
  };

  const handleSave = async (postId: string, saved: boolean) => {
    const originalPost = posts.find((p) => p.id === postId);
    if (!originalPost) return;

    // Optimistic update
    updatePost(postId, { isSaved: saved });

    try {
      await postApi.savePost(postId, saved);
    } catch {
      // Rollback
      updatePost(postId, { isSaved: originalPost.isSaved });
    }
  };

  return (
    <div className="max-w-xl mx-auto w-full pb-8">
      {/* Trạng thái loading ban đầu */}
      {isLoading && posts.length === 0 ? (
        <div className="space-y-6">
          <LoadingSkeleton type="posts" count={3} />
        </div>
      ) : (
        <>
          {/* Danh sách bài viết */}
          <AnimatePresence initial={false}>
            <PostList
              posts={posts}
              isLoading={false}
              onLikePost={handleLike}
              onSavePost={handleSave}
            />
          </AnimatePresence>

          {/* Loading indicator */}
          <AnimatePresence>
            {isLoadingMore && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="flex justify-center py-6"
              >
                <div className="flex items-center space-x-2 text-gray-500">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{
                      repeat: Infinity,
                      duration: 1,
                      ease: "linear",
                    }}
                  >
                    <FiLoader className="h-5 w-5" />
                  </motion.span>
                  <span>Đang tải thêm...</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Thông báo lỗi */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex justify-center py-4 text-red-500"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sentinel element */}
          <div ref={sentinelRef} className="h-px" />

          {/* Thông báo hết bài viết */}
          {!hasMore && posts.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-gray-400 py-8 text-sm"
            >
              Bạn đã xem hết bài viết
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}
