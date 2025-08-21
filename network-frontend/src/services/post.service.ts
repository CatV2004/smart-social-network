import postApi from "@/lib/api/post.api";
import mediaApi from "@/lib/api/media.api";
import { CreatePostPayload, Post, UpdatePostPayload } from "@/types/post";
import { MediaResponse } from "@/types/media";

interface CreatePostWithMediaPayload extends CreatePostPayload {
    images?: File[];
    videos?: File[];
}

interface MediaInput {
    id?: string;             // Media cũ
    type?: "IMAGE" | "VIDEO";
    file?: File;             // Media mới
}

class PostService {
    /** 
     * Tạo post mới kèm media (image/video)
     */
    async createPostWithMedia({
        content,
        images = [],
        videos = [],
    }: CreatePostWithMediaPayload): Promise<{ postId: string; media: MediaResponse[] }> {
        // 1. Tạo post
        const createPostRes = await postApi.createPost({ content });
        const postId = createPostRes.data.postId;

        // 2. Upload media song song
        const uploadPromises: Promise<MediaResponse[]>[] = [];

        if (images.length > 0) {
            uploadPromises.push(
                mediaApi.uploadMedia({ files: images, postId, type: "IMAGE" }).then((res) => res.data)
            );
        }
        if (videos.length > 0) {
            uploadPromises.push(
                mediaApi.uploadMedia({ files: videos, postId, type: "VIDEO" }).then((res) => res.data)
            );
        }

        const results = await Promise.allSettled(uploadPromises);

        const allMedia = results
            .filter((res): res is PromiseFulfilledResult<MediaResponse[]> => res.status === "fulfilled")
            .flatMap((res) => res.value);

        return { postId, media: allMedia };
    }

    /**
     * Update post
     */
    async updatePostWithMedia(
        postId: string,
        payload: UpdatePostPayload
    ): Promise<Post> {
        const res = await postApi.updatePost(postId, payload);
        return res.data;
    }


    /** Toggle like post */
    async likePost(postId: string, liked: boolean) {
        await postApi.likePost(postId, liked);
    }

    /** Toggle save post */
    async savePost(postId: string, saved: boolean) {
        await postApi.savePost(postId, saved);
    }

    /** Delete post (soft) */
    async deletePost(postId: string) {
        await postApi.deletePost(postId);
    }

    /** Hard delete post */
    async hardDeletePost(postId: string) {
        await postApi.hardDeletePost(postId);
    }

    /** Restore post from trash */
    async restorePost(postId: string) {
        await postApi.restorePost(postId);
    }

    /** Get Post for edit */
    async getPostForEdit(postId: string): Promise<Post> {
        const response = await postApi.getPostForEdit(postId);
        return response.data;
    }
}

export default new PostService();
