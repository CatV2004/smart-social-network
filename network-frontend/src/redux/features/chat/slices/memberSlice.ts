import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchConversationMembers } from '../thunks/memberThunks';

interface MemberState {
    members: any[];
    loading: boolean;
    error: string | null;
}

const initialState: MemberState = {
    members: [],
    loading: false,
    error: null,
};

const memberSlice = createSlice({
    name: 'member',
    initialState,
    reducers: {
        clearMembers: (state) => {
            state.members = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchConversationMembers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchConversationMembers.fulfilled, (state, action) => {
                state.loading = false;
                state.members = action.payload.data;
            })
            .addCase(fetchConversationMembers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearMembers } = memberSlice.actions;
export default memberSlice.reducer;