"use client";

import { Post } from "@/types/post";
import { PostCard } from "./PostCard";
import LoadingSkeleton from "@/components/common/LoadingSkeleton";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FiTrash2, FiRotateCcw, FiAlertTriangle } from "react-icons/fi";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import vi from "dayjs/locale/vi";
import { Badge } from "@/components/ui/badge";

dayjs.extend(relativeTime);
dayjs.locale(vi);

interface TrashPostListProps {
  posts: Post[];
  isLoading?: boolean;
  onRestorePost: (postId: string) => void;
  onPermanentDelete: (post: Post) => void;
  restoringPostId?: string | null;
  deletingPostId?: string | null;
}

export function TrashPostList({
  posts,
  isLoading = false,
  onRestorePost,
  onPermanentDelete,
  restoringPostId,
  deletingPostId,
}: TrashPostListProps) {
  const { toast } = useToast();

  if (isLoading) return <LoadingSkeleton type="posts" count={3} />;

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <FiTrash2 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Thùng rác trống
        </h3>
        <p className="text-gray-500">Không có bài viết nào trong thùng rác.</p>
      </div>
    );
  }

  const handleRestore = (post: Post) => {
    onRestorePost(post.id);
  };

  const daysLeft = (deletedAt: string) => {
    const autoDeleteDate = dayjs(deletedAt).add(30, "day");
    const diff = autoDeleteDate.diff(dayjs(), "day");
    return diff > 0 ? diff : 0;
  };

  return (
    <div className="mx-auto max-w-screen-md space-y-6">
      {/* Banner cảnh báo */}
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <FiAlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <h2 className="text-lg font-semibold text-amber-800 mb-1">
                Bài viết đã xóa
              </h2>
              <p className="text-sm text-amber-700">
                Các bài viết trong thùng rác sẽ tự động bị xóa vĩnh viễn sau 30
                ngày. Bạn có thể khôi phục hoặc xóa vĩnh viễn ngay bây giờ.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danh sách post */}
      <AnimatePresence initial={false}>
        {posts.map((post) => {
          const left = daysLeft(post.deletedAt || post.createdAt);
          const isProcessing =
            post.id === deletingPostId || post.id === restoringPostId;

          return (
            <motion.div
              key={post.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isProcessing ? 0.7 : 1, y: 0 }}
              exit={{ opacity: 0, height: 0, transition: { duration: 0.3 } }}
              transition={{
                type: "spring",
                stiffness: 350,
                damping: 25,
                opacity: { duration: 0.2 },
              }}
              className="relative"
            >
              <Card className="overflow-hidden border-red-100 bg-red-50/50">
                {/* Header */}
                <div className="bg-red-100 px-4 py-2 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <FiTrash2 className="h-4 w-4 text-red-500" />
                    <span className="text-sm font-medium text-red-700">
                      Đã xóa {dayjs(post.deletedAt || post.createdAt).fromNow()}
                    </span>
                  </div>
                  <Badge
                    variant={
                      left > 7
                        ? "default"
                        : left > 0
                        ? "warning"
                        : "destructive"
                    }
                  >
                    {left > 0
                      ? `Tự động xóa sau ${left} ngày`
                      : "Sắp bị xóa vĩnh viễn"}
                  </Badge>
                </div>

                {/* Nội dung */}
                <CardContent className="p-0">
                  <PostCard
                    post={post}
                    onDelete={onPermanentDelete}
                    isDeleting={post.id === deletingPostId}
                    hideOptions
                  />
                </CardContent>

                {/* Footer */}
                <CardFooter className="bg-white p-3 flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRestore(post)}
                    disabled={isProcessing}
                    className="flex items-center gap-2"
                  >
                    {post.id === restoringPostId ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                        Đang khôi phục...
                      </>
                    ) : (
                      <>
                        <FiRotateCcw className="h-4 w-4" />
                        Khôi phục
                      </>
                    )}
                  </Button>

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onPermanentDelete(post)}
                    disabled={isProcessing}
                    className="flex items-center gap-2"
                  >
                    {post.id === deletingPostId ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                        Đang xóa...
                      </>
                    ) : (
                      <>
                        <FiTrash2 className="h-4 w-4" />
                        Xóa vĩnh viễn
                      </>
                    )}
                  </Button>
                </CardFooter>

                {/* Overlay */}
                {isProcessing && (
                  <div className="absolute inset-0 bg-background/70 flex items-center justify-center rounded-lg">
                    <div className="flex items-center gap-2 bg-background px-4 py-2 rounded-md shadow-sm">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                      <span className="text-sm font-medium">
                        {post.id === restoringPostId
                          ? "Đang khôi phục..."
                          : "Đang xóa..."}
                      </span>
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
