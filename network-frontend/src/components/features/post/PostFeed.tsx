// "use client";

// import { useEffect, useState, useCallback, useRef, ReactNode } from "react";
// import { PostList } from "@/components/features/post/PostList";
// import { Post } from "@/types/post";
// import LoadingSkeleton from "@/components/common/LoadingSkeleton";
// import { motion, AnimatePresence } from "framer-motion";
// import { FiLoader, FiCheck, FiRefreshCw } from "react-icons/fi";
// import { useToast } from "@/components/ui/use-toast";
// import { Button } from "@/components/ui/button";
// import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
// import { usePostActions } from "@/hooks/usePostActions";
// import { useInView } from "react-intersection-observer";

// interface PostFeedProps {
//   // Dữ liệu bài viết
//   posts: Post[];
//   isLoading: boolean;
//   hasMore: boolean;
//   loadMore: () => void;
//   reload: () => void;

//   // Header tùy chỉnh
//   header?: ReactNode;

//   // Empty state tùy chỉnh
//   emptyState?: ReactNode;

//   // Các props tùy chọn khác
//   showRefreshButton?: boolean;
//   onEditPost?: (post: Post) => void;
// }

// export function PostFeed({
//   posts,
//   isLoading,
//   hasMore,
//   loadMore,
//   reload,
//   header,
//   emptyState,
//   showRefreshButton = true,
//   onEditPost,
// }: PostFeedProps) {
//   const { toast } = useToast();
//   const [localPosts, setLocalPosts] = useState<Post[]>([]);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [postToDelete, setPostToDelete] = useState<Post | null>(null);

//   // Sync với posts từ props
//   useEffect(() => {
//     setLocalPosts(posts);
//   }, [posts]);

//   // Infinite scroll với Intersection Observer
//   const { ref: loadMoreRef, inView } = useInView({
//     threshold: 0,
//     rootMargin: "200px",
//   });

//   useEffect(() => {
//     if (inView && hasMore && !isLoading) {
//       loadMore();
//     }
//   }, [inView, hasMore, isLoading, loadMore]);

//   const {
//     deletingPostId,
//     updatingPostId,
//     setDeletingPostId,
//     setUpdatingPostId,
//     handleLike,
//     handleSave,
//     handleComment,
//     handleShare,
//   } = usePostActions();

//   // Xử lý xóa bài viết
//   const handleDelete = useCallback(async () => {
//     if (!postToDelete) return;
//     setDeletingPostId(postToDelete.id);

//     try {
//       // Gọi API xóa
//       // await postApi.deletePost(postToDelete.id);

//       // Cập nhật UI ngay lập tức
//       setLocalPosts((prev) =>
//         prev.filter((post) => post.id !== postToDelete.id)
//       );

//       toast({
//         title: "Đã xóa",
//         description: "Bài viết đã được chuyển vào thùng rác",
//       });
//     } catch (err) {
//       toast({
//         title: "Lỗi",
//         description: "Không thể xóa bài viết",
//         variant: "destructive",
//       });
//     } finally {
//       setDeleteDialogOpen(false);
//       setPostToDelete(null);
//       setDeletingPostId(null);
//     }
//   }, [postToDelete, toast, setDeletingPostId]);

//   const handleOpenDeleteDialog = useCallback((post: Post) => {
//     setPostToDelete(post);
//     setDeleteDialogOpen(true);
//   }, []);

//   // Xử lý like với local state
//   const handleLikePost = useCallback(
//     (postId: string, liked: boolean) => {
//       handleLike(postId, liked, localPosts, setLocalPosts);
//     },
//     [handleLike, localPosts]
//   );

//   // Xử lý save với local state
//   const handleSavePost = useCallback(
//     (postId: string, saved: boolean) => {
//       handleSave(postId, saved, localPosts, setLocalPosts);
//     },
//     [handleSave, localPosts]
//   );

//   // Xử lý edit mặc định nếu không có custom handler
//   const handleEditPost = useCallback(
//     (post: Post) => {
//       if (onEditPost) {
//         onEditPost(post);
//       } else {
//         toast({
//           title: "Thông báo",
//           description: "Tính năng chỉnh sửa bài viết",
//         });
//       }
//     },
//     [onEditPost, toast]
//   );

