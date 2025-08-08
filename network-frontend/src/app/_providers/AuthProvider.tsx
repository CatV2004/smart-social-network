'use client';

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { selectIsAuthenticated, selectUser } from '@/redux/features/auth/authSelectors';
import { setUser } from '@/redux/features/auth/authSlice';
import { authService } from '@/services/auth.service';
import { getCookie } from 'cookies-next';

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);

  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = getCookie('accessToken');
      if (accessToken && !isAuthenticated) {
        try {
          // You might want to fetch user details here
          // const user = await fetchUserDetails();
          // dispatch(setUser(user));
        } catch (error) {
          console.error('Failed to verify auth', error);
        }
      }
    };

    checkAuth();
  }, [dispatch, isAuthenticated]);

  return <>{children}</>;
};

export default AuthProvider;