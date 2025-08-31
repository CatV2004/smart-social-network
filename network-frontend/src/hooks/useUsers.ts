import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

import { RootState } from "@/redux/store";
import { fetchUsers } from "@/redux/features/user/userThunks";
import { resetFilters, resetUsers, setFilters } from "@/redux/features/user/userSlice";
import { clearError } from "@/redux/features/profile/profileSlice";

export function useUsers() {
    const dispatch = useAppDispatch();

    const { users, loading, error, pagination, filters } = useAppSelector(
        (state: RootState) => state.users
    );

    // fetch theo filters hiện tại
    const loadUsers = useCallback(() => {
        dispatch(fetchUsers(filters));
    }, [dispatch, filters]);

    // load thêm (next page)
    const loadMore = useCallback(() => {
        if (pagination && filters.page < pagination.totalPages && !loading) {
            dispatch(fetchUsers({ ...filters, page: filters.page + 1 }));
        }
    }, [dispatch, filters, pagination, loading]);

    // thay đổi filter
    const updateFilters = useCallback(
        (newFilters: Partial<typeof filters>) => {
            dispatch(setFilters(newFilters));
            dispatch(fetchUsers({ ...filters, ...newFilters, page: 1 })); // reset về page 1 khi đổi filter
        },
        [dispatch, filters]
    );

    const resetAll = useCallback(() => {
        dispatch(resetUsers());
        dispatch(resetFilters());
    }, [dispatch]);

    return {
        users,
        loading,
        error,
        pagination,
        filters,
        loadUsers,
        loadMore,
        updateFilters,
        resetAll,
        clearError: () => dispatch(clearError()),
    };
}
