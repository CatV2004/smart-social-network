interface ProfileStatsProps {
  postsCount: number;
  followersCount: number;
  followingCount: number;
}

export function ProfileStats({
  postsCount,
  followersCount,
  followingCount,
}: ProfileStatsProps) {
  return (
    <div className="flex gap-6 p-4 bg-gray-50 rounded-xl">
      <div className="flex flex-col items-center">
        <span className="font-bold text-lg text-gray-900">{postsCount}</span>
        <span className="text-sm text-gray-600">Bài viết</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="font-bold text-lg text-gray-900">
          {followersCount}
        </span>
        <span className="text-sm text-gray-600">Người theo dõi</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="font-bold text-lg text-gray-900">
          {followingCount}
        </span>
        <span className="text-sm text-gray-600">Đang theo dõi</span>
      </div>
    </div>
  );
}
