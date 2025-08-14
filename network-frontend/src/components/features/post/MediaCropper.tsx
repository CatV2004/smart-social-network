"use client";

import { Button } from "@/components/ui/button";
import { Check, RotateCcw, RotateCw, Undo } from "lucide-react";
import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";

interface MediaCropperProps {
  file: File;
  aspectRatio: number | null;
  onCropComplete?: (croppedBlob: Blob) => void;
  onReset?: () => void;
  isCropped: boolean;
}

export default function MediaCropper({
  file,
  aspectRatio,
  onCropComplete,
  onReset,
  isCropped,
}: MediaCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onCropCompleteHandler = useCallback(
    (_: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
      //   setZoom(1);
    },
    []
  );

  const handleGetCroppedImage = useCallback(async () => {
    if (!croppedAreaPixels || !onCropComplete) return;

    setIsLoading(true);
    try {
      const blob = await getCroppedImg(
        URL.createObjectURL(file),
        croppedAreaPixels,
        file.type
      );
      if (blob) {
        onCropComplete(blob);
        setZoom(1);
        setCrop({ x: 0, y: 0 });
      }
    } catch (e) {
      console.error("Crop failed", e);
    } finally {
      setIsLoading(false);
    }
  }, [croppedAreaPixels, file, onCropComplete]);

  return (
    <div className="relative w-full h-full bg-black">
      <Cropper
        image={URL.createObjectURL(file)}
        crop={crop}
        zoom={zoom}
        aspect={aspectRatio ?? undefined}
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onCropComplete={onCropCompleteHandler}
        cropShape="rect"
        showGrid={false}
        style={{
          containerStyle: {
            width: "100%",
            height: "100%",
            position: "relative",
          },
        }}
      />

      <div className="absolute bottom-4 right-4 flex gap-2">
        {isCropped && onReset && (
          <Button
            variant="secondary"
            size="icon"
            onClick={onReset}
            title="Quay về ảnh gốc"
          >
            <RotateCcw size={18} />
          </Button>
        )}

        <Button
          variant="default"
          size="icon"
          onClick={handleGetCroppedImage}
          disabled={isLoading}
          title="Xác nhận crop"
        >
          {isLoading ? (
            <RotateCw size={18} className="animate-spin" />
          ) : (
            <Check size={18} />
          )}
        </Button>
      </div>
    </div>
  );
}

/**
 * Hàm cắt ảnh chuẩn từ react-easy-crop docs
 */
async function getCroppedImg(
  imageSrc: string,
  crop: Area,
  fileType: string
): Promise<Blob | null> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) return null;

  // Đảm bảo dùng kích thước gốc của ảnh
  const naturalWidth = image.naturalWidth;
  const naturalHeight = image.naturalHeight;

  canvas.width = crop.width;
  canvas.height = crop.height;

  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    crop.width,
    crop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Canvas is empty"));
        return;
      }
      resolve(blob);
    }, fileType);
  });
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });
}
