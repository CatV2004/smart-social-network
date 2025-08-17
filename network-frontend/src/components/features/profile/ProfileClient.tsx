// ProfileClient.tsx
"use client";
import { useState, useMemo } from "react";
import { useAppSelector } from "@/redux/hooks";
import { selectUserLoading } from "@/redux/features/user/userSelectors";
import { useProfileBase } from "@/hooks/useProfileBase";
import { useProfilePosts } from "@/hooks/useProfilePosts";
import ErrorMessage from "@/components/common/ErrorMessage";
import ProfileHeader from "@/components/features/profile/ProfileHeader";
import { ProfileStats } from "@/components/features/profile/ProfileStats";
import { PostGrid } from "./PostGrid";
import { EmptyPostState } from "./EmptyPostState";
import { MediaItem } from "@/types/post";
import { ImageMedia } from "@/types/media";
import { motion } from "framer-motion";
import { fadeIn } from "@/lib/motion";

interface ProfileClientProps {
  username: string;
  isMyProfile?: boolean;
}

export default function ProfileClient({
  username,
  isMyProfile = false,
}: ProfileClientProps) {
  const [activeTab, setActiveTab] = useState<"posts" | "saved" | "tagged">(
    "posts"
  );
  const loadingUser = useAppSelector(selectUserLoading);

  const {
    user,
    profile,
    error: profileError,
    loading: loadingProfile,
    isCurrentUser,
    reload: reloadProfile,
  } = useProfileBase(username, isMyProfile);
  console.log("user: ", user);
  console.log("profile: ", profile);

  const canViewPosts = useMemo(() => {
    return isCurrentUser || profile?.isPrivate === false;
  }, [isCurrentUser, profile?.isPrivate]);

  const {
    items: posts,
    hasMore,
    loadMore,
    isLoading, 
  } = useProfilePosts(profile?.id, !canViewPosts);

  const fallbackImageMedia: ImageMedia = useMemo(
    () => ({
      id: "fallback-id",
      url: "/fallback-image.png",
      type: "IMAGE",
      thumbnail: null,
      duration: null,
      width: 800,
      height: 600,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }),
    []
  );

  const safePosts = useMemo(
    () =>
      posts.map((post) => ({
        ...post,
        media:
          post.media?.length > 0
            ? post.media.map((m: MediaItem) => ({
                ...m,
                url: m.url ?? "/fallback-image.png",
              }))
            : [fallbackImageMedia],
      })),
    [posts, fallbackImageMedia]
  );

  if (profileError) {
    return <ErrorMessage message={profileError} onRetry={reloadProfile} />;
  }

  if (loadingProfile || loadingUser) {
    return (
      <div className="container mx-auto py-4 px-4 lg:px-0 animate-pulse">
        <div className="h-24 w-24 bg-gray-200 rounded-full mb-4" />
        <div className="h-6 w-1/3 bg-gray-200 rounded mb-2" />
        <div className="h-4 w-1/4 bg-gray-200 rounded mb-6" />
        <div className="grid grid-cols-3 gap-1 md:gap-6 mt-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-square bg-gray-200 rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="text-center py-20 text-gray-500">
        Không tìm thấy người dùng hoặc profile.
      </div>
    );
  }

  const renderContent = () => {
    if (!canViewPosts && !isCurrentUser) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-lg font-medium">
            Profile này đang ở chế độ riêng tư
          </p>
        </motion.div>
      );
    }

    switch (activeTab) {
      case "posts":
        return isLoading && safePosts.length === 0 ? (
          <SkeletonGrid />
        ) : safePosts.length > 0 ? (
          <motion.div variants={fadeIn}>
            <PostGrid
              posts={safePosts}
              isCurrentUser={isCurrentUser}
              hasMore={hasMore}
              onLoadMore={loadMore}
              isLoading={isLoading}
            />
          </motion.div>
        ) : (
          <EmptyPostState isCurrentUser={isCurrentUser} />
        );

      case "saved":
        return (
          <div className="text-center py-12 text-gray-500">Chưa hỗ trợ</div>
        );

      case "tagged":
        return (
          <div className="text-center py-12 text-gray-500">Chưa hỗ trợ</div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="container mx-auto py-4 px-4 lg:px-0"
    >
      <ProfileHeader
        user={user}
        profile={profile}
        isCurrentUser={isCurrentUser}
      />

      <motion.div variants={fadeIn}>
        <ProfileStats activeTab={activeTab} onTabChange={setActiveTab} />
      </motion.div>

      {renderContent()}
    </motion.div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-3 gap-1 md:gap-6 mt-6 animate-pulse">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="aspect-square bg-gray-200 rounded" />
      ))}
    </div>
  );
}
