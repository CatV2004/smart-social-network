"use client";

import { useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselProps<T> {
  items: T[];
  currentIndex: number;
  onChange: (index: number) => void;
  renderItem: (item: T, index: number) => React.ReactNode;
}

export function Carousel<T>({
  items,
  currentIndex,
  onChange,
  renderItem,
}: CarouselProps<T>) {
  const prev = useCallback(() => {
    onChange((currentIndex - 1 + items.length) % items.length);
  }, [currentIndex, items.length, onChange]);

  const next = useCallback(() => {
    onChange((currentIndex + 1) % items.length);
  }, [currentIndex, items.length, onChange]);

  return (
    <div className="relative w-full overflow-hidden">
      {/* Slides */}
      <div
        className="flex transition-transform duration-300"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
          width: `${items.length * 100}%`,
        }}
      >
        {items.map((item, idx) => (
          <div key={idx} className="w-full flex-shrink-0">
            {renderItem(item, idx)}
          </div>
        ))}
      </div>

      {/* Navigation buttons */}
      {items.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={next}
            className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      {/* Dots indicator */}
      {items.length > 1 && (
        <div className="absolute bottom-2 w-full flex justify-center gap-1">
          {items.map((_, idx) => (
            <button
              key={idx}
              onClick={() => onChange(idx)}
              className={`w-2 h-2 rounded-full ${
                idx === currentIndex ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
