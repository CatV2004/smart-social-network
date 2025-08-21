// hooks/usePostsByIds.ts
import { useCallback } from "react";
import { usePaginatedData } from "./usePaginatedData";
import postApi from "@/lib/api/post.api";
import { Post } from "@/types/post";

export function usePostsByIds(postIds: string[]) {
    // memoize fetchFn -> chỉ thay đổi khi postIds thay đổi
    const fetchFn = useCallback(
        (page: number, limit: number) => {
            if (!postIds || postIds.length === 0) {
                return Promise.resolve({
                    data: {
                        data: [] as Post[],
                        meta: {
                            page: 1,
                            limit,
                            total: 0,
                            totalPages: 1,
                        },
                    },
                });
            }
            return postApi.getPostsByIds(postIds, page, limit);
        },
        [postIds]
    );

    // enable = chỉ fetch khi có ids
    return usePaginatedData<Post>(
        fetchFn,
        postIds.length > 0,
        [postIds],
        5 // initial limit tuỳ chỉnh
    );
}
