import { createSocketProvider } from "./BaseSocketProvider";

export const {
  Provider: NotificationsSocketProvider,
  useSocket: useNotificationsSocket,
} = createSocketProvider("/notifications");
