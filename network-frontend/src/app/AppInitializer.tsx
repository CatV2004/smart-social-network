"use client";

import { useEffect, useCallback } from "react";
import { getCookie } from "cookies-next";
import { fetchCurrentUser } from "@/redux/features/user/userThunks";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchMyProfile } from "@/redux/features/profile/profileThunks";
import { setAuthenticated } from "@/redux/features/auth/authSlice";
import { setInitialized } from "@/redux/features/user/userSlice";
import {
  fetchNotifications,
  fetchUnreadCount,
} from "@/redux/features/notifications/notificationThunks";

import { useNotificationsSocket } from "@/context/NotificationsSocketContext";
import { selectNotifications } from "@/redux/features/notifications/notificationSelectors";
import { useSocketNotifications } from "@/hooks/useSocketNotifications";
// import { useMessagesSocket } from "@/context/MessagesSocketContext";

export default function AppInitializer({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const { initialized, currentUser } = useAppSelector((state) => state.user);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const notifications = useAppSelector(selectNotifications);

  useSocketNotifications();

  // lấy socket từ từng namespace
  const { socket: notificationsSocket, isConnected: notifConnected } =
    useNotificationsSocket();
  // const { socket: messagesSocket, isConnected: msgConnected } =
  //   useMessagesSocket();

  // khởi tạo app
  const initializeApp = useCallback(async () => {
    const token = getCookie("accessToken");

    if (token) {
      try {
        dispatch(setAuthenticated(true));
        await Promise.all([
          dispatch(fetchCurrentUser()),
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

  useEffect(() => {
    if (notificationsSocket) {
      // console.log("[Notifications] Socket ready:", notificationsSocket.id);
    }
    // if (messagesSocket) {
    //   console.log("[Messages] Socket ready:", messagesSocket.id);
    // }
  }, [notificationsSocket]);

  // useEffect(() => {
  //   console.log("App initialized:", initialized);
  //   console.log("Authenticated:", isAuthenticated);
  //   console.log("Notifications socket connected:", notifConnected);
  //   console.log("Current user:", currentUser);
  // }, [initialized, isAuthenticated, notifConnected, currentUser]);

  return <>{children}</>;
}
