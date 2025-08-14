"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { X } from "lucide-react";
import { StepSelectMedia } from "./StepSelectMedia";
import { StepPreviewMedia } from "./StepPreviewMedia";
import { StepAddCaption } from "./StepAddCaption";
import { PostCreateHeader } from "./PostCreateHeader";
import { useCreatePost } from "@/hooks/useCreatePost";

type ModalStep = "select" | "preview" | "post-info";

interface PostCreateModalProps {
  open: boolean;
  onClose: () => void;
}

export function PostCreateModal({ open, onClose }: PostCreateModalProps) {
  const { createPost, isLoading } = useCreatePost({
    onSuccess: () => {
      onClose();
      window.location.reload();
    },
  });
  const [step, setStep] = useState<ModalStep>("select");
  const [isExpanding, setIsExpanding] = useState(false);
  const [modalWidth, setModalWidth] = useState(600);
  const [files, setFiles] = useState<File[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [aspectRatios, setAspectRatios] = useState<(number | null)[]>([]);
  const [croppedFiles, setCroppedFiles] = useState<(File | null)[]>([]);
  const [isCropped, setIsCropped] = useState<boolean[]>([]);
  const [caption, setCaption] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);

  const handleContinue = () => {
    setIsExpanding(true);
    setTimeout(() => {
      setModalWidth(1000);
      setIsExpanding(false);
      setStep("post-info");
    }, 300);
  };

  const handleBackToPostInfo = () => {
    setIsExpanding(true);
    setTimeout(() => {
      setModalWidth(600);
      setIsExpanding(false);
      setStep("preview");
    }, 300);
  };

  const handleResetImage = useCallback(() => {
    setCroppedFiles((prev) => {
      const newCrops = [...prev];
      newCrops[currentIndex] = null;
      return newCrops;
    });
    setIsCropped((prev) => {
      const newIsCropped = [...prev];
      newIsCropped[currentIndex] = false;
      return newIsCropped;
    });
  }, [currentIndex]);

  const handleSharePost = async () => {
    if (files.length === 0) return;

    const formData = new FormData();
    formData.append("content", caption);

    files.forEach((file, index) => {
      const displayFile = croppedFiles[index] || file;
      if (file.type.startsWith("image/")) {
        formData.append("images", displayFile);
      } else if (file.type.startsWith("video/")) {
        formData.append("videos", displayFile);
      }
    });

    await createPost(formData);
  };

  const handleFileChange = (files: File[]) => {
    setFiles(files);
    setCroppedFiles(new Array(files.length).fill(null));
    setAspectRatios(new Array(files.length).fill(null));
    setCurrentIndex(0);
    setStep("preview");
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : files.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < files.length - 1 ? prev + 1 : 0));
  };

  const handleBackToSelect = () => {
    const confirmBack = window.confirm(
      "Bạn có chắc muốn quay lại? Các ảnh/video đã chọn sẽ bị mất."
    );
    if (confirmBack) {
      setStep("select");
      setFiles([]);
      setAspectRatios([]);
      setCroppedFiles([]);
    }
  };

  const handleCropComplete = useCallback(
    (croppedBlob: Blob) => {
      const file = files[currentIndex];
      const croppedFile = new File([croppedBlob], file.name, {
        type: file.type,
        lastModified: Date.now(),
      });

      setCroppedFiles((prev) => {
        const newCrops = [...prev];
        newCrops[currentIndex] = croppedFile;
        return newCrops;
      });

      setIsCropped((prev) => {
        const newIsCropped = [...prev];
        newIsCropped[currentIndex] = true;
        return newIsCropped;
      });
    },
    [currentIndex, files]
  );

  useEffect(() => {
    return () => {
      files.forEach((file) => URL.revokeObjectURL(URL.createObjectURL(file)));
      croppedFiles.forEach(
        (file) => file && URL.revokeObjectURL(URL.createObjectURL(file))
      );
    };
  }, [files, croppedFiles]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 z-50 transition-colors"
      >
        <X size={28} />
      </button>

      <div
        ref={modalRef}
        className={`bg-white rounded-xl shadow-xl h-[600px] flex flex-col ${
          isExpanding ? "overflow-hidden" : ""
        }`}
        style={{
          width: `${modalWidth}px`,
          transition: "width 300ms ease-in-out, transform 300ms ease-in-out",
        }}
      >
        <PostCreateHeader
          step={step}
          onBack={
            step === "post-info" ? handleBackToPostInfo : handleBackToSelect
          }
          onContinue={handleContinue}
          onShare={handleSharePost}
          isLoading={isLoading}
        />

        <div className="flex-1 flex flex-col items-center justify-center overflow-hidden">
          {step === "select" && (
            <StepSelectMedia onFileChange={handleFileChange} />
          )}

          {step === "preview" && files.length > 0 && (
            <StepPreviewMedia
              file={files[currentIndex]}
              croppedFile={croppedFiles[currentIndex]}
              aspectRatio={aspectRatios[currentIndex]}
              isCropped={isCropped[currentIndex] || false}
              onCropComplete={handleCropComplete}
              onReset={handleResetImage}
              onAspectRatioChange={(ratio) => {
                const newAspectRatios = [...aspectRatios];
                newAspectRatios[currentIndex] = ratio;
                setAspectRatios(newAspectRatios);
              }}
              hasMultipleFiles={files.length > 1}
              onPrev={handlePrev}
              onNext={handleNext}
            />
          )}

          {step === "post-info" && files.length > 0 && (
            <StepAddCaption
              file={files[currentIndex]}
              croppedFile={croppedFiles[currentIndex]}
              caption={caption}
              onCaptionChange={setCaption}
              hasMultipleFiles={files.length > 1}
              onPrev={handlePrev}
              onNext={handleNext}
            />
          )}
        </div>
      </div>
    </div>
  );
}
