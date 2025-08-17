// components/features/comment/CommentEmpty.tsx
"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Icons } from "@/lib/icons";

export function CommentEmpty() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <FontAwesomeIcon
        icon={Icons.comment}
        className="text-gray-300 text-4xl mb-4"
      />
      <h4 className="font-semibold text-gray-500">Chưa có bình luận nào</h4>
      <p className="text-gray-400 text-sm mt-1">
        Hãy là người đầu tiên bình luận về bài viết này
      </p>
    </div>
  );
}
