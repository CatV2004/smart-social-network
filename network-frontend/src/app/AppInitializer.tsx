"use client";

import { useEffect } from "react";
import { getCookie } from "cookies-next";
import { fetchCurrentUser } from "@/redux/features/user/userThunks";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchMyProfile } from "@/redux/features/profile/profileThunks";
import { setAuthenticated } from "@/redux/features/auth/authSlice";
import { setInitialized } from "@/redux/features/user/userSlice";


export default function AppInitializer({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const { initialized } = useAppSelector((state) => state.user);

  useEffect(() => {
    const token = getCookie("accessToken");

    if (token) {
      dispatch(setAuthenticated(true));
      Promise.all([
        dispatch(fetchCurrentUser()),
        dispatch(fetchMyProfile()),
      ]).finally(() => {
        dispatch(setInitialized());
      });
    } else {
      dispatch(setAuthenticated(false));
      dispatch(setInitialized());
    }
  }, [dispatch]);

  return <>{children}</>;
}
