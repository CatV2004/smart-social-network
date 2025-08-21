import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import postService from "@/services/post.service";
import { Post, UpdatePostPayload } from "@/types/post";

interface UseUpdatePostOptions {
    onSuccess?: (updatedPost: Post) => void;
    onError?: (error: unknown) => void;
}

interface UpdatePostInput {
    postId: string;
    content?: string;
    images?: File[];   // media mới dạng ảnh
    videos?: File[];   // media mới dạng video
    mediaToDelete?: string[]; // id media muốn xóa
    mediaToUpdate?: { mediaId: string; file: File }[]; // thay thế media cũ bằng file mới
    isPinned?: boolean;
}

export const useUpdatePost = (options?: UseUpdatePostOptions) => {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const updatePostHandler = async ({
        postId,
        content,
        images = [],
        videos = [],
        mediaToDelete = [],
        mediaToUpdate = [],
        isPinned,
    }: UpdatePostInput) => {
        try {
            setIsLoading(true);

            // Build payload FE -> BE
            const payload: UpdatePostPayload = {
                content,
                isPinned,
                mediaToDelete,
                mediaToUpdate: mediaToUpdate.map(m => ({ mediaId: m.mediaId })),
                files: [
                    ...images,
                    ...videos,
                    ...mediaToUpdate.map((m) => m.file),
                ],
            };

            console.log("Updating post with payload: ", payload);

            const updatedPost: Post = await postService.updatePostWithMedia(postId, payload);

            toast({
                title: "Thành công",
                description: "Bài viết đã được cập nhật",
                variant: "default",
            });

            options?.onSuccess?.(updatedPost);
            return updatedPost;
        } catch (error) {
            toast({
                title: "Lỗi",
                description: "Cập nhật bài viết thất bại",
                variant: "destructive",
            });

            options?.onError?.(error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return { updatePost: updatePostHandler, isLoading };
};
