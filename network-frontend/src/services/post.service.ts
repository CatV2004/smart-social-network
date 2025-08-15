import mediaApi from "@/lib/api/media.api";
import postApi from "@/lib/api/post.api";
import { MediaResponse } from "@/types/media";
import { CreatePostPayload } from "@/types/post";

interface CreatePostWithMediaPayload extends CreatePostPayload {
    images?: File[];
    videos?: File[];
}

export const createPostWithMedia = async ({
    content,
    images = [],
    videos = [],
}: CreatePostWithMediaPayload): Promise<{
    postId: string;
    media: MediaResponse[];
}> => {
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

    // 3. Upload và gộp kết quả
    const results = await Promise.allSettled(uploadPromises);

    const allMedia = results
        .filter((res): res is PromiseFulfilledResult<MediaResponse[]> => res.status === "fulfilled")
        .flatMap((res) => res.value);

    return { postId, media: allMedia };
};
