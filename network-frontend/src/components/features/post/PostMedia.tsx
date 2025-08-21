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

  const numericWidth = typeof width === "number" ? width : 800;
  const fallbackHeight = typeof height === "number" ? height : 600;

  const calculatedHeights: number[] = media.map((m) =>
    m.width && m.height ? (m.height / m.width) * numericWidth : fallbackHeight
  );

  const minHeight = Math.min(...calculatedHeights);

  const renderMedia = (item: MediaItem) => {
    if (item.type === "IMAGE") {
      return (
        <div
          className={clsx(
            "relative flex justify-center items-center",
            className
          )}
          style={{ width: "100%" }}
        >
          <Image
            src={item.url}
            alt="Post image"
            width={item.width || 800}
            height={item.height || 600}
            className="w-full h-full object-cover rounded-lg shadow-[0_6px_12px_rgba(0,0,0,0.08),0_2px_4px_rgba(0,0,0,0.06)]"
          />
        </div>
      );
    }

    if (item.type === "VIDEO") {
      return (
        <div className="flex justify-center items-center w-full">
          <video
            src={item.url}
            controls
            className="max-h-[600px] max-w-full object-contain rounded-lg shadow-[0_6px_12px_rgba(0,0,0,0.08),0_2px_4px_rgba(0,0,0,0.06)]"
          />
        </div>
      );
    }

    if (item.type === "AUDIO") {
      return <audio src={item.url} controls className="w-full" />;
    }

    return null;
  };

  return (
    <div className="relative w-full">
      {media.length > 1 ? (
        <Carousel
          items={media}
          currentIndex={currentIndex}
          onChange={setCurrentIndex}
          renderItem={renderMedia}
          width={width}
          height={minHeight}
        />
      ) : (
        renderMedia(media[0])
      )}
    </div>
  );
}
