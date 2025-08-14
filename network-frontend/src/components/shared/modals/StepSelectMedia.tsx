import Image from "next/image";
import { ChangeEvent, useRef } from "react";

interface StepSelectMediaProps {
  onFileChange: (files: File[]) => void;
}

export function StepSelectMedia({ onFileChange }: StepSelectMediaProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      onFileChange(selectedFiles);
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-gray-300 rounded-lg p-10 cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={() => fileInputRef.current?.click()}
    >
      <Image
        src="/icons/folder.png"
        alt="Chọn ảnh"
        width={80}
        height={80}
        className="mb-4 opacity-70"
      />
      <p className="text-gray-600 mb-2">Chọn ảnh hoặc video từ thiết bị</p>
      <p className="text-gray-400 text-sm">Kéo thả tập tin vào đây</p>
      <input
        type="file"
        accept="image/*,video/*"
        multiple
        hidden
        ref={fileInputRef}
        onChange={handleFileInputChange}
      />
    </div>
  );
}
