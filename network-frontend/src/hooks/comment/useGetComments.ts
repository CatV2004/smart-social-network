// hooks/useGetComments.ts
import { useInfiniteQuery } from "@tanstack/react-query";
import commentApi from "@/lib/api/comment.api";
import { Comment } from "@/types/comment";
import { ListResponse } from "@/types/pagination-meta";

export function useGetComments(postId: string, enabled = true) {
    return useInfiniteQuery({
        queryKey: ["comments", postId],
        queryFn: async ({ pageParam = 1 }) => {
            const res = await commentApi.getCommentsByPost(postId, pageParam);
            return res.data as ListResponse<Comment>;
        },
        getNextPageParam: (lastPage) => {
            const { page, totalPages } = lastPage.meta;
            return page < totalPages ? page + 1 : undefined;
        },
        initialPageParam: 1,
        enabled: !!postId && enabled,
        staleTime: 1000 * 60 * 5,
    });
}
