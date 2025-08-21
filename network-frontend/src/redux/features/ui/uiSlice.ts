import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type OverlayType = "none" | "notifications" | "search" | "chat";

interface UIState {
    activeOverlay: OverlayType;
}

const initialState: UIState = {
    activeOverlay: "none",
};

const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        setActiveOverlay: (state, action: PayloadAction<OverlayType>) => {
            state.activeOverlay = action.payload;
        },
    },
});

export const { setActiveOverlay } = uiSlice.actions;
export default uiSlice.reducer;
