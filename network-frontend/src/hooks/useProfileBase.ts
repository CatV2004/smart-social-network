// hooks/useProfileBase.ts
"use client";
import { useState, useEffect, useCallback } from 'react';
import { User } from '@/types/user';
import { Profile } from '@/types/profile';
import userApi from '@/lib/api/user.api';
import profileApi from '@/lib/api/profile.api';
import { useAppSelector } from '@/redux/hooks';
import { selectCurrentUser } from '@/redux/features/user/userSelectors';
import { selectMyProfile } from '@/redux/features/profile/profileSelectors';

export function useProfileBase(userId: string, isMyProfile = false) {
  const currentUser = useAppSelector(selectCurrentUser);
  const myProfile = useAppSelector(selectMyProfile);
  
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (isMyProfile) {
        setUser(currentUser);
        setProfile(myProfile);
      } else {
        const [userRes, profileRes] = await Promise.all([
          userApi.getUserById(userId),
          profileApi.getProfileByUserId(userId)
        ]);
        setUser(userRes.data);
        setProfile(profileRes.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, [userId, isMyProfile, currentUser, myProfile]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    user,
    profile,
    loading,
    error,
    reload: fetchData,
    isCurrentUser: isMyProfile || currentUser?.id === userId,
  };
}