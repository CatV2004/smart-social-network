import { useCallback } from 'react';
import { useAppDispatch } from '@/redux/hooks';
import {
    markConversationAsRead,
    markConversationAsUnread,
} from '@/redux/features/chat/thunks/conversationThunks';

export const useConversationOperations = () => {
    const dispatch = useAppDispatch();

    const markAsRead = useCallback(
        async (conversationId: string) => {
            try {
                await dispatch(markConversationAsRead(conversationId)).unwrap();
            } catch (error) {
                console.error('Failed to mark conversation as read:', error);
                throw error;
            }
        },
        [dispatch]
    );

    const markAsUnread = useCallback(
        async (conversationId: string) => {
            try {
                await dispatch(markConversationAsUnread(conversationId)).unwrap();
            } catch (error) {
                console.error('Failed to mark conversation as unread:', error);
                throw error;
            }
        },
        [dispatch]
    );

    return {
        markAsRead,
        markAsUnread,
    };
};
