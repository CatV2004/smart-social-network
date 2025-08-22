import { RootState } from '../../store';

export const selectNotifications= (state: RootState) => state.notifications.notifications;
export const selectCountUnReadOnly= (state: RootState) => state.notifications.unreadCount;