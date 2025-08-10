import { BadRequestException, forwardRef, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { Post } from './entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfilesService } from '../profiles/profiles.service';
import { PaginationQueryDto, SortOrder } from '@/common/dtos/pagination-query.dto';
import { plainToInstance } from 'class-transformer';
import { IPaginated } from '@/common/dtos/paginated.interface';
import { PostResponseDto } from './dto/response-post.dto';
import { PaginationMetaDto } from '@/common/dtos/pagination-meta.dto';

@Injectable()
export class PostsService {
  private readonly logger = new Logger(PostsService.name);
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,

    @Inject(forwardRef(() => ProfilesService))
    private readonly profilesService: ProfilesService,

  ) { }
  async create(dto: CreatePostDto, userId: string): Promise<Post> {
    const { content } = dto;

    const profile = await this.profilesService.findByUserId(userId);
    const post = this.postRepository.create({ content, author: profile });
    return this.postRepository.save(post);
  }

  async softDelete(id: string): Promise<void> {
    const post = await this.findByIdWithRelations(id);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    await this.postRepository.softDelete(id);
  }


  async restorePost(postId: string): Promise<Post | null> {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      withDeleted: true,
    })

    if (!post) {
      throw new NotFoundException("Post not found");
    }

    if (!post.deletedAt) {
      throw new BadRequestException("Post is not deleted");
    }

    await this.postRepository.restore(postId);
    return this.postRepository.findOneBy({ id: postId });
  }

  async hardDeletePost(postId: string): Promise<void> {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      withDeleted: true,
      relations: ['author'],
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    await this.postRepository.delete(postId);
  }

  async findAll(pagination: PaginationQueryDto): Promise<IPaginated<PostResponseDto>> {
    const {
      page = 1,
      limit = 3,
      sortBy = 'createdAt',
      sortOrder = SortOrder.DESC,
    } = pagination;

    const [items, total] = await this.postRepository.findAndCount({
      relations: ['author', 'author.user', 'media'],
      order: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    });

    const data = plainToInstance(PostResponseDto, items, {
      excludeExtraneousValues: true,
    });

    const meta: PaginationMetaDto = {
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    };

    return { data, meta };
  }

  async findByProfileId(profileId: string, pagination: PaginationQueryDto): Promise<IPaginated<PostResponseDto>> {
    const {
      page = 1,
      limit = 3,
      sortBy = 'createdAt',
      sortOrder = SortOrder.DESC,
    } = pagination;

    const [items, total] = await this.postRepository.findAndCount({
      where: { author: { id: profileId } },
      relations: {
        author: true,
        media: true,
      },
      order: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    });

    const data = plainToInstance(PostResponseDto, items, {
      excludeExtraneousValues: true,
    });

    const meta: PaginationMetaDto = {
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    };

    return { data, meta };
  }

  async findByIdWithRelations(id: string, relations: string[] = []): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations,
    });

    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }

    return post;
  }
}
