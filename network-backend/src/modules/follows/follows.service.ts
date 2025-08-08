import { BadRequestException, ConflictException, ForbiddenException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Follow, FollowStatus } from './entities/follow.entity';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { FollowUserResponseDto } from './dto/follow-user-response.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class FollowsService {
  constructor(
    @InjectRepository(Follow) private followRepo: Repository<Follow>,

    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) { }

  async requestFollow(followerId: string, followingId: string): Promise<Follow> {
    if (followerId === followingId) throw new BadRequestException('Cannot follow yourself');

    const follower = await this.usersService.findById(followerId);
    const following = await this.usersService.findByIdWithRelations(followingId, ['profile']);


    const isPrivate = following.profile?.isPrivate;

    const existing = await this.followRepo.findOne({ where: { follower: { id: followerId }, following: { id: followingId } } });
    if (existing) throw new ConflictException('Follow request already exists');

    const follow = this.followRepo.create({
      follower,
      following,
      status: isPrivate ? FollowStatus.PENDING : FollowStatus.ACCEPTED,
    });

    return this.followRepo.save(follow);
  }

  async acceptFollowRequest(followId: string, currentUserId: string): Promise<Follow> {
    const follow = await this.followRepo.findOne({
      where: { id: followId },
      relations: ['following'],
    });

    if (!follow || follow.following.id !== currentUserId) throw new ForbiddenException('Not allowed');

    follow.status = FollowStatus.ACCEPTED;
    return this.followRepo.save(follow);
  }

  async rejectFollowRequest(followId: string, currentUserId: string): Promise<void> {
    const follow = await this.followRepo.findOne({
      where: { id: followId },
      relations: ['following'],
    });

    if (!follow || follow.following.id !== currentUserId) throw new ForbiddenException('Not allowed');

    await this.followRepo.remove(follow);
  }

  async unfollow(currentUserId: string, targetUserId: string) {
    const follow = await this.followRepo.findOne({
      where: {
        follower: { id: currentUserId },
        following: { id: targetUserId },
      },
    });

    if (!follow) {
      throw new NotFoundException('Follow relationship not found');
    }

    await this.followRepo.remove(follow);
    return { message: 'Unfollowed successfully' };
  }

  async getFollowers(userId: string): Promise<FollowUserResponseDto[]> {
    const followers = await this.followRepo.find({
      where: {
        following: { id: userId },
        status: FollowStatus.ACCEPTED,
      },
      relations: ['follower', 'follower.profile'],
      order: { createdAt: 'DESC' },
    });
    return followers.map(follow => plainToInstance(
      FollowUserResponseDto,
      {
        user: follow.follower,
        followedAt: follow.createdAt,
      },
      { excludeExtraneousValues: true }
    ));
  }

  async getFollowing(userId: string): Promise<FollowUserResponseDto[]> {
    const following = await this.followRepo.find({
      where: {
        follower: { id: userId },
        status: FollowStatus.ACCEPTED,
      },
      relations: ['following', 'following.profile'],
      order: { createdAt: 'DESC' },
    });
    return following.map(follow => plainToInstance(
      FollowUserResponseDto,
      {
        user: follow.following,
        followedAt: follow.createdAt,
      },
      { excludeExtraneousValues: true }
    ));
  }

  async getSentFollowRequests(userId: string): Promise<FollowUserResponseDto[]> {
    const requests = await this.followRepo.find({
      where: {
        follower: { id: userId },
        status: FollowStatus.PENDING,
      },
      relations: ['following', 'following.profile'],
      order: { createdAt: 'DESC' },
    });

    return requests.map(follow => plainToInstance(
      FollowUserResponseDto,
      {
        user: follow.following,
        followedAt: follow.createdAt,
      },
      { excludeExtraneousValues: true }
    ));
  }

  async getReceivedFollowRequests(userId: string): Promise<FollowUserResponseDto[]> {
    const requests = await this.followRepo.find({
      where: {
        following: { id: userId },
        status: FollowStatus.PENDING,
      },
      relations: ['follower', 'follower.profile'],
      order: { createdAt: 'DESC' },
    });

    return requests.map(follow => plainToInstance(
      FollowUserResponseDto,
      {
        user: follow.follower,
        followedAt: follow.createdAt,
      },
      { excludeExtraneousValues: true }
    ));
  }

  async isFollowing(currentUserId: string, targetUserId: string): Promise<boolean> {
    const follow = await this.followRepo.findOne({
      where: {
        follower: { id: currentUserId },
        following: { id: targetUserId },
        status: FollowStatus.ACCEPTED,
      },
    });

    return !!follow;
  }

  async countFollowersAndFollowing(userId: string) {
    const [followersCount, followingCount] = await Promise.all([
      this.followRepo.count({
        where: {
          following: { id: userId },
          status: FollowStatus.ACCEPTED,
        },
      }),
      this.followRepo.count({
        where: {
          follower: { id: userId },
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
