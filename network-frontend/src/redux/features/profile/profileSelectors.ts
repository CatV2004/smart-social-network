import { RootState } from '../../store';

export const selectCurrentProfile = (state: RootState) => state.profile.currentProfile;
export const selectProfileLoading = (state: RootState) => state.profile.loading;
export const selectProfileError = (state: RootState) => state.profile.error;