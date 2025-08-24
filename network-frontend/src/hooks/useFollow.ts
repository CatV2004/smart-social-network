import { useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { followUser, unfollowUser } from '@/redux/features/profile/profileThunks';

interface UseFollowProps {
    userId: string;
}

export const useFollow = ({ userId }: UseFollowProps) => {
    const dispatch = useAppDispatch();
    const { toast } = useToast();

    const { otherProfile, loading } = useAppSelector((state) => state.profile);

    const isFollowed = otherProfile?.user.id === userId ? otherProfile.isFollowed : false;
    const followersCount = otherProfile?.user.id === userId ? otherProfile.followersCount : 0;
    const followStatus = otherProfile?.user.id === userId ? otherProfile.followStatus : undefined;
    const isLoading = loading;

    const handleFollow = useCallback(async () => {
        try {
            const resultAction = await dispatch(followUser(userId));

            if (followUser.fulfilled.match(resultAction)) {
                const response = resultAction.payload;

                toast({
                    title: response.status === 'ACCEPTED' ? "Đã theo dõi" : "Đã gửi yêu cầu",
                    description: response.status === 'ACCEPTED'
                        ? "Bạn đã bắt đầu theo dõi người dùng này"
                        : "Yêu cầu theo dõi đã được gửi và đang chờ chấp nhận",
                });
            } else if (followUser.rejected.match(resultAction)) {
                throw new Error(resultAction.payload as string);
            }
        } catch (error: any) {
            console.error('Follow error:', error);
            toast({
                title: "Lỗi",
                description: error.message || "Có lỗi xảy ra khi theo dõi",
                variant: "destructive",
            });
        }
    }, [dispatch, userId, toast]);

    const handleUnfollow = useCallback(async () => {
        try {
            const resultAction = await dispatch(unfollowUser(userId));

            if (unfollowUser.fulfilled.match(resultAction)) {
                toast({
                    title: "Đã hủy theo dõi",
                    description: "Bạn đã hủy theo dõi người dùng này",
                });
            } else if (unfollowUser.rejected.match(resultAction)) {
                throw new Error(resultAction.payload as string);
            }
        } catch (error: any) {
            console.error('Unfollow error:', error);
            toast({
                title: "Lỗi",
                description: error.message || "Có lỗi xảy ra khi hủy theo dõi",
                variant: "destructive",
            });
        }
    }, [dispatch, userId, toast]);

    return {
        isFollowed,
        followersCount,
        followStatus,
        isLoading,
        handleFollow,
        handleUnfollow,
    };
};
