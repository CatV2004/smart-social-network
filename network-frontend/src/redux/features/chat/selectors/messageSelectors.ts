import { RootState } from '@/redux/store';

// Base selectors
export const selectMessageState = (state: RootState) => state.message;
export const selectAllMessages = (state: RootState) => state.message.messages;
export const selectMessageLoading = (state: RootState) => state.message.loading;
export const selectMessageError = (state: RootState) => state.message.error;
export const selectMessagePagination = (state: RootState) => state.message.pagination;
