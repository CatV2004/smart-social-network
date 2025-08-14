// // hooks/useSavedPosts.ts
// import { usePaginatedData } from "./usePaginatedData";
// import postApi from "@/lib/api/post.api";
// import { Post } from "@/types/post";

// export function useSavedPosts(isCurrentUser = false) {
//   return usePaginatedData<Post>(
//     (page, limit) => postApi.getSavedPosts(page, limit),
//     isCurrentUser,
//     [isCurrentUser]
//   );
// }
