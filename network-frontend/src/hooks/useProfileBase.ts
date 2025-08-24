"use client";
import { useState, useEffect, useCallback } from 'react';
import { Profile } from '@/types/profile';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { selectMyProfile, selectOtherProfile } from '@/redux/features/profile/profileSelectors';
import { fetchOtherProfile } from '@/redux/features/profile/profileThunks';

export function useProfileBase(username: string, isMyProfile = false) {
  const myProfile = useAppSelector(selectMyProfile);
  const otherProfile = useAppSelector(selectOtherProfile);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch()

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (isMyProfile) {
        setProfile(myProfile);
      } else if (otherProfile?.user?.username === username) {
        // Nếu đã có otherProfile trong Redux
        setProfile(otherProfile);
      } else {
        const resultAction = await dispatch(fetchOtherProfile(username));

        if (fetchOtherProfile.fulfilled.match(resultAction)) {
          setProfile(resultAction.payload);
        } else if (fetchOtherProfile.rejected.match(resultAction)) {
          throw new Error(resultAction.payload as string);
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, [username, isMyProfile, myProfile, otherProfile]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    profile,
    user: profile?.user || null,
    loading,
    error,
    reload: fetchData,
    isCurrentUser: isMyProfile || myProfile?.user?.username === username,
  };
}
