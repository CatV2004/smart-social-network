import { followService } from "@/services/follow.service";
import { FollowRequest } from "@/types/follow-request";
import { useEffect, useState } from "react";

const useFriendsList = (shouldFetch: boolean) => {
    const [friends, setFriends] = useState<FollowRequest[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchFriends = async () => {
            if (shouldFetch) {
                setLoading(true);
                try {
                    const response = await followService.getFollowing(1, 100);
                    setFriends(response.data);
                } catch (error) {
                    console.error("Failed to fetch friends:", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchFriends();
    }, [shouldFetch]);

    return { friends, loading };
};

export default useFriendsList;
