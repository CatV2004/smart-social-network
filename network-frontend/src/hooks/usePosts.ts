import postApi from "@/lib/api/post.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { usePaginatedData } from "./usePaginatedData";
import { Post } from "@/types/post";
import postService from "@/services/post.service";

export function usePosts() {
    const queryClient = useQueryClient();

    // ----- GET feed posts -----
    const fetchFeed = useCallback((page: number, limit: number) => {
        return postApi.getPosts(page, limit);
    }, []);

    const {
        loadMore: loadMoreFeed,
        ...feed
    } = usePaginatedData<Post>(fetchFeed, true, [], 3);

    // ----- DELETE (soft) -----
    const deletePost = useMutation({
        mutationFn: (postId: string) => postService.deletePost(postId),
    });

    // ----- HARD DELETE -----
    const hardDeletePost = useMutation({
        mutationFn: (postId: string) => postService.hardDeletePost(postId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
        },
    });

    // ----- RESTORE -----
    const restorePost = useMutation({
        mutationFn: (postId: string) => postService.restorePost(postId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
        },
    });

    return {
        feed,
        loadMoreFeed,
        deletePost,
        hardDeletePost,
        restorePost,
    };
}
