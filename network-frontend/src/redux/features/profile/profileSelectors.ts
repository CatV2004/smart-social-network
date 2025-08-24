import { RootState } from '../../store';

export const selectMyProfile = (state: RootState) => state.profile.myProfile;
export const selectOtherProfile = (state: RootState) => state.profile.otherProfile;
export const selectProfileLoading = (state: RootState) => state.profile.loading;
export const selectProfileError = (state: RootState) => state.profile.error;