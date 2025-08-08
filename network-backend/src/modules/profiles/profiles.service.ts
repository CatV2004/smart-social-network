import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';
import { EntityManager, Repository } from 'typeorm';
import { ProfileResponseDto } from './dto/response-profile.dto';
import { plainToInstance } from 'class-transformer';
import { UsersService } from '../users/users.service';
import { FollowsService } from '../follows/follows.service';
import { PostsService } from '../posts/posts.service';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,

    @Inject(forwardRef(() => FollowsService))
    private readonly postsService: PostsService,

    @Inject(forwardRef(() => FollowsService))
    private readonly followsService: FollowsService,

    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) { }

  async getProfileByUserId(userId: string): Promise<ProfileResponseDto> {
    const profile = await this.profileRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    const { followersCount, followingCount } = await this.followsService.countFollowersAndFollowing(userId);


    return plainToInstance(ProfileResponseDto, {
      ...profile,
      followersCount,
      followingCount,
    }, {
      excludeExtraneousValues: true,
    });
  }

  async create(
    createProfileDto: CreateProfileDto,
    userId: string,
    manager?: EntityManager,
  ): Promise<ProfileResponseDto> {
    const profileRepo = manager?.getRepository(Profile) ?? this.profileRepository;

    const user = await this.usersService.findById(userId, manager);

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    const profile = profileRepo.create({
      ...createProfileDto,
      user,
    });

    const saved = await profileRepo.save(profile);

    return plainToInstance(ProfileResponseDto, saved, {
      excludeExtraneousValues: true,
    });
  }

  findAll() {
    return `This action returns all profiles`;
  }

  async findById(id: string): Promise<Profile> {
    const profile = await this.profileRepository.findOne({
      where: { id: id }
    })
    if (!profile)
      throw new NotFoundException("Profile not found")

    return profile;

  }

  async findByUserId(userId: string): Promise<Profile> {
    const profile = await this.profileRepository.findOne({
      where: {
        user: { id: userId }
      }
    });

    if (!profile) {
      throw new NotFoundException("Profile not found")
    }

    return profile;
  }

  async findByPostId(postId: string): Promise<Profile> {
    const post = await this.postsService.findByIdWithRelations(postId, ['author'])
    
    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }

    return post.author;
  }

  async updateProfile(
    userId: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<ProfileResponseDto> {
    let profile = await this.profileRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!profile) {
      const user = await this.usersService.findById(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      profile = this.profileRepository.create({ user, ...updateProfileDto });
    } else {
      Object.assign(profile, updateProfileDto);
    }
    const saved = await this.profileRepository.save(profile);

    return plainToInstance(ProfileResponseDto, saved, {
      excludeExtraneousValues: true,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} profile`;
  }

}
