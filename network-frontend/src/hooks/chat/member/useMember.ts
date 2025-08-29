import { useState, useEffect, useCallback } from "react";
import { MemberListResponse } from "@/types/member";
import { conversationApi } from "@/lib/api/conversation.api";

export function useMembers(conversationId?: string) {
    const [members, setMembers] = useState<MemberListResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchMembers = useCallback(async () => {
        if (!conversationId) return;

        setLoading(true);
        setError(null);
        try {
            const res = await conversationApi.getConversationMembers(conversationId);
            setMembers(res);
        } catch (err: any) {
            setError(err);
            setMembers(null);
        } finally {
            setLoading(false);
        }
    }, [conversationId]);

    useEffect(() => {
        fetchMembers();
    }, [fetchMembers]);

    return { members, loading, error, refetch: fetchMembers };
}
