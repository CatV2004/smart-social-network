import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { acceptFollowRequest, fetchFollowRequests, rejectFollowRequest } from "@/redux/features/follow-request/followRequestThunks";

export const useFollowRequests = () => {
    const dispatch = useAppDispatch();
    const { data, meta, loading, error } = useAppSelector(
        (state) => state.followRequests
    );

    const loadRequests = useCallback(
        (page: number = 1, limit: number = 10) => {
            return dispatch(fetchFollowRequests({ page, limit })).unwrap();
        },
        [dispatch]
    );

    const loadMore = useCallback(() => {
        if (meta && meta.page < meta.totalPages) {
            dispatch(
                fetchFollowRequests({ page: meta.page + 1, limit: meta.limit })
            ).unwrap();
        }
        return Promise.resolve();
    }, [dispatch, meta]);

    const handleAccept = useCallback(
        (followId: string) => {
            return dispatch(acceptFollowRequest(followId)).unwrap();
        },
        [dispatch]
    );

    const handleReject = useCallback(
        (followId: string) => {
            return dispatch(rejectFollowRequest(followId)).unwrap();
        },
        [dispatch]
    );

    return {
        requests: data,
        meta,
        loading,
        error,
        loadRequests,
        loadMore,
        acceptRequest: handleAccept,
        rejectRequest: handleReject,
    };
};
