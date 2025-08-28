import { RootState } from '../../store';
export const selectIsSidebarCollapsed = (state: RootState) => state.ui.isSidebarCollapsed;
export const selectActiveOverlay = (state: RootState) => state.ui.activeOverlay;