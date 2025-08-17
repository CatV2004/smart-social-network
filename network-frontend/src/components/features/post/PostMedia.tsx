// components/features/post/PostMedia.tsx
"use client";

import Image from "next/image";
import { useState } from "react";
import { Carousel } from "@/components/ui/carousel";
import clsx from "clsx";

interface MediaItem {
  id: string;
  type: "IMAGE" | "VIDEO" | "AUDIO";
  url: string;
  width: number | null;
  height: number | null;
}

interface PostMediaProps {
  media: MediaItem[];
  className?: string;
  width?: number | string; // optional fixed width
  height?: number | string; // optional fixed height
}

export function PostMedia({
  media,
  className,
  width = "100%",
  height = 600,
}: PostMediaProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (media.length === 0) return null;

  const renderMedia = (item: MediaItem) => {
    if (item.type === "IMAGE") {
      return (
        <div
          className={clsx("relative w-full h-full overflow-hidden", className)}
          style={{ width, height }}
        >
          <Image
            src={item.url}
            alt="Post image"
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
          />
        </div>
      );
    }

    if (item.type === "VIDEO") {
      return (
        <video
          src={item.url}
          controls
          className={clsx("w-full h-full object-contain", className)}
          style={{ width, height }}
        />
      );
    }

    if (item.type === "AUDIO") {
      return <audio src={item.url} controls className="w-full" />;
    }

    return null;
  };

  return (
    <div className="relative w-full bg-black">
      {media.length > 1 ? (
        <Carousel
          items={media}
          currentIndex={currentIndex}
          onChange={setCurrentIndex}
          renderItem={renderMedia}
          width={width}
          height={height}
        />
      ) : (
        renderMedia(media[0])
      )}
    </div>
  );
}
