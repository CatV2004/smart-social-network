interface ProfileStatsProps {
  postsCount: number;
  followersCount: number;
  followingCount: number;
}

export default function ProfileStats({ 
  postsCount, 
  followersCount, 
  followingCount 
}: ProfileStatsProps) {
  return (
    <div className="flex justify-around border-y py-4 mb-6">
      <div className="text-center">
        <p className="font-bold">{postsCount}</p>
        <p className="text-gray-500">bài viết</p>
      </div>
      
      <div className="text-center">
        <p className="font-bold">{followersCount}</p>
        <p className="text-gray-500">người theo dõi</p>
      </div>
      
      <div className="text-center">
        <p className="font-bold">{followingCount}</p>
        <p className="text-gray-500">đang theo dõi</p>
      </div>
    </div>
  );
}