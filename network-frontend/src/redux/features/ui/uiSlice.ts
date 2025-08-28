// redux/features/ui/uiSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type OverlayType = "none" | "notifications" | "search" | "chat";

interface UIState {
    activeOverlay: OverlayType;
    isSidebarCollapsed: boolean;
}

const initialState: UIState = {
    activeOverlay: "none",
    isSidebarCollapsed: false,
};

const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        setActiveOverlay: (state, action: PayloadAction<OverlayType>) => {
            state.activeOverlay = action.payload;
        },
        toggleSidebarCollapse: (state) => {
            state.isSidebarCollapsed = !state.isSidebarCollapsed;
        },
        setSidebarCollapse: (state, action: PayloadAction<boolean>) => {
            state.isSidebarCollapsed = action.payload;
        },
    },
});

export const { setActiveOverlay, toggleSidebarCollapse, setSidebarCollapse } = uiSlice.actions;
export default uiSlice.reducer;