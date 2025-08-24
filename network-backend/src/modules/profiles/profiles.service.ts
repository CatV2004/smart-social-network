import { BadRequestException, forwardRef, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
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
import { UpdateProfileImageDto } from './dto/update-profile-image.dto';
import { CloudinaryService } from '@/cloudinary/cloudinary.service';
import { SearchService } from '../search/search.service';
import { FollowStatus } from '../follows/entities/follow.entity';

@Injectable()
export class ProfilesService {
  private readonly logger = new Logger(ProfilesService.name)
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,

    @Inject(forwardRef(() => PostsService))
    private readonly postsService: PostsService,

    @Inject(forwardRef(() => FollowsService))
    private readonly followsService: FollowsService,

    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,

    private readonly cloudinaryService: CloudinaryService,

    private readonly searchService: SearchService,
  ) { }

  async getProfileByUserId(userId: string, currentUserId?: string): Promise<ProfileResponseDto> {
    const profile = await this.profileRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!profile) {
      throw new NotFoundException(`Profile for user ${userId} not found`);
    }

    const { followersCount, followingCount } = await this.followsService.countFollowersAndFollowing(profile.id);
    const postsCount = await this.postsService.countPostsByProfileId(profile.id);

    let isFollowed = false;
    if (currentUserId && currentUserId !== userId) {
      isFollowed = await this.followsService.isFollowing(currentUserId, userId);
    }

    return plainToInstance(ProfileResponseDto, {
      ...profile,
      followersCount,
      followingCount,
      postsCount,
      isFollowed
    }, {
      excludeExtraneousValues: true,
    });
  }

  async getProfileByUsername(username: string, currentUserId?: string): Promise<ProfileResponseDto> {
    const profile = await this.profileRepository.findOne({
      where: { user: { username: username } },
      relations: ['user'],
    });
    if (!profile) {
      throw new NotFoundException(`Profile with user ${username} not found`)
    }
    const { followersCount, followingCount } = await this.followsService.countFollowersAndFollowing(profile.id);
    const postsCount = await this.postsService.countPostsByProfileId(profile.id);

    let isFollowed = false;
    let followStatus: FollowStatus = FollowStatus.REJECTED;
    if (currentUserId && currentUserId !== profile.user.id) {
      const status = await this.followsService.getFollowStatus(currentUserId, profile.user.id);
      followStatus = status;
      isFollowed = status === FollowStatus.ACCEPTED;
    }

    this.logger.log("followStatus: ", followStatus)
    return plainToInstance(ProfileResponseDto, {
      ...profile,
      followersCount,
      followingCount,
      postsCount,
      isFollowed,
      followStatus,
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

  async updateProfileImage(
    userId: string,
    file: Express.Multer.File,
    dto: UpdateProfileImageDto,
  ): Promise<ProfileResponseDto> {
    if (!file) throw new BadRequestException('File is required');

    const profile = await this.profileRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });
    if (!profile) throw new NotFoundException('Profile not found');

    // Upload lên Cloudinary
    const folder = dto.type === 'avatar' ? 'avatars' : 'covers';
    const uploadResult = await this.cloudinaryService.uploadFile(file, folder);

    // Cập nhật profile
    if (dto.type === 'avatar') {
      profile.avatar = uploadResult.secure_url;
    } else {
      profile.coverImage = uploadResult.secure_url;
    }

    const saved = await this.profileRepository.save(profile);

    return plainToInstance(ProfileResponseDto, saved, {
      excludeExtraneousValues: true,
    });
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

  async findByUsername(username: string): Promise<Profile> {
    const profile = await this.profileRepository.findOne({
      where: {
        user: { username: username }
      }
    });

    if (!profile) {
      throw new NotFoundException("Profile not found")
    }

    return profile;
  }

  async findByIdWithRelations(id: string, relations: string[] = []): Promise<Profile> {
    const profile = await this.profileRepository.findOne({
      where: { id },
      relations,
    });

    if (!profile) {
      throw new NotFoundException(`profile with id ${id} not found`);
    }

    return profile;
  }

  async findByPostId(postId: string, withDeleted = false): Promise<Profile> {
    const post = await this.postsService.findByIdWithRelations(postId, ['author'], withDeleted)

    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }

    return post.author;
  }

  async updateProfile(
    userId: string,
    updateProfileDto: UpdateProfileDto,
    files?: {
      avatar?: Express.Multer.File[];
      coverImage?: Express.Multer.File[];
    },
  ): Promise<ProfileResponseDto> {
    let profile = await this.profileRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!profile) {
      const user = await this.usersService.findById(userId);
      profile = this.profileRepository.create({ user, ...updateProfileDto });
    } else {
      Object.assign(profile, updateProfileDto);
    }

    // xử lý upload avatar
    if (files?.avatar?.[0]) {
      const avatar = await this.cloudinaryService.uploadFile(
        files.avatar[0],
        'avatars',
      );
      profile.avatar = avatar.url;
    }

    // xử lý upload coverImage
    if (files?.coverImage?.[0]) {
      const cover = await this.cloudinaryService.uploadFile(
        files.coverImage[0],
        'covers',
      );
      profile.coverImage = cover.url;
    }

    const saved = await this.profileRepository.save(profile);

    const fullname = `${saved.user.firstName} ${saved.user.lastName}`
    // const fullname = `${profile.user.firstName} ${profile.user.lastName}`

    await this.searchService.updateUser(userId, {
      username: saved.user.username,
      fullName: fullname,
      email: saved.user.email,
      avatar: saved.avatar,
    });

    return plainToInstance(ProfileResponseDto, saved, {
      excludeExtraneousValues: true,
    });
  }


  remove(id: number) {
    return `This action removes a #${id} profile`;
  }

}
