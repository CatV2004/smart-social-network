// components/features/post/PostMedia.tsx
"use client";

import Image from "next/image";
import { useState } from "react";
import { Carousel } from "@/components/ui/carousel";

interface PostMediaProps {
  media: Array<{
    id: string;
    type: "IMAGE" | "VIDEO" | "AUDIO";
    url: string;
    width: number | null;
    height: number | null;
  }>;
}

export function PostMedia({ media }: PostMediaProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (media.length === 0) return null;

  const renderMedia = (item: PostMediaProps["media"][0]) => {
    if (item.type === "IMAGE") {
      return (
        <div
          className="relative w-full"
          style={{
            aspectRatio:
              item.width && item.height
                ? `${item.width}/${item.height}`
                : undefined,
          }}
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
          className="w-full"
          style={{
            aspectRatio:
              item.width && item.height
                ? `${item.width}/${item.height}`
                : undefined,
          }}
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
        />
      ) : (
        renderMedia(media[0])
      )}
    </div>
  );
}
