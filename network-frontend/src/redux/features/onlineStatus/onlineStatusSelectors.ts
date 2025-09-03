import { RootState } from '@/redux/store';

export const selectOnlineUsers = (state: RootState) => state.onlineStatus.onlineUsers;
export const selectIsUserOnline = (userId: string) => (state: RootState) =>
    state.onlineStatus.onlineUsers.has(userId);