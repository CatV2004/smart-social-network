import { User } from "@/types/user";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  SettingsIcon,
  LinkIcon,
  MapPinIcon,
  CalendarIcon,
  GenderIcon,
  PhoneIcon,
  FacebookIcon,
  LinkedinIcon,
  GithubIcon,
  LockIcon,
  MailIcon,
} from "@/components/ui/Icons";
import { Profile } from "@/types/profile";
import { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import ProfileEditModal from "./ProfileEditModal";
import { updateMyProfile } from "@/redux/features/profile/profileThunks";
import {
  Camera,
  Loader2,
  Cake,
  EyeOff,
  MessageCircle,
  UserPlus,
  UserCheck,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ProfileHeaderProps {
  user: User;
  profile: Profile;
  isCurrentUser?: boolean;
  onProfileUpdate?: (updatedProfile: Profile) => void;
}

const ProfileHeader = ({
  user,
  profile,
  isCurrentUser = false,
  onProfileUpdate,
}: ProfileHeaderProps) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState<"avatar" | "cover" | null>(
    null
  );
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatWebsite = (url: string | null) => {
    if (!url) return null;
    return url.replace(/(^\w+:|^)\/\//, "").split("/")[0];
  };

  const handleSaveProfile = async (data: any) => {
    try {
      const result = await dispatch(updateMyProfile(data)).unwrap();
      if (onProfileUpdate) {
        onProfileUpdate(result);
      }
      return result;
    } catch (error) {
      throw error;
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn file ảnh",
        variant: "destructive",
      });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Lỗi",
        description: "Kích thước ảnh không được vượt quá 5MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading("avatar");
    try {
      const result = await dispatch(updateMyProfile({ avatar: file })).unwrap();
      if (onProfileUpdate) onProfileUpdate(result);

      toast({
        title: "Thành công",
        description: "Ảnh đại diện đã được cập nhật",
      });
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể cập nhật ảnh đại diện",
        variant: "destructive",
      });
    } finally {
      setIsUploading(null);
      if (avatarInputRef.current) avatarInputRef.current.value = "";
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn file ảnh",
        variant: "destructive",
      });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Lỗi",
        description: "Kích thước ảnh bìa không được vượt quá 10MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading("cover");
    try {
      const result = await dispatch(
        updateMyProfile({ coverImage: file })
      ).unwrap();
      if (onProfileUpdate) onProfileUpdate(result);

      toast({
        title: "Thành công",
        description: "Ảnh bìa đã được cập nhật",
      });
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể cập nhật ảnh bìa",
        variant: "destructive",
      });
    } finally {
      setIsUploading(null);
      if (coverInputRef.current) coverInputRef.current.value = "";
    }
  };

  const triggerAvatarInput = () => {
    if (avatarInputRef.current) {
      avatarInputRef.current.click();
    }
  };

  const triggerCoverInput = () => {
    if (coverInputRef.current) {
      coverInputRef.current.click();
    }
  };

  const hasPersonalInfo =
    profile.location ||
    profile.phoneNumber ||
    profile.dateOfBirth ||
    profile.gender;

  const hasSocialInfo =
    profile.website || profile.facebook || profile.linkedin || profile.github;

  return (
    <div className="relative bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
      {/* Input ẩn cho avatar và cover */}
      <input
        type="file"
        ref={avatarInputRef}
        onChange={handleAvatarUpload}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={coverInputRef}
        onChange={handleCoverUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Cover Image với gradient overlay */}
      <div className="h-52 w-full relative overflow-hidden">
        {profile.coverImage ? (
          <>
            <Image
              src={profile.coverImage}
              alt={`${user.firstName}'s cover`}
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
            onClick={triggerCoverInput}
            className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-800 p-2.5 rounded-full transition-all shadow-md hover:shadow-lg"
            disabled={isUploading !== null}
          >
            <Camera className="w-4 h-4" />
          </button>
        )}

        {profile.isPrivate && (
          <div className="absolute top-4 left-4 bg-white/90 text-gray-700 px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-medium backdrop-blur-sm">
            <LockIcon className="w-3.5 h-3.5" />
            Riêng tư
          </div>
        )}
      </div>

      <div className="px-6 pb-6 relative">
        <div className="flex flex-col md:flex-row gap-6 -mt-16">
          {/* Avatar với hiệu ứng shadow đẹp */}
          <div className="relative w-32 h-32 md:w-36 md:h-36 rounded-2xl overflow-hidden border-4 border-white bg-white shadow-xl group">
            <Image
              src={profile.avatar || "/default-avatar.jpg"}
              alt={`${user.firstName} ${user.lastName}`}
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
                onClick={triggerAvatarInput}
                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-all duration-300"
                disabled={isUploading !== null}
              >
                <Camera className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Phần thông tin chính */}
          <div className="flex-1 space-y-5">
            {/* Name và Actions */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2.5 mb-1">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {user.firstName} {user.lastName}
                  </h1>
                  {profile.isPrivate && (
                    <LockIcon className="w-5 h-5 text-gray-500" />
                  )}
                </div>

                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <span className="text-sm">@{user.email.split("@")[0]}</span>
                  <span className="text-gray-300">•</span>
                  <div className="flex items-center gap-1 text-sm">
                    <MailIcon className="w-4 h-4" />
                    <span>{user.email}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {isCurrentUser ? (
                  <Button
                    variant="outline"
                    className="gap-2 rounded-lg border-gray-300 bg-white hover:bg-gray-50 shadow-sm"
                    onClick={() => setIsEditModalOpen(true)}
                    disabled={isUploading !== null}
                  >
                    <SettingsIcon className="w-4 h-4" />
                    Chỉnh sửa
                  </Button>
                ) : (
                  <>
                    <Button
                      variant={profile.isFollowed ? "outline" : "default"}
                      className="gap-2 rounded-lg shadow-sm"
                    >
                      {profile.isFollowed ? (
                        <>
                          <UserCheck className="w-4 h-4" />
                          Đang theo dõi
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4" />
                          Theo dõi
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      className="gap-2 rounded-lg border-gray-300 bg-white hover:bg-gray-50 shadow-sm"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Nhắn tin
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Stats với thiết kế card nhỏ */}
            <div className="flex gap-6 p-4 bg-gray-50 rounded-xl">
              <div className="flex flex-col items-center">
                <span className="font-bold text-lg text-gray-900">
                  {profile.postsCount}
                </span>
                <span className="text-sm text-gray-600">Bài viết</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-bold text-lg text-gray-900">
                  {profile.followersCount}
                </span>
                <span className="text-sm text-gray-600">Người theo dõi</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-bold text-lg text-gray-900">
                  {profile.followingCount}
                </span>
                <span className="text-sm text-gray-600">Đang theo dõi</span>
              </div>
            </div>

            {/* Bio */}
            {profile.bio && (
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-sm text-gray-800 whitespace-pre-line">
                  {profile.bio}
                </p>
              </div>
            )}

            {/* Thông tin cá nhân */}
            {hasPersonalInfo && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 bg-gray-50 rounded-xl">
                {profile.location && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <MapPinIcon className="w-4 h-4 text-blue-500" />
                    </div>
                    <span className="text-sm">{profile.location}</span>
                  </div>
                )}

                {profile.phoneNumber && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <PhoneIcon className="w-4 h-4 text-green-500" />
                    </div>
                    <span className="text-sm">{profile.phoneNumber}</span>
                  </div>
                )}

                {profile.dateOfBirth && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <Cake className="w-4 h-4 text-pink-500" />
                    </div>
                    <span className="text-sm">
                      Sinh nhật: {formatDate(profile.dateOfBirth)}
                    </span>
                  </div>
                )}

                {profile.gender && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <GenderIcon className="w-4 h-4 text-purple-500" />
                    </div>
                    <span className="text-sm">
                      {profile.gender === "MALE" && "Nam"}
                      {profile.gender === "FEMALE" && "Nữ"}
                      {profile.gender === "OTHER" && "Khác"}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Thông tin website và mạng xã hội */}
            {hasSocialInfo && (
              <div className="p-4 bg-gray-50 rounded-xl">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Liên kết
                </h3>
                <div className="flex flex-wrap gap-3">
                  {profile.website && (
                    <a
                      href={
                        profile.website.startsWith("http")
                          ? profile.website
                          : `https://${profile.website}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg text-gray-700 hover:text-blue-600 transition-all shadow-sm border border-gray-200 hover:border-blue-200 hover:shadow-md"
                    >
                      <LinkIcon className="w-4 h-4" />
                      <span className="text-sm">
                        {formatWebsite(profile.website)}
                      </span>
                    </a>
                  )}

                  {profile.facebook && (
                    <a
                      href={profile.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg text-gray-700 hover:text-blue-600 transition-all shadow-sm border border-gray-200 hover:border-blue-200 hover:shadow-md"
                    >
                      <FacebookIcon className="w-4 h-4" />
                      <span className="text-sm">Facebook</span>
                    </a>
                  )}

                  {profile.linkedin && (
                    <a
                      href={profile.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg text-gray-700 hover:text-blue-700 transition-all shadow-sm border border-gray-200 hover:border-blue-200 hover:shadow-md"
                    >
                      <LinkedinIcon className="w-4 h-4" />
                      <span className="text-sm">LinkedIn</span>
                    </a>
                  )}

                  {profile.github && (
                    <a
                      href={profile.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg text-gray-700 hover:text-gray-900 transition-all shadow-sm border border-gray-200 hover:border-gray-300 hover:shadow-md"
                    >
                      <GithubIcon className="w-4 h-4" />
                      <span className="text-sm">GitHub</span>
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Ngày tham gia */}
            <div className="flex items-center gap-3 text-sm text-gray-500 p-3 bg-gray-50 rounded-lg">
              <CalendarIcon className="w-4 h-4" />
              <span>Tham gia {formatDate(user.createdAt)}</span>
            </div>

            {/* Thông báo về quyền xem bài viết */}
            {!isCurrentUser && profile.canViewPosts === false && (
              <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl border border-amber-200">
                <EyeOff className="w-5 h-5 text-amber-600" />
                <span className="text-sm text-amber-700">
                  Bạn không thể xem bài viết của người dùng này
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <ProfileEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        profile={profile}
        onSave={handleSaveProfile}
      />
    </div>
  );
};

export default ProfileHeader;
