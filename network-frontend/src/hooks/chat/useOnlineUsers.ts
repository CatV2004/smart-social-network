"use client";

import { useSingleSocket } from "@/context/SingleSocketContext";
import { useEffect, useState } from "react";

export function useOnlineUsers() {
    const { onUserOnline, onUserOffline } = useSingleSocket();
    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

    useEffect(() => {
        const unsubOnline = onUserOnline(({ userId }) => {
            setOnlineUsers((prev) =>
                prev.includes(userId) ? prev : [...prev, userId]
            );
        });

        const unsubOffline = onUserOffline(({ userId }) => {
            setOnlineUsers((prev) => prev.filter((id) => id !== userId));
        });

        return () => {
            unsubOnline();
            unsubOffline();
        };
    }, [onUserOnline, onUserOffline]);

    return { onlineUsers };
}
