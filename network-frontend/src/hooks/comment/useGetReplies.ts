// hooks/useGetReplies.ts
import { useInfiniteQuery } from "@tanstack/react-query";
import commentApi from "@/lib/api/comment.api";
import { Comment } from "@/types/comment";
import { ListResponse } from "@/types/pagination-meta";

export function useGetReplies(commentId: string, enabled = true) {
    return useInfiniteQuery<ListResponse<Comment>, Error, ListResponse<Comment>, [string, string], number>({
        queryKey: ["replies", commentId],
        queryFn: async ({ pageParam = 1 }) => {
            const res = await commentApi.getReplies(commentId, pageParam);
            return res.data;
        },
        getNextPageParam: (lastPage) => {
            const { page, totalPages } = lastPage.meta;
            return page < totalPages ? page + 1 : undefined;
        },
        initialPageParam: 1,
        enabled: !!commentId && enabled,
        staleTime: 1000 * 60 * 5,
    });
}
