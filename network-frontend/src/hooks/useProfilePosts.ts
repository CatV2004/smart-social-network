// hooks/useProfilePosts.ts
import { useCallback } from "react";
import { usePaginatedData } from "./usePaginatedData";
import postApi from "@/lib/api/post.api";
import { Post } from "@/types/post";

export function useProfilePosts(profileId?: string, isPrivate = false) {
  // memoize fetchFn -> chỉ thay đổi khi profileId thay đổi
  const fetchFn = useCallback((page: number, limit: number) => {
    if (!profileId) {
      return Promise.resolve({
        data: {
          data: [] as Post[],
          meta: {
            page: 1,
            limit,
            total: 0,
            totalPages: 1,
          },
        },
      });
    }
    return postApi.getPostsByProfile(profileId, page, limit);
  }, [profileId]);

  return usePaginatedData<Post>(
    fetchFn,
    Boolean(profileId && !isPrivate),
    [profileId, isPrivate],
    3 // initial limit (tuỳ chỉnh)
  );
}
