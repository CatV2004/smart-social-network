import { BadRequestException, ConflictException, ForbiddenException, forwardRef, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Follow, FollowStatus } from './entities/follow.entity';
import { In, Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { FollowProfileResponseDto } from './dto/follow-profile-response.dto';
import { UsersService } from '../users/users.service';
import { ProfilesService } from '../profiles/profiles.service';

@Injectable()
export class FollowsService {
  private readonly logger = new Logger(FollowsService.name)
  constructor(
    @InjectRepository(Follow) private followRepo: Repository<Follow>,

    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,

    @Inject(forwardRef(() => ProfilesService))
    private readonly profilesService: ProfilesService,

  ) { }

  async requestFollow(followerUserId: string, followingProfileId: string): Promise<Follow> {
    const follower = await this.profilesService.findByUserId(followerUserId);
    const following = await this.profilesService.findById(followingProfileId);

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

    return this.followRepo.save(follow);
  }


  async acceptFollowRequest(followId: string, currentUserId: string): Promise<Follow> {
    const currentProfile = await this.profilesService.findByUserId(currentUserId);

    const follow = await this.followRepo.findOne({
      where: { id: followId },
      relations: ['following'],
    });

    if (!follow || follow.following.id !== currentProfile.id) throw new ForbiddenException('Not allowed');

    follow.status = FollowStatus.ACCEPTED;
    return this.followRepo.save(follow);
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

  async getReceivedFollowRequests(userId: string): Promise<FollowProfileResponseDto[]> {
    const profile = await this.profilesService.findByUserId(userId);

    const requests = await this.followRepo.find({
      where: {
        following: { id: profile.id },
        status: FollowStatus.PENDING,
      },
      relations: ['follower', 'follower.user'],
      order: { createdAt: 'DESC' },
    });

    return requests.map(follow => plainToInstance(
      FollowProfileResponseDto,
      {
        profile: follow.follower,
        followedAt: follow.createdAt,
      },
      { excludeExtraneousValues: true }
    ));
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
