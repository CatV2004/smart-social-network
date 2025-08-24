"use client";

import Image from "next/image";
import { Camera, Loader2 } from "lucide-react";

interface ProfileAvatarProps {
  avatar: string | null;
  firstName: string;
  lastName: string;
  isCurrentUser: boolean;
  isUploading: "cover" | "avatar" | null;
  onAvatarUpload: () => void;
}

export function ProfileAvatar({
  avatar,
  firstName,
  lastName,
  isCurrentUser,
  isUploading,
  onAvatarUpload,
}: ProfileAvatarProps) {
  return (
    <div className="relative w-32 h-32 md:w-36 md:h-36 rounded-2xl overflow-hidden border-4 border-white bg-white shadow-xl group">
      <Image
        src={avatar || "/default-avatar.jpg"}
        alt={`${firstName} ${lastName}`}
        fill
        className="object-cover"
        priority
      />

      {isUploading === "avatar" && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
          <Loader2 className="w-8 h-8 text-white animate-spin" />
        </div>
      )}

      {isCurrentUser && !isUploading && (
        <button
          onClick={onAvatarUpload}
          className="cursor-pointer absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-all duration-300"
          disabled={isUploading !== null}
        >
          <Camera className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}
