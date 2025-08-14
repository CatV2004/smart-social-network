// hooks/useCreatePost.ts
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { createPostWithMedia } from "@/services/post.service";

interface UseCreatePostOptions {
    onSuccess?: () => void;
    onError?: (error: unknown) => void;
}

export const useCreatePost = (options?: UseCreatePostOptions) => {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const createPostHandler = async (formData: FormData) => {
        try {
            setIsLoading(true);

            const content = formData.get("content") as string;
            const images = formData.getAll("images") as File[];
            const videos = formData.getAll("videos") as File[];

            await createPostWithMedia({ content, images, videos });

            toast({
                title: "Thành công",
                description: "Bài viết đã được đăng thành công",
                variant: "default",
            });

            // Gọi callback khi thành công
            if (options?.onSuccess) {
                options.onSuccess();
            }
        } catch (error) {
            toast({
                title: "Lỗi",
                description: "Đã có lỗi xảy ra khi đăng bài",
                variant: "destructive",
            });

            if (options?.onError) {
                options.onError(error);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return { createPost: createPostHandler, isLoading };
};