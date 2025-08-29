import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getMessageReads } from "@/redux/features/chat/thunks/messageThunks";

export const useMessageReads = (messageId: string) => {
    const dispatch = useAppDispatch();
    const reads = useAppSelector(
        (state) => state.message.messageReads[messageId]
    );

    const safeReads = useMemo(() => reads ?? [], [reads]);

    useEffect(() => {
        if (messageId && !safeReads.length) {
            dispatch(getMessageReads(messageId));
        }
    }, [dispatch, messageId, safeReads.length]);

    return reads;
};
