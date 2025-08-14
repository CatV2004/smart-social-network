"use client";
import { useEffect, useRef } from "react";
import { MediaItem } from "@/types/post";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  HeartIcon,
  MessageSquareIcon,
  PlayIcon,
  GridIcon,
} from "@/components/ui/Icons";
import { EmptyPostState } from "./EmptyPostState";

interface PostGridProps {
  posts: {
    id: string;
    media: MediaItem[];
    likesCount: number;
    commentsCount: number;
  }[];
  isCurrentUser?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoading?: boolean;
}

export const PostGrid = ({
  posts,
  isCurrentUser = false,
  onLoadMore,
  hasMore = false,
  isLoading = false,
}: PostGridProps) => {
  const loaderRef = useRef<HTMLDivElement | null>(null);

  // Infinite scroll observer với debounce nhẹ
  useEffect(() => {
    if (!onLoadMore || !hasMore || isLoading) return;

    let timer: NodeJS.Timeout;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading && hasMore) {
          clearTimeout(timer);
          timer = setTimeout(() => {
            onLoadMore();
          }, 200);
        }
      },
      { threshold: 0.1 }
    );

    const node = loaderRef.current;
    if (node) observer.observe(node);

    return () => {
      clearTimeout(timer);
      if (node) observer.unobserve(node);
      observer.disconnect();
    };
  }, [onLoadMore, hasMore, isLoading]);

  if (posts.length === 0 && !isLoading) {
    return <EmptyPostState isCurrentUser={isCurrentUser} />;
  }

  const SkeletonCard = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="aspect-square bg-gray-200 dark:bg-gray-800 animate-pulse rounded"
    />
  );

  return (
    <div className="w-full">
      <div className="grid grid-cols-3 gap-1 sm:gap-6">
        <AnimatePresence>
          {posts.map((post, idx) => {
            const firstMedia = post.media[0];
            const hasMultipleMedia = post.media.length > 1;
            const isVideo = firstMedia?.type === "VIDEO";

            return (
              <motion.div
                key={`${post.id}-${firstMedia?.url}`}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="relative group aspect-square overflow-hidden bg-gray-100 rounded"
              >
                <Link href={`/p/${post.id}`} className="block h-full w-full">
                  {!firstMedia ? (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <span className="text-gray-500">No media</span>
                    </div>
                  ) : isVideo ? (
                    <>
                      <video
                        src={firstMedia.url}
                        className="w-full h-full object-cover"
                        muted
                        playsInline
                        preload="metadata"
                      />
                      <div className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1">
                        <PlayIcon className="w-4 h-4 text-white" />
                      </div>
                    </>
                  ) : (
                    <Image
                      src={firstMedia.url}
                      alt="Post image"
                      fill
                      placeholder="blur"
                      blurDataURL="/blur-placeholder.png"
                      priority={idx < 3} // 3 ảnh đầu load ưu tiên
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  )}

                  {hasMultipleMedia && (
                    <div className="absolute top-2 right-2">
                      <GridIcon className="w-5 h-5 text-white drop-shadow-md" />
                    </div>
                  )}

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex gap-6 text-white font-semibold">
                      <div className="flex items-center gap-1">
                        <HeartIcon className="w-5 h-5" />
                        <span>{post.likesCount}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquareIcon className="w-5 h-5" />
                        <span>{post.commentsCount}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}

          {/* Skeleton khi load thêm */}
          {isLoading &&
            Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={`skeleton-${i}`} />
            ))}
        </AnimatePresence>
      </div>

      {/* Trigger infinite scroll */}
      {hasMore && <div ref={loaderRef} className="h-8 mt-6" />}
    </div>
  );
};
