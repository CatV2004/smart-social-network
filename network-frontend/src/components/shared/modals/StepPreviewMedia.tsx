import { Button } from "@/components/ui/button";
import MediaCropper from "@/components/features/post/MediaCropper";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface StepPreviewMediaProps {
  file: File;
  croppedFile: File | null;
  aspectRatio: number | null;
  isCropped: boolean;
  onCropComplete: (croppedBlob: Blob) => void;
  onReset: () => void;
  onAspectRatioChange: (ratio: number | null) => void;
  hasMultipleFiles: boolean;
  onPrev: () => void;
  onNext: () => void;
}

export function StepPreviewMedia({
  file,
  croppedFile,
  aspectRatio,
  isCropped,
  onCropComplete,
  onReset,
  onAspectRatioChange,
  hasMultipleFiles,
  onPrev,
  onNext,
}: StepPreviewMediaProps) {
  const displayFile = croppedFile || file;
  const url = URL.createObjectURL(displayFile);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="relative flex-1 w-full h-full overflow-hidden bg-black">
        <MediaCropper
          file={displayFile}
          aspectRatio={aspectRatio}
          onCropComplete={onCropComplete}
          onReset={onReset}
          isCropped={isCropped}
        />

        {hasMultipleFiles && (
          <>
            <button
              onClick={onPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-2 hover:bg-black/60 transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={onNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-2 hover:bg-black/60 transition-colors"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}
      </div>

      <div className="flex gap-2 p-4 justify-center border-t flex-wrap">
        <Button
          variant={aspectRatio === 1 ? "default" : "outline"}
          size="sm"
          onClick={() => onAspectRatioChange(1)}
        >
          1:1
        </Button>
        <Button
          variant={aspectRatio === 0.8 ? "default" : "outline"}
          size="sm"
          onClick={() => onAspectRatioChange(0.8)}
        >
          4:5
        </Button>
        <Button
          variant={aspectRatio === 16 / 9 ? "default" : "outline"}
          size="sm"
          onClick={() => onAspectRatioChange(16 / 9)}
        >
          16:9
        </Button>
        <Button
          variant={aspectRatio === 3 / 2 ? "default" : "outline"}
          size="sm"
          onClick={() => onAspectRatioChange(3 / 2)}
        >
          3:2
        </Button>
        <Button
          variant={aspectRatio === 4 / 3 ? "default" : "outline"}
          size="sm"
          onClick={() => onAspectRatioChange(4 / 3)}
        >
          4:3
        </Button>
        <Button
          variant={aspectRatio === null ? "default" : "outline"}
          size="sm"
          onClick={() => onAspectRatioChange(null)}
        >
          Gốc
        </Button>
      </div>
    </div>
  );
}
