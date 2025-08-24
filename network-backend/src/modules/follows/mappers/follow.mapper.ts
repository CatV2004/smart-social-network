import { Follow } from '../entities/follow.entity';
import { FollowProfileResponseDto } from '../dto/follow-profile-response.dto';
import { ProfilePublicDto } from '@/modules/profiles/dto/profile-public.dto';
import { UserPublicDto } from '@/modules/users/dto/user-public.dto';
import { plainToInstance } from 'class-transformer';

export class FollowMapper {
    private static mapProfile(profile: any): ProfilePublicDto {
        return plainToInstance(ProfilePublicDto, {
            id: profile.id,
            avatar: profile.avatar,
            bio: profile.bio,
            followersCount: profile.followers ? profile.followers.length : profile.followersCount ?? 0,
            followingCount: profile.following ? profile.following.length : profile.followingCount ?? 0,
            user: plainToInstance(UserPublicDto, {
                id: profile.user?.id,
                email: profile.user?.email,
                firstName: profile.user?.firstName,
                lastName: profile.user?.lastName,
                username: profile.user?.username,
            }),
        });
    }

    static toFollowingDto(follow: Follow): FollowProfileResponseDto {
        return plainToInstance(FollowProfileResponseDto, {
            id: follow.id,
            profile: this.mapProfile(follow.following),
            followedAt: follow.createdAt,
        });
    }

    static toFollowerDto(follow: Follow): FollowProfileResponseDto {
        return plainToInstance(FollowProfileResponseDto, {
            id: follow.id,
            profile: this.mapProfile(follow.follower),
            followedAt: follow.createdAt,
        });
    }
}
