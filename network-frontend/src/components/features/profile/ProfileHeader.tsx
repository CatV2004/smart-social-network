import { User } from '@/types/user';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { SettingsIcon, BookmarkIcon } from '@/components/ui/Icons';
import { Profile } from '@/types/profile';

interface ProfileHeaderProps {
  user: User;
  profile: Profile;
  isCurrentUser?: boolean;
  postsCount: number;
}

const ProfileHeader = ({ user, profile, isCurrentUser = false, postsCount }: ProfileHeaderProps) => {
  return (
    <div className="px-4 py-6 md:px-8">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        {/* Avatar */}
        <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border">
          <Image
            src={profile.avatar || '/default-avatar.jpg'}
            alt={`${user.firstName} ${user.lastName}`}
            fill
            className="object-cover"
          />
        </div>

        {/* Profile Info */}
        <div className="flex-1 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <h1 className="text-xl font-semibold">{user.email}</h1>
            
            <div className="flex gap-2">
              {isCurrentUser ? (
                <>
                  <Button variant="outline" size="sm">
                    Chỉnh sửa trang cá nhân
                  </Button>
                  <Button variant="outline" size="sm">
                    <SettingsIcon className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="default" size="sm">
                    Theo dõi
                  </Button>
                  <Button variant="outline" size="sm">
                    Nhắn tin
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-4">
            <span><strong>{postsCount}</strong> bài viết</span>
            <span><strong>{profile.followersCount || 0}</strong> người theo dõi</span>
            <span><strong>{user.followingCount || 0}</strong> đang theo dõi</span>
          </div>

          {/* Bio */}
          <div>
            <p className="font-semibold">{user.firstName} {user.lastName}</p>
            {user.bio && <p className="text-sm">{user.bio}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;