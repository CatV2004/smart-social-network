"use client";

import Image from "next/image";
import { Camera, Loader2, Lock } from "lucide-react";
import { Profile } from "@/types/profile";

interface ProfileCoverProps {
  coverImage: string | null;
  isPrivate: boolean;
  isCurrentUser: boolean;
  isUploading: "cover" | "avatar" | null;
  onCoverUpload: () => void;
}

export function ProfileCover({
  coverImage,
  isPrivate,
  isCurrentUser,
  isUploading,
  onCoverUpload,
}: ProfileCoverProps) {
  return (
    <div className="h-52 w-full relative overflow-hidden">
      {coverImage ? (
        <>
          <Image
            src={coverImage}
            alt="Cover image"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-black/5" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-300" />
      )}

      {isUploading === "cover" && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm">
          <Loader2 className="w-8 h-8 text-white animate-spin" />
        </div>
      )}

      {isCurrentUser && !isUploading && (
        <button
          onClick={onCoverUpload}
          className="cursor-pointer absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-800 p-2.5 rounded-full transition-all shadow-md hover:shadow-lg"
          disabled={isUploading !== null}
        >
          <Camera className="w-4 h-4" />
        </button>
      )}

      {isPrivate && (
        <div className="absolute top-4 left-4 bg-white/90 text-gray-700 px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-medium backdrop-blur-sm">
          <Lock className="w-3.5 h-3.5" />
          Riêng tư
        </div>
      )}
    </div>
  );
}
