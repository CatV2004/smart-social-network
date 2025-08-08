"use client";

import Image from "next/image";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Icons } from "@/lib/icons";
import { formatNumber } from "@/lib/format";
import { type Post } from "@/lib/mock-data";

export default function PostCard({ post }: { post: Post }) {
  const [isLiked, setLiked] = useState(true);
  const [isSaved, setSaved] = useState(true);

  return (
    <div className="bg-white border rounded-lg mb-6">
      {/* Header */}
      <div className="flex items-center p-3">
        <Image
          src={post.avatarUrl}
          alt={post.username}
          width={32}
          height={32}
          className="rounded-full"
        />
        <p className="font-semibold text-sm ml-3">{post.username}</p>
        <button className="ml-auto text-xl font-bold">...</button>
      </div>

      {/* Image */}
      <div className="relative w-full aspect-square">
        <Image
          src={post.imageUrl}
          alt="Post content"
          layout="fill"
          objectFit="cover"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 p-3">
        <button onClick={() => setLiked(!isLiked)}>
          <FontAwesomeIcon
            icon={isLiked ? Icons.heartRed : Icons.heartWhite}
            className={`text-2xl transition-colors duration-200 ${
              isLiked ? "text-red-500" : "text-black"
            }`}
          />
        </button>

        <button>
          <FontAwesomeIcon icon={Icons.comment} className="text-2xl" />
        </button>

        <button>
          <FontAwesomeIcon icon={Icons.share} className="text-2xl" />
        </button>

        <button className="ml-auto" onClick={() => setSaved(!isSaved)}>
          <FontAwesomeIcon
            icon={isSaved ? Icons.saveBlack : Icons.saveWite}
            className="text-2xl"
          />
        </button>
      </div>

      {/* Info */}
      <div className="px-3 pb-3">
        <p className="font-semibold text-sm">
          {formatNumber(post.likes)} lượt thích
        </p>
        <p className="text-sm mt-1">
          <span className="font-semibold">{post.username}</span> {post.caption}
        </p>
        <p className="text-sm text-gray-500 mt-1 cursor-pointer">
          Xem tất cả {formatNumber(post.commentsCount)} bình luận
        </p>
        <input
          type="text"
          placeholder="Thêm bình luận..."
          className="w-full text-sm outline-none bg-transparent mt-2"
        />
      </div>
    </div>
  );
}
