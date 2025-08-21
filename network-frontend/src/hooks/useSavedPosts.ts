// hooks/useSavedPosts.ts
import { useCallback } from "react";
import { usePaginatedData } from "./usePaginatedData";
import postApi from "@/lib/api/post.api";
import { Post } from "@/types/post";

export function useSavedPosts(
    enabled = true,
    sortBy: string = "createdAt",
    sortOrder: "ASC" | "DESC" = "DESC"
) {
    const fetchFn = useCallback(
        (page: number, limit: number) => {
            return postApi.getSavedPosts(page, limit, sortBy, sortOrder);
        },
        [sortBy, sortOrder]
    );

    return usePaginatedData<Post>(fetchFn, enabled, [enabled, sortBy, sortOrder], 5);
}
