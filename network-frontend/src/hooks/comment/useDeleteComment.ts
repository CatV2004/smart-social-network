import { useMutation, useQueryClient } from "@tanstack/react-query";
import commentApi from "@/lib/api/comment.api";

export function useDeleteComment(postId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: commentApi.deleteComment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["comments", postId] });
        },
    });
}