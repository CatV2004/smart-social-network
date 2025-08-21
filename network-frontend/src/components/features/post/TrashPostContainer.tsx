"use client";

import { useEffect, useState, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { TrashPostList } from "./TrashPostList";
import { ConfirmationDialog } from "../../common/ConfirmationDialog";
import { Post } from "@/types/post";
import postApi from "@/lib/api/post.api";

interface TrashPostContainerProps {
  initialPosts?: Post[];
  onPostsChange?: (posts: Post[]) => void;
}

export function TrashPostContainer({
  initialPosts = [],
  onPostsChange,
}: TrashPostContainerProps) {
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [isLoading, setIsLoading] = useState(false);
  const [restoringPostId, setRestoringPostId] = useState<string | null>(null);
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);

  // Fetch danh sách bài viết đã xóa
  useEffect(() => {
    const fetchTrashPosts = async () => {
      setIsLoading(true);
      try {
        const res = await postApi.getTrashPosts();
        setPosts(res.data.data);
      } catch (err) {
        toast({
          title: "Tải thất bại",
          description: "Không thể tải danh sách bài viết đã xóa",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrashPosts();
  }, [toast]);

  // Sync posts with parent component if cần
  useEffect(() => {
    onPostsChange?.(posts);
  }, [posts, onPostsChange]);

  /**
   * Helper chung để xử lý gọi API + toast lỗi
   */
  const handleApiAction = useCallback(
    async (
      action: () => Promise<any>,
      onSuccess: () => void,
      messages: { success: string; error: string }
    ) => {
      try {
        await action();
        onSuccess();
        toast({
          title: "Thành công",
          description: messages.success,
        });
      } catch (err) {
        toast({
          title: "Lỗi",
          description: messages.error,
          variant: "destructive",
        });
      }
    },
    [toast]
  );

  // Handle restoring a post
  const handleRestorePost = useCallback(
    async (postId: string) => {
      setRestoringPostId(postId);

      await handleApiAction(
        () => postApi.restorePost(postId),
        () => setPosts((prev) => prev.filter((post) => post.id !== postId)),
        {
          success: "Bài viết đã được khôi phục",
          error: "Không thể khôi phục bài viết",
        }
      );

      setRestoringPostId(null);
    },
    [handleApiAction]
  );

  // Handle opening delete confirmation dialog
  const handleOpenDeleteDialog = useCallback((post: Post) => {
    setPostToDelete(post);
    setDeleteDialogOpen(true);
  }, []);

  // Handle permanent deletion
  const handlePermanentDelete = useCallback(async () => {
    if (!postToDelete) return;
    const postId = postToDelete.id;

    setDeletingPostId(postId);
    setDeleteDialogOpen(false);

    await handleApiAction(
      () => postApi.hardDeletePost(postId),
      () => setPosts((prev) => prev.filter((post) => post.id !== postId)),
      {
        success: "Bài viết đã được xóa vĩnh viễn",
        error: "Không thể xóa bài viết vĩnh viễn",
      }
    );

    setDeletingPostId(null);
    setPostToDelete(null);
  }, [postToDelete, handleApiAction]);

  return (
    <div className="max-w-xl mx-auto w-full pb-8">
      <TrashPostList
        posts={posts}
        isLoading={isLoading}
        onRestorePost={handleRestorePost}
        onPermanentDelete={handleOpenDeleteDialog}
        restoringPostId={restoringPostId}
        deletingPostId={deletingPostId}
      />

      <ConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handlePermanentDelete}
        title="Xóa vĩnh viễn?"
        description={
          <>
            Hành động này{" "}
            <span className="font-medium text-gray-800">
              không thể hoàn tác
            </span>
            . Bài viết sẽ bị xóa vĩnh viễn khỏi hệ thống.
          </>
        }
        confirmText="Xóa vĩnh viễn"
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
