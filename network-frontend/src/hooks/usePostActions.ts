import { useState, useCallback } from "react";
import { Post } from "@/types/post";
import postApi from "@/lib/api/post.api";
import { useToast } from "@/components/ui/use-toast";

export function usePostActions() {
    const { toast } = useToast();
    const [deletingPostId, setDeletingPostId] = useState<string | null>(null);
    const [updatingPostId, setUpdatingPostId] = useState<string | null>(null);

    const updatePostInList = useCallback(
        (posts: Post[], postId: string, updates: Partial<Post>) => {
            return posts.map((post) => (post.id === postId ? { ...post, ...updates } : post));
        },
        []
    );

    const handleLike = useCallback(
        async (postId: string, liked: boolean, posts: Post[], setPosts: (posts: Post[]) => void) => {
            const originalPost = posts.find((p) => p.id === postId);
            if (!originalPost) return;

            // Optimistic update
            setPosts(
                updatePostInList(posts, postId, {
                    isReacted: liked,
                    likesCount: originalPost.likesCount + (liked ? 1 : -1),
                })
            );

            try {
                await postApi.likePost(postId, liked);
            } catch {
                // Revert on error
                setPosts(
                    updatePostInList(posts, postId, {
                        isReacted: originalPost.isReacted,
                        likesCount: originalPost.likesCount,
                    })
                );
                toast({
                    title: "Like Failed",
                    description: "Could not update like status",
                    variant: "destructive",
                });
            }
        },
        [updatePostInList, toast]
    );

    const handleSave = useCallback(
        async (postId: string, saved: boolean, posts: Post[], setPosts: (posts: Post[]) => void) => {
            const originalPost = posts.find((p) => p.id === postId);
            if (!originalPost) return;

            // Optimistic update
            setPosts(updatePostInList(posts, postId, { isSaved: saved }));

            try {
                await postApi.savePost(postId, saved);
            } catch {
                // Revert on error
                setPosts(updatePostInList(posts, postId, { isSaved: originalPost.isSaved }));
                toast({
                    title: "Save Failed",
                    description: "Could not update save status",
                    variant: "destructive",
                });
            }
        },
        [updatePostInList, toast]
    );

    const handleComment = useCallback((postId: string) => {
        // Xử lý điều hướng đến trang chi tiết bài viết hoặc mở modal comment
        console.log("Navigate to post:", postId);
    }, []);

    const handleShare = useCallback((postId: string) => {
        // Xử lý chia sẻ bài viết
        console.log("Share post:", postId);
    }, []);

    return {
        deletingPostId,
        updatingPostId,
        setDeletingPostId,
        setUpdatingPostId,
        handleLike,
        handleSave,
        handleComment,
        handleShare,
        updatePostInList,
    };
}