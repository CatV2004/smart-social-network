import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OnlineStatusState {
    onlineUsers: Set<string>; // Set of user IDs who are online
}

const initialState: OnlineStatusState = {
    onlineUsers: new Set(),
};

export const onlineStatusSlice = createSlice({
    name: 'onlineStatus',
    initialState,
    reducers: {
        userWentOnline: (state, action: PayloadAction<string>) => {
            state.onlineUsers.add(action.payload);
        },
        userWentOffline: (state, action: PayloadAction<string>) => {
            state.onlineUsers.delete(action.payload);
        },
        setOnlineUsers: (state, action: PayloadAction<string[]>) => {
            state.onlineUsers = new Set(action.payload);
        },
        clearOnlineStatus: (state) => {
            state.onlineUsers.clear();
        },
    },
});

export const { userWentOnline, userWentOffline, setOnlineUsers, clearOnlineStatus } = onlineStatusSlice.actions;
export default onlineStatusSlice.reducer;