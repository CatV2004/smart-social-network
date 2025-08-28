// import { updateTotalUnreadCount, updateUnreadCount } from '@/redux/features/chat/slices/messageSlice';
// import { AppDispatch, RootState } from '@/redux/store';
// import { Middleware, UnknownAction } from '@reduxjs/toolkit';

// function recalcTotalUnread(state: RootState) {
//     return state.conversation.conversations.reduce(
//         (sum, conv) => sum + conv.unreadCount,
//         0
//     );
// }

// export const syncUnreadCountMiddleware: Middleware<{}, RootState, AppDispatch> =
//     (store) => (next) => (action: unknown) => {
//         const result = next(action);
//         const state = store.getState();

//         if (typeof action === "object" && action !== null && "type" in action) {
//             const { type } = action as UnknownAction;

//             if (
//                 type === updateUnreadCount.type ||
//                 type === "conversation/addConversation" ||
//                 type === "conversation/removeConversation"
//             ) {
//                 store.dispatch(updateTotalUnreadCount(recalcTotalUnread(state)));
//             }

//             if (type === "conversation/resetConversations") {
//                 store.dispatch(updateTotalUnreadCount(0));
//             }
//         }

//         return result;
//     };
