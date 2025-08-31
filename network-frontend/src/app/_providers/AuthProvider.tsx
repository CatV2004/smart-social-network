'use client';

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { selectIsAuthenticated } from '@/redux/features/auth/authSelectors';
import { getCookie } from 'cookies-next';

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = getCookie('accessToken');
      if (accessToken && !isAuthenticated) {
        try {
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