//   // Refresh function
//   const handleRefresh = useCallback(() => {
//     reload();
//   }, [reload]);

//   return (
//     <div className="max-w-xl mx-auto w-full pb-8 space-y-6">
//       {/* Header tùy chỉnh */}
//       {header}

//       {/* Post list */}
//       {isLoading && localPosts.length === 0 ? (
//         <div className="space-y-6">
//           <LoadingSkeleton type="posts" count={3} />
//         </div>
//       ) : localPosts.length > 0 ? (
//         <>
//           <AnimatePresence initial={false}>
//             <PostList
//               posts={localPosts}
//               isLoading={false}
//               onLikePost={handleLikePost}
//               onSavePost={handleSavePost}
//               onCommentPost={handleComment}
//               onSharePost={handleShare}
//               onDeletePost={handleOpenDeleteDialog}
//               onEditPost={handleEditPost}
//               deletingPostId={deletingPostId}
//               updatingPostId={updatingPostId}
//               isUpdating={false}
//             />
//           </AnimatePresence>

//           {/* Loading indicator */}
//           <AnimatePresence>
//             {isLoading && (
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -20 }}
//                 transition={{ duration: 0.3 }}
//                 className="flex justify-center py-6"
//               >
//                 <div className="flex items-center gap-2 text-muted-foreground text-sm">
//                   <motion.span
//                     animate={{ rotate: 360 }}
//                     transition={{
//                       repeat: Infinity,
//                       duration: 1,
//                       ease: "linear",
//                     }}
//                   >
//                     <FiLoader className="h-4 w-4" />
//                   </motion.span>
//                   <span>Loading more posts...</span>
//                 </div>
//               </motion.div>
//             )}
//           </AnimatePresence>

//           {/* Load more trigger */}
//           {hasMore && (
//             <div ref={loadMoreRef} className="flex justify-center py-4">
//               <LoadingSkeleton type="posts" count={1} />
//             </div>
//           )}

//           {/* No more posts message */}
//           {!hasMore && localPosts.length > 0 && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               className="text-center text-muted-foreground py-8 text-sm flex flex-col items-center gap-2"
//             >
//               <FiCheck className="h-5 w-5 text-green-500" />
//               <span>You've seen all posts</span>
//               {showRefreshButton && (
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={handleRefresh}
//                   className="mt-2"
//                 >
//                   <FiRefreshCw className="mr-2 h-4 w-4" />
//                   Refresh feed
//                 </Button>
//               )}
//             </motion.div>
//           )}
//         </>
//       ) : (
//         // Empty state tùy chỉnh hoặc mặc định
//         emptyState || (
//           <div className="text-center py-12 text-gray-500">
//             <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
//               <FiLoader className="w-6 h-6 text-gray-400" />
//             </div>
//             <p className="font-medium">Không có bài viết nào</p>
//             {showRefreshButton && (
//               <Button
//                 variant="outline"
//                 onClick={handleRefresh}
//                 className="mt-4"
//               >
//                 <FiRefreshCw className="mr-2 h-4 w-4" />
//                 Tải lại
//               </Button>
//             )}
//           </div>
//         )
//       )}

//       {/* Delete Confirmation Dialog */}
//       <ConfirmationDialog
//         open={deleteDialogOpen}
//         onOpenChange={setDeleteDialogOpen}
//         onConfirm={handleDelete}
//         title="Chuyển vào thùng rác?"
//         description={
//           <>
//             Bài viết sẽ được đưa vào thùng rác và có thể khôi phục lại trong
//             vòng <span className="font-medium text-gray-800">30 ngày</span>.
//           </>
//         }
//         confirmText="Xóa"
//         cancelText="Hủy"
//         confirmVariant="danger"
//         icon={
//           <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-500/90 to-red-600 flex items-center justify-center shadow-md">
//             <svg
//               className="w-7 h-7 text-white"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
//               />
//             </svg>
//           </div>
//         }
//       />
//     </div>
//   );
// }
