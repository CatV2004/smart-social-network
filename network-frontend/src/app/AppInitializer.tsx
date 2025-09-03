"use client";

import { useEffect, useCallback } from "react";
import { getCookie } from "cookies-next";
import { useAppDispatch } from "@/redux/hooks";
import { fetchMyProfile } from "@/redux/features/profile/profileThunks";
import { setAuthenticated } from "@/redux/features/auth/authSlice";
import { setInitialized } from "@/redux/features/profile/profileSlice";
import {
  fetchNotifications,
  fetchUnreadCount,
} from "@/redux/features/notifications/notificationThunks";

import { useSocketNotifications } from "@/hooks/useSocketNotifications";
import { useSocketMessages } from "@/hooks/useSocketMessages";
import { useSocketOnlineStatus } from "@/hooks/useSocketOnlineStatus";

export default function AppInitializer({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();

  useSocketNotifications();
  useSocketMessages();
  useSocketOnlineStatus();

  const initializeApp = useCallback(async () => {
    const token = getCookie("accessToken");

    if (token) {
      try {
        dispatch(setAuthenticated(true));
        await Promise.all([
          dispatch(fetchMyProfile()),
          dispatch(fetchNotifications({ page: 1, limit: 20 })),
          dispatch(fetchUnreadCount()),
        ]);
      } catch (error) {
        console.error("Initialization error:", error);
      } finally {
        dispatch(setInitialized());
      }
    } else {
      dispatch(setAuthenticated(false));
      dispatch(setInitialized());
    }
  }, [dispatch]);

  useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  return <>{children}</>;
}
