import { notFound } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchMyProfile, fetchUserProfile } from '@/redux/features/profile/profileThunks';
import { selectCurrentProfile } from '@/redux/features/profile/profileSelectors';
import ProfileHeader from '@/components/features/profile/ProfileHeader';
import PostGrid from '@/components/features/post/PostGrid';
import { selectCurrentUser } from '@/redux/features/user/userSelectors';
import { useEffect } from 'react';

export default function ProfilePage({ params }: { params: { id: string } }) {
  const dispatch = useAppDispatch();
  const profile = useAppSelector(selectCurrentProfile);
  const currentUser = useAppSelector(selectCurrentUser);
  
  const isCurrentUser = currentUser?.id === params.id;

  useEffect(() => {
    if (isCurrentUser) {
      dispatch(fetchMyProfile());
    } else {
      dispatch(fetchUserProfile(params.username));
    }
  }, [dispatch, params.username, isCurrentUser]);

  if (!profile) return notFound();

  return (
    <div className="container mx-auto py-4">
      <ProfileHeader
        user={profile.user}
        isCurrentUser={isCurrentUser}
        postsCount={profile.posts?.length || 0}
      />
      
      <div className="border-t border-gray-200 my-4"></div>
      
      {profile.posts && profile.posts.length > 0 ? (
        <PostGrid 
          posts={profile.posts} 
          isCurrentUser={isCurrentUser}
        />
      ) : (
        <div className="text-center py-12">
          <p className="text-lg font-medium">
            {isCurrentUser ? 'Bạn chưa có bài viết nào' : 'Người dùng chưa có bài viết nào'}
          </p>
        </div>
      )}
    </div>
  );
}