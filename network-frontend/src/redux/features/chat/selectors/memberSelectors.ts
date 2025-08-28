import { RootState } from '@/redux/store';

// Base selectors
export const selectMemberState = (state: RootState) => state.member;
export const selectAllMembers = (state: RootState) => state.member.members;
export const selectMemberLoading = (state: RootState) => state.member.loading;
export const selectMemberError = (state: RootState) => state.member.error;
