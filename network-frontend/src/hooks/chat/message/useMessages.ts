import { useCallback, useEffect, useRef, useState } from "react";
import { MessageRequest, MessageResponse } from "@/types/message";
import { QueryParams } from "@/types/pagination-meta";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
    fetchMessages,
    markMessageAsRead,
    sendMessage,
} from "@/redux/features/chat/thunks/messageThunks";
import {
    addMessage,
    clearMessages,
    resetMessagesPagination,
} from "@/redux/features/chat/slices/messageSlice";
import { inCreaseUnreadCount, updateConversationLastMessage } from "@/redux/features/chat/slices/conversationSlice";

export const useMessages = (conversationId: string) => {
    const dispatch = useAppDispatch();
    const { messages, loading, error, pagination } = useAppSelector(
        (state) => state.message
    );
    const prevMessageIdsRef = useRef<string[]>([]);
    const [newMessages, setNewMessages] = useState<MessageResponse[]>([]);

    useEffect(() => {
        const prevIds = prevMessageIdsRef.current;
        const currentIds = messages.map(m => m.id);

        const newMsgs = messages.filter(m => !prevIds.includes(m.id));
        if (newMsgs.length > 0) {
            setNewMessages(newMsgs);
        }

        prevMessageIdsRef.current = currentIds;
    }, [messages]);

    useEffect(() => {
        if (conversationId) {
            dispatch(clearMessages());
            dispatch(resetMessagesPagination());
            if (conversationId && conversationId !== '') {
                dispatch(fetchMessages({ conversationId, params: { page: 1 } }));
            }
        }
    }, [conversationId, dispatch]);

    // Lấy danh sách tin nhắn (thêm option params)
    const getMessages = useCallback(
        async (params?: QueryParams) => {
            try {
                return await dispatch(fetchMessages({ conversationId, params })).unwrap();
            } catch (err) {
                throw err;
            }
        },
        [dispatch, conversationId]
    );

    // Gửi tin nhắn mới
    const sendNewMessage = useCallback(
        async (messageData: MessageRequest) => {
            try {
                const message = await dispatch(sendMessage(messageData)).unwrap();
                dispatch(updateConversationLastMessage({
                    conversationId: conversationId,
                    lastMessage: message
                }));
                return message;
            } catch (err) {
                throw err;
            }
        },
        [dispatch, conversationId]
    );

    // Thêm tin nhắn từ socket
    const addNewMessage = useCallback(
        (message: MessageResponse, conversationId: string) => {
            dispatch(addMessage(message));
            // dispatch(updateConversationLastMessage({
            //     conversationId: conversationId,
            //     lastMessage: message
            // }));
            // dispatch(inCreaseUnreadCount({ conversationId }))
        },
        [dispatch]
    );

    const loadMore = useCallback(() => {
        if (pagination && pagination.page < pagination.totalPages && !loading) {
            return dispatch(
                fetchMessages({
                    conversationId,
                    params: { page: pagination.page + 1 },
                })
            );
        }
    }, [dispatch, pagination, conversationId, loading]);

    // const markMsgAsRead = useCallback(
    //     async (messageId: string) => {
    //         try {
    //             const result = await dispatch(
    //                 markMessageAsRead({ messageId })
    //             ).unwrap();
    //             dispatch(deCreaseUnreadCount({ conversationId }))
    //             return result;
    //         } catch (err) {
    //             throw err;
    //         }
    //     },
    //     [dispatch]
    // );

    const hasMoreMessages =
        pagination && pagination.page < pagination.totalPages;

    return {
        messages,
        newMessages,
        loading,
        error,
        pagination,
        hasMoreMessages,
        getMessages,
        sendNewMessage,
        addNewMessage,
        loadMore,
        // markMsgAsRead,
    };
};
