import { RootState } from '@/redux/store';
import { createSelector } from '@reduxjs/toolkit';

export const selectConversationState = (state: RootState) => state.conversation;
export const selectAllConversations = (state: RootState) => state.conversation.conversations;
export const selectConversationLoading = (state: RootState) => state.conversation.loading;
export const selectConversationError = (state: RootState) => state.conversation.error;
export const selectConversationPagination = (state: RootState) =>
    state.conversation.pagination;

export const selectHasMoreConversations = (state: RootState) => {
    const { page, totalPages } = state.conversation.pagination;
    return page < totalPages;
};
