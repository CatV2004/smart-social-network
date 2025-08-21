"use client";

import {
  useState,
  useCallback,
  useMemo,
  useDeferredValue,
  useEffect,
} from "react";
import { useSearchParams } from "next/navigation";
import { PostList } from "@/components/features/post/PostList";
import { Post } from "@/types/post";
import LoadingSkeleton from "@/components/common/LoadingSkeleton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faSearch } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { usePostActions } from "@/hooks/usePostActions";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { useToast } from "@/components/ui/use-toast";
import postApi from "@/lib/api/post.api";
import { usePostsByIds } from "@/hooks/usePostsByIds";
import { useInView } from "react-intersection-observer";

export default function SearchPostsPage() {
  const searchParams = useSearchParams();
  const idsParam = searchParams.get("ids") || "";
  const query = searchParams.get("q") || "";

  // Sử dụng useMemo để tránh tính toán lại mảng IDs không cần thiết
  const postIds = useMemo(
    () => idsParam.split(",").filter((id) => id.trim() !== ""),
    [idsParam]
  );

  const {
    items: postsFromHook,
    isLoading,
    hasMore,
    loadMore,
    reload,
    pagination,
  } = usePostsByIds(postIds);

  // Sử dụng local state để quản lý posts
  const [localPosts, setLocalPosts] = useState<Post[]>([]);

  // Đồng bộ dữ liệu từ hook với local state
  useEffect(() => {
    setLocalPosts(postsFromHook);
  }, [postsFromHook]);

  // Sử dụng useDeferredValue để ưu tiên render UI trước khi xử lý dữ liệu nặng
  const deferredPosts = useDeferredValue(localPosts);

  // Infinite scroll với Intersection Observer
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0,
    rootMargin: "200px",
  });

  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      loadMore();
    }
  }, [inView, hasMore, isLoading, loadMore]);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);
  const { toast } = useToast();

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

  // Sử dụng useCallback để tránh tạo hàm mới mỗi lần render
  const handleDelete = useCallback(async () => {
    if (!postToDelete) return;
    setDeletingPostId(postToDelete.id);

    try {
      await postApi.deletePost(postToDelete.id);
      // Cập nhật local state thay vì gọi reload
      setLocalPosts((prev) =>
        prev.filter((post) => post.id !== postToDelete.id)
      );

      toast({
        title: "Đã xóa",
        description: "Bài viết đã được chuyển vào thùng rác",
      });
    } catch (err) {
      toast({
        title: "Lỗi",
        description: "Không thể xóa bài viết",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setPostToDelete(null);
      setDeletingPostId(null);
    }
  }, [postToDelete, toast, setDeletingPostId]);

  const handleOpenDeleteDialog = useCallback((post: Post) => {
    setPostToDelete(post);
    setDeleteDialogOpen(true);
  }, []);

  const handleEditPost = useCallback(
    (post: Post) => {
      console.log("Edit post:", post.id);
      toast({
        title: "Thông báo",
        description: "Tính năng chỉnh sửa bài viết từ tìm kiếm",
      });
    },
    [toast]
  );

  // Tối ưu hóa callbacks cho PostList với local state
  const handleLikePost = useCallback(
    (postId: string, liked: boolean) => {
      handleLike(postId, liked, localPosts, setLocalPosts);
    },
    [handleLike, localPosts]
  );

  const handleSavePost = useCallback(
    (postId: string, saved: boolean) => {
      handleSave(postId, saved, localPosts, setLocalPosts);
    },
    [handleSave, localPosts]
  );

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Link
          href="/"
          className="p-2 mr-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
          aria-label="Quay lại trang tìm kiếm"
        >
          <FontAwesomeIcon
            icon={faArrowLeft}
            className="w-4 h-4 text-gray-600"
          />
        </Link>
        <h1 className="text-2xl font-bold">Kết quả tìm kiếm</h1>
      </div>

      {/* Search info */}
      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <div className="flex items-center">
          <FontAwesomeIcon icon={faSearch} className="text-blue-500 mr-2" />
          <p>
            Kết quả tìm kiếm cho:{" "}
            <span className="font-semibold">"{query}"</span>
          </p>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          Tìm thấy {deferredPosts.length} bài viết phù hợp
        </p>
      </div>

      {/* Post list */}
      {isLoading && deferredPosts.length === 0 ? (
        <LoadingSkeleton type="posts" count={5} />
      ) : deferredPosts.length > 0 ? (
        <>
          <PostList
            posts={deferredPosts}
            onLikePost={handleLikePost}
            onSavePost={handleSavePost}
            onCommentPost={handleComment}
            onSharePost={handleShare}
            onDeletePost={handleOpenDeleteDialog}
            onEditPost={handleEditPost}
            deletingPostId={deletingPostId}
            updatingPostId={updatingPostId}
            isUpdating={false}
          />

          {/* Load more trigger */}
          {hasMore && (
            <div ref={loadMoreRef} className="flex justify-center py-4">
              <LoadingSkeleton type="posts" count={1} />
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FontAwesomeIcon
              icon={faSearch}
              className="w-6 h-6 text-gray-400"
            />
          </div>
          <p className="font-medium">Không tìm thấy bài viết nào</p>
          <p className="text-sm mt-1">Thử tìm kiếm với từ khóa khác</p>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
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
