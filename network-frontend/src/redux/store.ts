import { configureStore, ThunkAction, Action, createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import profileReducer from './features/profile/profileSlice';
import userReducer from './features/user/userSlice';
import uiReducer from "./features/ui/uiSlice";
import notificationReducer from './features/notifications/notificationSlice';
import followRequestsReducer from "./features/follow-request/followRequestSlice";
import messageReducer from "./features/chat/slices/messageSlice";
import memberReducer from "./features/chat/slices/memberSlice";
import conversationReducer from "./features/chat/slices/conversationSlice";
import onlineStatusReducer from "./features/onlineStatus/onlineStatusSlice";
import recommendationReducer from "./features/recomment/recommendationSlice";
import { enableMapSet } from 'immer';

import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import { clearAuth, setAuthTokens } from './features/auth/authSlice'; // Thêm loginSuccess
import { resetNotifications } from './features/notifications/notificationSlice';
import { fetchNotifications, fetchUnreadCount } from './features/notifications/notificationThunks'; // Import thunks
import { getUnreadCount } from './features/chat/thunks/messageThunks';

// Tạo listener middleware
export const listenerMiddleware = createListenerMiddleware();

// Lắng nghe action logout và reset notifications
listenerMiddleware.startListening({
    matcher: isAnyOf(clearAuth),
    effect: async (action, listenerApi) => {
        // Reset notifications khi logout
        listenerApi.dispatch(resetNotifications());
    },
});

// Lắng nghe action loginSuccess và fetch notifications
listenerMiddleware.startListening({
    matcher: isAnyOf(setAuthTokens),
    effect: async (action, listenerApi) => {
        // Fetch notifications khi đăng nhập thành công
        listenerApi.dispatch(fetchNotifications({ limit: 20 }));
        listenerApi.dispatch(fetchUnreadCount());
        listenerApi.dispatch(getUnreadCount());
    },
});

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['user', 'profile.myProfile', 'conversation'],
};

const rootReducer = combineReducers({
    auth: authReducer,
    profile: profileReducer,
    users: userReducer,
    ui: uiReducer,
    notifications: notificationReducer,
    followRequests: followRequestsReducer,
    message: messageReducer,
    member: memberReducer,
    conversation: conversationReducer,
    onlineStatus: onlineStatusReducer,
    recommendations: recommendationReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);
enableMapSet();

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }).prepend(listenerMiddleware.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;