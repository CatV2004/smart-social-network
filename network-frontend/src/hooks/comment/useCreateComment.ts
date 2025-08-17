// hooks/useCreateComment.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import commentApi from "@/lib/api/comment.api";

export function useCreateComment(postId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: commentApi.createComment,
        onSuccess: (newComment) => {
            // invalidate để reload comments
            queryClient.invalidateQueries({ queryKey: ["comments", postId] });
        },
    });
}
