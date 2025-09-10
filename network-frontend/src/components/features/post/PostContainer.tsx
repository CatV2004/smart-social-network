"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { usePosts } from "@/hooks/usePosts";
import { PostList } from "./PostList";
import LoadingSkeleton from "@/components/common/LoadingSkeleton";
import { Post } from "@/types/post";
import { motion, AnimatePresence } from "framer-motion";
import { FiLoader, FiCheck, FiRefreshCw } from "react-icons/fi";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "../../common/ConfirmationDialog";
import { useUpdatePost } from "@/hooks/useUpdatePost";
import { PostEditContainer } from "./PostEditContainer";
import { usePostActions } from "@/hooks/usePostActions";
import { ReportModal } from "../admin/report/ReportModal";

export function PostContainer() {
  const { toast } = useToast();
  const {
    feed: { items, isLoading, hasMore },
    loadMoreFeed,
    deletePost,
  } = usePosts();

  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [postToEdit, setPostToEdit] = useState<Post | null>(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [postToReport, setPostToReport] = useState<Post | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const {
    deletingPostId,
    updatingPostId,
    setDeletingPostId,
    setUpdatingPostId,
    handleLike,
    handleSave,
    handleComment,
    handleShare,
    updatePostInList,
  } = usePostActions();

  const { updatePost: updatePostApi, isLoading: isUpdating } = useUpdatePost({
    onSuccess: (updatedPost) => {
      // Cập nhật post trong state
      setPosts(updatePostInList(posts, updatedPost.id, updatedPost));
      setUpdatingPostId(null);
      setEditModalOpen(false);

      toast({
        title: "Thành công",
        description: "Bài viết đã được cập nhật",
        variant: "default",
      });
    },
    onError: (error) => {
      setUpdatingPostId(null);
      toast({
        title: "Lỗi",
        description: "Cập nhật bài viết thất bại",
        variant: "destructive",
      });
    },
  });

  // Sync posts state
  useEffect(() => {
    setPosts(items);
  }, [items]);

  // Handle loading more posts
  const handleLoadMore = useCallback(async () => {
    if (!hasMore || isLoading || isLoadingMore) return;

    setIsLoadingMore(true);

    try {
      loadingTimeoutRef.current = setTimeout(() => {
        setIsLoadingMore(false);
      }, 600);

      await loadMoreFeed();
    } catch (err) {
      toast({
        title: "Load Error",
        description: "Could not load more posts",
        variant: "destructive",
      });
    } finally {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
      setIsLoadingMore(false);
    }
  }, [hasMore, isLoading, loadMoreFeed, isLoadingMore, toast]);

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

  const handleUpdatePost = useCallback(
    async (updateData: {
      content: string;
      mediaToDelete?: string[];
      newImages?: File[];
      newVideos?: File[];
      mediaToUpdate?: { mediaId: string; file: File }[];
      isPinned?: boolean;
    }) => {
      if (!postToEdit) return;

      setUpdatingPostId(postToEdit.id);

      try {
        await updatePostApi({
          postId: postToEdit.id,
          content: updateData.content,
          images: updateData.newImages,
          videos: updateData.newVideos,
          mediaToDelete: updateData.mediaToDelete,
          mediaToUpdate: updateData.mediaToUpdate,
          isPinned: updateData.isPinned,
        });
      } catch {
        // error đã được hook xử lý
      }
    },
    [updatePostApi, postToEdit]
  );

  const handleEditPost = useCallback((post: Post) => {
    setPostToEdit(post);
    setEditModalOpen(true);
  }, []);

  // Handle opening delete confirmation dialog
  const handleOpenDeleteDialog = useCallback((post: Post) => {
    setPostToDelete(post);
    setDeleteDialogOpen(true);
  }, []);

  const handleOpenReportModal = useCallback((post: Post) => {
    setPostToReport(post);
    setReportModalOpen(true);
  }, []);

  // Handle soft deleting a post
  const handleDelete = useCallback(async () => {
    if (!postToDelete) return;

    setDeletingPostId(postToDelete.id);
    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      await deletePost.mutateAsync(postToDelete.id);
      setPosts((prev) => prev.filter((post) => post.id !== postToDelete.id));
      toast({
        title: "Post Moved to Trash",
        description: "Your post has been moved to trash",
      });
    } catch (err) {
      setDeletingPostId(null);
      toast({
        title: "Delete Failed",
        description: "Could not delete the post",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setPostToDelete(null);
      setDeletingPostId(null);
    }
  }, [postToDelete, deletePost, toast]);

  // Refresh function
  const handleRefresh = useCallback(() => {
    window.location.reload();
  }, []);

  return (
    <div className="max-w-xl mx-auto w-full pb-8 space-y-6">
      {isLoading && posts.length === 0 ? (
        <div className="space-y-6">
          <LoadingSkeleton type="posts" count={3} />
        </div>
      ) : (
        <>
          {/* Post list với các props mới */}
          <AnimatePresence initial={false}>
            <PostList
              posts={posts}
              isLoading={false}
              onLikePost={(postId, liked) =>
                handleLike(postId, liked, posts, setPosts)
              }
              onSavePost={(postId, saved) =>
                handleSave(postId, saved, posts, setPosts)
              }
              onCommentPost={handleComment}
              onSharePost={handleShare}
              onDeletePost={handleOpenDeleteDialog}
              onEditPost={handleEditPost}
              onReportPost={handleOpenReportModal}
              deletingPostId={deletingPostId}
              updatingPostId={updatingPostId}
              isUpdating={isUpdating}
            />
          </AnimatePresence>

          {/* Loading indicator */}
          <AnimatePresence>
            {(isLoadingMore || isLoading) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="flex justify-center py-6"
              >
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{
                      repeat: Infinity,
                      duration: 1,
                      ease: "linear",
                    }}
                  >
                    <FiLoader className="h-4 w-4" />
                  </motion.span>
                  <span>Loading more posts...</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sentinel element */}
          <div ref={sentinelRef} className="h-px" />

          {/* No more posts message */}
          {!hasMore && posts.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-muted-foreground py-8 text-sm flex flex-col items-center gap-2"
            >
              <FiCheck className="h-5 w-5 text-green-500" />
              <span>You've seen all posts</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                className="mt-2"
              >
                <FiRefreshCw className="mr-2 h-4 w-4" />
                Refresh feed
              </Button>
            </motion.div>
          )}
        </>
      )}

      {/* Edit Modal */}
      {editModalOpen && postToEdit && (
        <PostEditContainer
          post={postToEdit}
          onClose={() => setEditModalOpen(false)}
          onUpdate={handleUpdatePost}
          isLoading={isUpdating}
        />
      )}

      <ReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        post={postToReport}
      />

      <ConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Chuyển vào thùng rác?"
        description={
          <>
            Bài viết sẽ được đưa vào thùng rác và có thể khôi phục lại trong
            vòng <span className="font-medium text-gray-800">30 ngày</span>.
          </>
        }
        confirmText="Xóa"
        cancelText="Hủy"
        confirmVariant="danger"
        icon={
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-500/90 to-red-600 flex items-center justify-center shadow-md">
            <svg
              className="w-7 h-7 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </div>
        }
      />
    </div>
  );
}
