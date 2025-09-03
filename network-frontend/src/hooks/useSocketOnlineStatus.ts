import { useEffect } from 'react';
import { useSingleSocket } from '@/context/SingleSocketContext';
import { useAppDispatch } from '@/redux/hooks';
import { userWentOnline, userWentOffline } from '@/redux/features/onlineStatus/onlineStatusSlice';

export function useSocketOnlineStatus() {
    const { onUserOnline, onUserOffline } = useSingleSocket();
    const dispatch = useAppDispatch();

    useEffect(() => {
        const unsubscribeOnline = onUserOnline((data: { userId: string }) => {
            dispatch(userWentOnline(data.userId));
        });

        const unsubscribeOffline = onUserOffline((data: { userId: string }) => {
            dispatch(userWentOffline(data.userId));
        });

        return () => {
            unsubscribeOnline();
            unsubscribeOffline();
        };
    }, [dispatch, onUserOnline, onUserOffline]);
}