// import { User } from '@/types/user';
// import Image from 'next/image';
// import { Button } from '@/components/ui/button';
// import { SettingsIcon } from '@/components/ui/Icons';
// import { Profile } from '@/types/profile';
// import Link from 'next/link';

// interface ProfileHeaderProps {
//   user: User;
//   profile: Profile;
//   isCurrentUser?: boolean;
// }

// const ProfileHeader = ({ user, profile, isCurrentUser = false }: ProfileHeaderProps) => {
//   return (
//     <div className="px-4 py-6 md:px-8">
//       <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
//         {/* Avatar */}
//         <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border">
//           <Image
//             src={profile.avatar || '/default-avatar.jpg'}
//             alt={`${user.firstName} ${user.lastName}`}
//             fill
//             className="object-cover"
//             priority
//           />
//         </div>

//         {/* Profile Info */}
//         <div className="flex-1 space-y-4">
//           <div className="flex flex-col md:flex-row md:items-center gap-4">
//             <h1 className="text-xl font-semibold">{user.firstName} {user.lastName}</h1>
            
//             <div className="flex gap-2">
//               {isCurrentUser ? (
//                 <>
//                   <Link href="/accounts/edit">
//                     <Button variant="outline" size="sm">
//                       Chỉnh sửa trang cá nhân
//                     </Button>
//                   </Link>
//                   <Button variant="outline" size="sm">
//                     <SettingsIcon className="w-4 h-4" />
//                   </Button>
//                 </>
//               ) : (
//                 <>
//                   <Button variant="default" size="sm">
//                     Theo dõi
//                   </Button>
//                   <Button variant="outline" size="sm">
//                     Nhắn tin
//                   </Button>
//                 </>
//               )}
//             </div>
//           </div>

//           {/* Bio */}
//           <div>
//             <p className="font-semibold">{user.email}</p>
//             {profile.bio && <p className="text-sm">{profile.bio}</p>}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfileHeader;


import { User } from '@/types/user';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { SettingsIcon, LinkIcon, MapPinIcon, CalendarIcon, GenderIcon } from '@/components/ui/Icons';
import { Profile } from '@/types/profile';
import Link from 'next/link';

interface ProfileHeaderProps {
  user: User;
  profile: Profile;
  isCurrentUser?: boolean;
}

const ProfileHeader = ({ user, profile, isCurrentUser = false }: ProfileHeaderProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    });
  };

  // Hàm kiểm tra và format website
  const formatWebsite = (url: string | null) => {
    if (!url) return null;
    return url.replace(/(^\w+:|^)\/\//, '').split('/')[0];
  };

  return (
    <div className="relative">
      {/* Cover Image */}
      <div className="h-48 md:h-64 w-full bg-gradient-to-r from-blue-500 to-purple-600 relative overflow-hidden">
        {profile.coverImage ? (
          <Image
            src={profile.coverImage}
            alt={`${user.firstName}'s cover`}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500" />
        )}
      </div>

      <div className="px-4 md:px-8 pb-6 relative">
        <div className="flex flex-col md:flex-row gap-6 -mt-16">
          {/* Avatar */}
          <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-background bg-background shadow-lg">
            <Image
              src={profile.avatar || '/default-avatar.jpg'}
              alt={`${user.firstName} ${user.lastName}`}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="flex-1 space-y-4">
            {/* Name and Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="text-muted-foreground">
                  @{user.email.split('@')[0]}
                </p>
              </div>
              
              <div className="flex gap-2">
                {isCurrentUser ? (
                  <Link href="/accounts/edit">
                    <Button variant="outline" size="sm" className="gap-2">
                      <SettingsIcon className="w-4 h-4" />
                      Chỉnh sửa trang cá nhân
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Button variant="default" size="sm">
                      {profile.isFollowed ? 'Đang theo dõi' : 'Theo dõi'}
                    </Button>
                    <Button variant="outline" size="sm">
                      Nhắn tin
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-6 text-sm">
              <div className="flex flex-col items-center">
                <span className="font-bold">{profile.postsCount}</span>
                <span className="text-muted-foreground">Bài viết</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-bold">{profile.followersCount}</span>
                <span className="text-muted-foreground">Người theo dõi</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-bold">{profile.followingCount}</span>
                <span className="text-muted-foreground">Đang theo dõi</span>
              </div>
            </div>

            {/* Bio and Details */}
            <div className="space-y-2">
              {profile.bio && (
                <p className="text-sm whitespace-pre-line">{profile.bio}</p>
              )}
              
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                {profile.location && (
                  <div className="flex items-center gap-1">
                    <MapPinIcon className="w-4 h-4" />
                    <span>{profile.location}</span>
                  </div>
                )}
                
                {profile.website && (
                  <a 
                    href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-primary"
                  >
                    <LinkIcon className="w-4 h-4" />
                    <span>{formatWebsite(profile.website)}</span>
                  </a>
                )}
                
                <div className="flex items-center gap-1">
                  <CalendarIcon className="w-4 h-4" />
                  <span>Tham gia {formatDate(user.createdAt)}</span>
                </div>
                
                {profile.gender && (
                  <div className="flex items-center gap-1">
                    <GenderIcon className="w-4 h-4" />
                    <span>
                      {profile.gender === 'MALE' && 'Nam'}
                      {profile.gender === 'FEMALE' && 'Nữ'}
                      {profile.gender === 'OTHER' && 'Khác'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;