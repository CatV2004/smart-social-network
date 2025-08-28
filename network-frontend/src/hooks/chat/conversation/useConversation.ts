import { useCallback, useEffect } from 'react';
import { QueryParams } from '@/types/pagination-meta';
import { conversationRequest, conversationResponse } from '@/types/conversation';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
    selectAllConversations,
    selectConversationError,
    selectConversationLoading,
    selectConversationPagination,
    selectHasMoreConversations,
} from '@/redux/features/chat/selectors';
import { createConversation, fetchConversationById, fetchConversations } from '@/redux/features/chat/thunks/conversationThunks';
import {
    resetConversations,
    addConversation,
} from '@/redux/features/chat/slices/conversationSlice';
import { useParams } from 'next/navigation';

export const useConversation = () => {
    const dispatch = useAppDispatch();
    const params = useParams();
    const conversationId = params.conversationId as string

    // Selectors
    const conversations = useAppSelector(selectAllConversations);
    const loading = useAppSelector(selectConversationLoading);
    const error = useAppSelector(selectConversationError);
    const pagination = useAppSelector(selectConversationPagination);
    const hasMore = useAppSelector(selectHasMoreConversations);

    // Actions
    const getConversations = useCallback((params?: QueryParams) => {
        const queryParams = {
            ...params,
            page: params?.page || 1,
            limit: params?.limit || pagination.limit,
            sortBy: params?.sortBy || 'lastMessage.createdAt',
            sortOrder: params?.sortOrder || 'DESC'
        };
        return dispatch(fetchConversations(queryParams));
    }, [dispatch, pagination.limit]);

    const createNewConversation = useCallback(async (conversationData: conversationRequest) => {
        try {
            const result = await dispatch(createConversation(conversationData)).unwrap();
            return result;
        } catch (error) {
            throw error;
        }
    }, [dispatch]);

    const addNewConversation = useCallback((conversation: conversationResponse) => {
        dispatch(addConversation(conversation));
    }, [dispatch]);

    const resetConversationList = useCallback(() => {
        dispatch(resetConversations());
    }, [dispatch]);

    const loadMoreConversations = useCallback(() => {
        if (hasMore && !loading) {
            getConversations({
                page: pagination.page + 1,
                limit: pagination.limit,
                sortBy: 'lastMessage.createdAt',
                sortOrder: 'DESC'
            });
        }
    }, [hasMore, loading, pagination, getConversations]);

    const refreshConversations = useCallback(() => {
        getConversations({
            page: 1,
            limit: pagination.limit,
            sortBy: 'lastMessage.createdAt',
            sortOrder: 'DESC'
        });
    }, [getConversations, pagination.limit]);

    const getConversationById = useCallback(async (id: string): Promise<conversationResponse> => {
        const existing = conversations.find(c => c.id === id);
        if (existing) return existing;

        try {
            const result = await dispatch(fetchConversationById(id)).unwrap();
            // Sau khi fetch, bạn có thể add vào redux nếu muốn merge vào danh sách
            dispatch(addConversation(result));
            return result;
        } catch (error) {
            console.error("Failed to fetch conversation:", error);
            throw error;
        }
    }, [dispatch, conversations]);

    return {
        // State
        conversations,
        loading,
        error,
        pagination,
        hasMore,

        // Actions
        getConversations,
        createNewConversation,
        addNewConversation,
        resetConversations: resetConversationList,
        loadMore: loadMoreConversations,
        refresh: refreshConversations,
        getConversationById
    };
};