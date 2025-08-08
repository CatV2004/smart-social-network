import ProfileForm from '@/components/features/profile/ProfileForm';
import { selectCurrentProfile } from '@/redux/features/profile/profileSelectors';
import { fetchMyProfile } from '@/redux/features/profile/profileThunks';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useEffect } from 'react';

export default function ProfileEditPage() {
  const dispatch = useAppDispatch();
  const profile = useAppSelector(selectCurrentProfile);

  useEffect(() => {
    dispatch(fetchMyProfile());
  }, [dispatch]);

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="container mx-auto py-4">
      <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
      <ProfileForm initialValues={profile} />
    </div>
  );
}