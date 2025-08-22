import { createSocketProvider } from "./BaseSocketProvider";

export const {
  Provider: MessagesSocketProvider,
  useSocket: useMessagesSocket,
} = createSocketProvider("/messages");
