import { useCallback } from "react";
import { usePaginatedData } from "./usePaginatedData";
import postApi from "@/lib/api/post.api";
import { Post } from "@/types/post";

export function useFeedPosts() {
    const fetchFn = useCallback((page: number, limit: number) => {
        return postApi.getPosts(page, limit);
    }, []);

    const { loadMore, ...rest } = usePaginatedData<Post>(
        fetchFn,
        true,
        [],
        3
    );

    const wrappedLoadMore = useCallback(async () => {
        return await loadMore();
    }, [loadMore]);

    return {
        loadMore: wrappedLoadMore,
        ...rest,
    };
}
