"use client";

import { User } from "@/types/user";
import { Profile } from "@/types/profile";
import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { updateMyProfile } from "@/redux/features/profile/profileThunks";
import { useToast } from "@/components/ui/use-toast";
import { CalendarIcon, EyeOff } from "lucide-react";
import {
  ProfileCover,
  ProfileAvatar,
  ProfileInfo,
  ProfileStats,
  ProfileBio,
  ProfilePersonalInfo,
  ProfileSocialLinks,
  ProfileActions,
} from "./";
import { formatDate } from "./utils";
import ProfileEditModal from "./ProfileEditModal";

interface ProfileHeaderProps {
  user: User;
  profile: Profile;
  isCurrentUser?: boolean;
  onProfileUpdate?: (updatedProfile: Profile) => void;
  onFollowUpdate?: (data: {
    isFollowed: boolean;
    followersCount: number;
    status?: string;
  }) => void;
}

export function ProfileHeader({
  user,
  profile,
  isCurrentUser = false,
  onProfileUpdate,
  onFollowUpdate,
}: ProfileHeaderProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState<"avatar" | "cover" | null>(
    null
  );
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();

  const otherProfile = useSelector(
    (state: RootState) => state.profile.otherProfile
  );

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

      <ProfileCover
        coverImage={profile.coverImage}
        isPrivate={profile.isPrivate}
        isCurrentUser={isCurrentUser}
        isUploading={isUploading}
        onCoverUpload={triggerCoverInput}
      />

      <div className="px-6 pb-6 relative">
        <div className="flex flex-col md:flex-row gap-6 -mt-16">
          <ProfileAvatar
            avatar={profile.avatar}
            firstName={user.firstName}
            lastName={user.lastName}
            isCurrentUser={isCurrentUser}
            isUploading={isUploading}
            onAvatarUpload={triggerAvatarInput}
          />

          {/* Phần thông tin chính */}
          <div className="flex-1 space-y-5">
            {/* Name và Actions */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 w-full">
              <div className="flex-1">
                <ProfileInfo user={user} isPrivate={profile.isPrivate} />
              </div>

              <div className="flex-shrink-0">
                <ProfileActions
                  isCurrentUser={isCurrentUser}
                  isUploading={isUploading !== null}
                  userId={user.id}
                  onEdit={() => setIsEditModalOpen(true)}
                  onMessage={() => console.log("Message user")}
                />
              </div>
            </div>

            <ProfileStats
              postsCount={profile.postsCount}
              followersCount={
                otherProfile?.followersCount ?? profile.followersCount
              }
              followingCount={profile.followingCount}
            />

            <ProfileBio bio={profile.bio} />

            <ProfilePersonalInfo profile={profile} />

            <ProfileSocialLinks profile={profile} />

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
}
