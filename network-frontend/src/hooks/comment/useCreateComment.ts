// hooks/useCreateComment.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import commentApi from "@/lib/api/comment.api";
import { Comment, CreateCommentPayload } from "@/types/comment";

// hooks/useCreateComment.ts
export function useCreateComment(postId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: CreateCommentPayload) => {
            const res = await commentApi.createComment(payload);
            return res.data;
        },
        onSuccess: (newComment: Comment) => {
            // Invalidate comments list
            queryClient.invalidateQueries({ queryKey: ["comments", postId] });

            // Nếu là reply
            if (newComment.parentId) {
                // Cập nhật tất cả các level replies
                const updateRepliesCache = (parentId: string) => {
                    queryClient.setQueryData(["replies", parentId], (old: any) => {
                        if (!old) return old;
                        return {
                            ...old,
                            pages: old.pages.map((page: any, i: number) => {
                                if (i === 0) {
                                    return {
                                        ...page,
                                        data: [newComment, ...page.data],
                                    };
                                }
                                return page;
                            }),
                        };
                    });
                };

                // Cập nhật cho parent trực tiếp
                updateRepliesCache(newComment.parentId);

                // Nếu reply của reply (C reply B), cần cập nhật cả cache của A
                if (newComment.replyTo?.id && newComment.replyTo.id !== newComment.parentId) {
                    updateRepliesCache(newComment.replyTo.id);
                }
            }
        },
    });
}