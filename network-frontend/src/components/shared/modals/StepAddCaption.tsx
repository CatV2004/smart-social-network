import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  UserPlus,
  Tag,
  Facebook,
  Instagram,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { selectCurrentUser } from "@/redux/features/user/userSelectors";
import { selectMyProfile } from "@/redux/features/profile/profileSelectors";
import { useAppSelector } from "@/redux/hooks";

interface StepAddCaptionProps {
  file: File;
  croppedFile: File | null;
  caption: string;
  onCaptionChange: (caption: string) => void;
  hasMultipleFiles: boolean;
  onPrev: () => void;
  onNext: () => void;
}

export function StepAddCaption({
  file,
  croppedFile,
  caption,
  onCaptionChange,
  hasMultipleFiles,
  onPrev,
  onNext,
}: StepAddCaptionProps) {
  const displayFile = croppedFile || file;
  const url = URL.createObjectURL(displayFile);
  const user = useAppSelector(selectCurrentUser);
  const profile = useAppSelector(selectMyProfile);

  return (
    <div className="flex h-full">
      <div className="w-[600px] border-r bg-black flex items-center justify-center">
        <div className="relative w-full h-full">
          {file.type.startsWith("image/") ? (
            <img
              src={url}
              alt="Selected"
              className="w-full h-full object-contain"
            />
          ) : (
            <video
              src={url}
              controls
              className="w-full h-full object-contain"
            />
          )}

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
      </div>

      <div className="flex-1 flex flex-col min-w-[400px]">
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

        <div className="flex-1 p-4 flex flex-col">
          <Textarea
            placeholder="Viết chú thích..."
            className="flex-1 w-full p-2 border-none outline-none resize-none text-sm min-h-[120px]"
            value={caption}
            onChange={(e) => onCaptionChange(e.target.value)}
          />

          <div className="flex items-center justify-between text-muted-foreground text-xs mt-2">
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
              <Label htmlFor="facebook" className="text-sm">
                Facebook
              </Label>
            </div>
            <Switch defaultChecked color="blue" />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Instagram className="w-4 h-4 text-pink-600" />
              <Label htmlFor="threads" className="text-sm">
                Threads
              </Label>
            </div>
            <Switch defaultChecked color="pink" />
          </div>
        </div>
      </div>
    </div>
  );
}
