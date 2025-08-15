// hooks/useFeedPosts.ts
import { useCallback } from "react";
import { usePaginatedData } from "./usePaginatedData";
import postApi from "@/lib/api/post.api";
import { Post } from "@/types/post";

export function useFeedPosts() {
    const fetchFn = useCallback((page: number, limit: number) => {
        return postApi.getPosts(page, limit);
    }, []);

    return usePaginatedData<Post>(
        fetchFn,
        true, // enabled by default
        [], // no dependencies
        3 // initial limit
    );
}