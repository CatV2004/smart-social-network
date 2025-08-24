import { BadRequestException, ConflictException, ForbiddenException, forwardRef, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Follow, FollowStatus } from './entities/follow.entity';
import { In, Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { FollowProfileResponseDto } from './dto/follow-profile-response.dto';
import { UsersService } from '../users/users.service';
import { ProfilesService } from '../profiles/profiles.service';
import { IPaginated } from '@/common/dtos/paginated.interface';
import { paginateWithMapper } from '@/common/utils/paginate-with-mapper';
import { NotificationType } from '../notifications/types/notification.type';
import { NotificationsService } from '../notifications/notifications.service';
import { FollowMapper } from './mappers/follow.mapper';

@Injectable()
export class FollowsService {
  private readonly logger = new Logger(FollowsService.name)
  constructor(
    @InjectRepository(Follow) private followRepo: Repository<Follow>,

    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,

    @Inject(forwardRef(() => ProfilesService))
    private readonly profilesService: ProfilesService,

    private readonly notificationService: NotificationsService

  ) { }

  async requestFollow(followerUserId: string, followingUserId: string): Promise<Follow> {
    const follower = await this.profilesService.findByUserId(followerUserId);
    const following = await this.profilesService.findByUserId(followingUserId);

    if (follower.id === following.id) {
      throw new BadRequestException('Cannot follow yourself');
    }

    const isPrivate = following.isPrivate;

    const existing = await this.followRepo.findOne({
      where: {
        follower: { id: follower.id },
        following: { id: following.id },
      },
    });

    if (existing) throw new ConflictException('Follow request already exists');

    const follow = this.followRepo.create({
      follower,
      following,
      status: isPrivate ? FollowStatus.PENDING : FollowStatus.ACCEPTED,
    });

    const savedFollow = await this.followRepo.save(follow);

    const entity = await this.followRepo.findOne({
      where: { id: savedFollow.id },
      relations: [
        'follower',
        'follower.user',
        'following',
        'following.user',
      ],
    });

    const dto = FollowMapper.toFollowerDto(entity!);

    try {
      if (isPrivate) {
        await this.notificationService.notifyRequestFollow(
          follower.id,
          following.id,
          dto,
        );
      } else {
        await this.notificationService.notifyFollow(
          follower.id,
          following.id,
        );
      }
    } catch (error) {
      this.logger.error(`Failed to send notification: ${error.message}`);
    }
    return savedFollow;
  }


  async acceptFollowRequest(followId: string, currentUserId: string): Promise<Follow> {
    const currentProfile = await this.profilesService.findByUserId(currentUserId);

    const follow = await this.followRepo.findOne({
      where: { id: followId },
      relations: ['following', 'follower'],
    });

    if (!follow || follow.following.id !== currentProfile.id) throw new ForbiddenException('Not allowed');

    follow.status = FollowStatus.ACCEPTED;
    const savedFollow = await this.followRepo.save(follow);

    try {
      await this.notificationService.notifyFollowRequestAccepted(
        follow.following.id,
        follow.follower.id
      );
    } catch (error) {
      this.logger.error(`Failed to send notification: ${error.message}`);
    }

    return savedFollow;
  }

  async rejectFollowRequest(followId: string, currentUserId: string): Promise<void> {
    const currentProfile = await this.profilesService.findByUserId(currentUserId);

    const follow = await this.followRepo.findOne({
      where: { id: followId },
      relations: ['following'],
    });

    if (!follow || follow.following.id !== currentProfile.id) throw new ForbiddenException('Not allowed');

    await this.followRepo.remove(follow);
  }

  async unfollow(currentUserId: string, targetUserId: string) {
    const currentProfile = await this.profilesService.findByUserId(currentUserId);
    const targetProfile = await this.profilesService.findByUserId(targetUserId);

    const follow = await this.followRepo.findOne({
      where: {
        follower: { id: currentProfile.id },
        following: { id: targetProfile.id },
      },
    });

    if (!follow) {
      throw new NotFoundException('Follow relationship not found');
    }

    await this.followRepo.remove(follow);
    return { message: 'Unfollowed successfully' };
  }

  async getFollowers(userId: string): Promise<FollowProfileResponseDto[]> {
    const profile = await this.profilesService.findByUserId(userId)
    const followers = await this.followRepo.find({
      where: {
        following: { id: profile.id },
        status: FollowStatus.ACCEPTED,
      },
      relations: ['follower', 'follower.user'],
      order: { createdAt: 'DESC' },
    });

    return followers.map(follow => plainToInstance(
      FollowProfileResponseDto,
      {
        profile: follow.follower,
        followedAt: follow.createdAt,
      },
      { excludeExtraneousValues: true }
    ));
  }

  async getFollowing(userId: string): Promise<FollowProfileResponseDto[]> {
    const profile = await this.profilesService.findByUserId(userId);

    const following = await this.followRepo.find({
      where: {
        follower: { id: profile.id },
        status: FollowStatus.ACCEPTED,
      },
      relations: ['following', 'following.user'],
      order: { createdAt: 'DESC' },
    });

    return following.map(follow => plainToInstance(
      FollowProfileResponseDto,
      {
        profile: follow.following,
        followedAt: follow.createdAt,
      },
      { excludeExtraneousValues: true }
    ));
  }

  async getSentFollowRequests(userId: string): Promise<FollowProfileResponseDto[]> {
    const profile = await this.profilesService.findByUserId(userId);

    const requests = await this.followRepo.find({
      where: {
        follower: { id: profile.id },
        status: FollowStatus.PENDING,
      },
      relations: ['follower', 'follower.user'],
      order: { createdAt: 'DESC' },
    });

    return requests.map(follow => plainToInstance(
      FollowProfileResponseDto,
      {
        profile: follow.following,
        followedAt: follow.createdAt,
      },
      { excludeExtraneousValues: true }
    ));
  }

  async getReceivedFollowRequests(
    userId: string,
    page: number,
    limit: number,
  ): Promise<IPaginated<FollowProfileResponseDto>> {
    const profile = await this.profilesService.findByUserId(userId);

    const qb = this.followRepo.createQueryBuilder('follow')
      .leftJoinAndSelect('follow.follower', 'follower')
      .leftJoinAndSelect('follow.following', 'following')
      .leftJoinAndSelect('follower.user', 'user')
      .where('following.id = :profileId', { profileId: profile.id })
      .andWhere('follow.status = :status', { status: FollowStatus.PENDING })
      .orderBy('follow.createdAt', 'DESC');

    return paginateWithMapper(qb, page, limit, (follow) =>
      plainToInstance(
        FollowProfileResponseDto,
        {
          id: follow.id,
          profile: follow.follower,
          followedAt: follow.createdAt,
        },
        { excludeExtraneousValues: true }
      )
    );
  }


  async isFollowing(currentUserId: string, targetUserId: string): Promise<boolean> {
    const currentProfile = await this.profilesService.findByUserId(currentUserId);
    const targetProfile = await this.profilesService.findByUserId(targetUserId);

    const follow = await this.followRepo.findOne({
      where: {
        follower: { id: currentProfile.id },
        following: { id: targetProfile.id },
        status: FollowStatus.ACCEPTED,
      },
    });

    return !!follow;
  }

  async getFollowStatus(currentUserId: string, targetUserId: string): Promise<FollowStatus> {
    const currentProfile = await this.profilesService.findByUserId(currentUserId);
    const targetProfile = await this.profilesService.findByUserId(targetUserId);
    this.logger.log("currentProfile.id: ", currentProfile.id)
    this.logger.log("targetProfile.id: ", targetProfile.id)

    const follow = await this.followRepo.findOne({
      where: {
        follower: { id: currentProfile.id },
        following: { id: targetProfile.id },
      },
    });

    this.logger.log("follow: ", follow)

    return follow ? follow.status : FollowStatus.REJECTED;
  }


  async getFollowedAuthorIds(
    currentUserId: string,
    authorProfileIds: string[]
  ): Promise<Set<string>> {
    if (authorProfileIds.length === 0) return new Set();

    const currentProfile = await this.profilesService.findByUserId(currentUserId);

    const follows = await this.followRepo.find({
      where: {
        follower: { id: currentProfile.id },
        following: { id: In(authorProfileIds) },
        status: FollowStatus.ACCEPTED,
      },
      relations: ['following'],
    });

    return new Set(follows.map(f => f.following.id));
  }


  async countFollowersAndFollowing(profileId: string) {
    const profile = await this.profilesService.findById(profileId);

    const [followersCount, followingCount] = await Promise.all([
      this.followRepo.count({
        where: {
          following: { id: profile.id },
          status: FollowStatus.ACCEPTED,
        },
      }),
      this.followRepo.count({
        where: {
          follower: { id: profile.id },
          status: FollowStatus.ACCEPTED,
        },
      }),
    ]);

    return {
      followersCount,
      followingCount,
    };
  }


}
