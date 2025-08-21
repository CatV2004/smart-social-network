"use client";

import { useState } from "react";
import {
  MapPin,
  UserPlus,
  Tag,
  Facebook,
  Instagram,
  X,
  ImageIcon,
  VideoIcon,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { selectCurrentUser } from "@/redux/features/user/userSelectors";
import { selectMyProfile } from "@/redux/features/profile/profileSelectors";
import { useAppSelector } from "@/redux/hooks";
import { Post } from "@/types/post";
import { MediaInput } from "@/types/media";

interface PostEditContainerProps {
  post: Post;
  onClose: () => void;
  onUpdate: (updateData: {
    content: string;
    mediaInputs: MediaInput[];
  }) => void;
  isLoading?: boolean;
}

// interface để quản lý file mới có id ổn định
interface NewFile {
  id: string;
  file: File;
}

export function PostEditContainer({
  post,
  onClose,
  onUpdate,
  isLoading = false,
}: PostEditContainerProps) {
  const [caption, setCaption] = useState(post.content || "");
  const [mediaToRemove, setMediaToRemove] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<NewFile[]>([]);

  const user = useAppSelector(selectCurrentUser);
  const profile = useAppSelector(selectMyProfile);

  // Gom media cũ (trừ cái bị remove) + file mới
  const allMedia = [
    ...post.media.filter((media) => !mediaToRemove.includes(media.id)),
    ...newFiles.map(({ id, file }) => ({
      id,
      url: URL.createObjectURL(file),
      type: file.type.startsWith("image/") ? "IMAGE" : "VIDEO",
      file,
    })),
  ];

  // Xoá media
  const handleRemoveMedia = (mediaId: string) => {
    if (mediaId.startsWith("new-")) {
      setNewFiles((prev) => prev.filter((f) => f.id !== mediaId));
    } else {
      setMediaToRemove((prev) => [...prev, mediaId]);
    }
  };

  // Thay thế media
  const handleReplaceMedia = (mediaId: string) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*,video/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        if (mediaId.startsWith("new-")) {
          // thay thế file mới
          setNewFiles((prev) =>
            prev.map((f) => (f.id === mediaId ? { ...f, file } : f))
          );
        } else {
          // xoá media cũ và thêm file mới
          setMediaToRemove((prev) => [...prev, mediaId]);
          setNewFiles((prev) => [
            ...prev,
            { id: `new-${Math.random().toString(36).slice(2, 9)}`, file },
          ]);
        }
      }
    };
    input.click();
  };

  // Thêm media mới
  const handleAddNewMedia = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*,video/*";
    input.multiple = true;
    input.onchange = (e) => {
      const files = Array.from((e.target as HTMLInputElement).files || []);
      const wrapped = files.map((file) => ({
        id: `new-${Math.random().toString(36).slice(2, 9)}`,
        file,
      }));
      setNewFiles((prev) => [...prev, ...wrapped]);
    };
    input.click();
  };

  // Submit update
  const handleSubmit = () => {
    const mediaInputs: MediaInput[] = [];

    // Media mới
    newFiles.forEach(({ file }) => {
      mediaInputs.push({
        id: undefined,
        type: file.type.startsWith("image/") ? "IMAGE" : "VIDEO",
        file,
      });
    });

    // Media cũ giữ lại
    post.media
      .filter((m) => !mediaToRemove.includes(m.id))
      .forEach((m) => {
        // chỉ push IMAGE/VIDEO thôi (bỏ AUDIO)
        if (m.type === "IMAGE" || m.type === "VIDEO") {
          mediaInputs.push({
            id: m.id,
            type: m.type,
          });
        }
      });

    onUpdate({
      content: caption,
      mediaInputs,
    });
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/50">
      <div className="flex items-center justify-center backdrop-blur-sm w-full h-full">
        <div className="bg-white rounded-xl shadow-xl w-[1000px] h-[600px] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-4">
              <button onClick={onClose} className="p-1">
                <X size={24} />
              </button>
              <h2 className="font-semibold text-lg">Chỉnh sửa bài viết</h2>
            </div>
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              {isLoading ? "Đang cập nhật..." : "Cập nhật"}
            </Button>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Left - Media */}
            <div className="w-[400px] border-r p-4 overflow-y-auto">
              <div className="grid grid-cols-2 gap-3 mb-4">
                {allMedia.map((media) => (
                  <div
                    key={media.id}
                    className="relative aspect-square rounded-md overflow-hidden border border-gray-200"
                  >
                    {media.type === "IMAGE" ? (
                      <img
                        src={media.url}
                        alt="Media"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <video
                          src={media.url}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        <VideoIcon className="w-8 h-8 text-white relative z-10" />
                      </div>
                    )}

                    <div className="absolute top-1 right-1 flex gap-1">
                      <button
                        onClick={() => handleRemoveMedia(media.id)}
                        className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X size={14} />
                      </button>
                      <button
                        onClick={() => handleReplaceMedia(media.id)}
                        className="bg-blue-500 text-white rounded-full p-1 hover:bg-blue-600"
                      >
                        <ImageIcon size={14} />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Add Media */}
                <div
                  className="aspect-square rounded-md border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-50"
                  onClick={handleAddNewMedia}
                >
                  <div className="text-center">
                    <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <span className="text-sm text-gray-500">
                      Thêm ảnh/video
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-500 text-center">
                {allMedia.length} ảnh/video
              </div>
            </div>

            {/* Right - Caption */}
            <div className="flex-1 flex flex-col">
              <div className="flex items-center gap-3 p-4 border-b">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={profile?.avatar || "/default-avatar.jpg"} />
                  <AvatarFallback>
                    {user?.email?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="font-semibold text-sm">
                  {`${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
                    "Người dùng"}
                </span>
              </div>

              <div className="flex-1 p-4">
                <Textarea
                  placeholder="Viết chú thích..."
                  className="w-full p-2 border-none outline-none resize-none text-sm min-h-[120px]"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                />
                <div className="flex justify-between text-muted-foreground text-xs mt-2">
                  <span>{caption.length}/2,200</span>
                  <button className="text-blue-500 hover:text-blue-600">
                    Thêm hashtag
                  </button>
                </div>
              </div>

              <div className="space-y-4 p-4 border-t">
                <button className="flex items-center gap-3 w-full text-sm">
                  <Tag className="w-4 h-4 text-muted-foreground" />
                  <span>Gắn thẻ mọi người</span>
                </button>
                <button className="flex items-center gap-3 w-full text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>Thêm vị trí</span>
                </button>
                <button className="flex items-center gap-3 w-full text-sm">
                  <UserPlus className="w-4 h-4 text-muted-foreground" />
                  <span>Thêm cộng tác viên</span>
                </button>
              </div>

              <div className="p-4 border-t space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Facebook className="w-4 h-4 text-blue-600" />
                    <Label className="text-sm">Facebook</Label>
                  </div>
                  <Switch defaultChecked color="blue" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Instagram className="w-4 h-4 text-pink-600" />
                    <Label className="text-sm">Threads</Label>
                  </div>
                  <Switch defaultChecked color="pink" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
