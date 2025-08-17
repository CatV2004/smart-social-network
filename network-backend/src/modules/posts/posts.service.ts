import { BadRequestException, forwardRef, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { Post } from './entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { ProfilesService } from '../profiles/profiles.service';
import { PaginationQueryDto, SortOrder } from '@/common/dtos/pagination-query.dto';
import { IPaginated } from '@/common/dtos/paginated.interface';
import { PostResponseDto } from './dto/response-post.dto';
import { paginate } from '@/common/utils/pagination.util';

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

  /**
   * Hàm build query chung
   */
  buildListQuery(profileId?: string): SelectQueryBuilder<Post> {
    const qb = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('author.user', 'user')
      .leftJoinAndSelect('post.media', 'media');

    if (profileId) {
      qb.leftJoin(
        'post.reactions',
        'reaction',
        'reaction.profileId = :profileId',
        { profileId }
      )
        .leftJoin(
          'post.savedBy',
          'savePost',
          'savePost.profileId = :profileId',
          { profileId }
        )
        .addSelect(
          `CASE WHEN reaction.id IS NULL THEN false ELSE true END`,
          'isReacted'
        )
        .addSelect(
          `CASE WHEN savePost.id IS NULL THEN false ELSE true END`,
          'isSaved'
        );
    } else {
      qb.addSelect('false', 'isReacted')
        .addSelect('false', 'isSaved');
    }

    return qb;
  }


  /**
   * Hàm findAll public
   */
  async findAll(
    pagination: PaginationQueryDto,
    userId?: string,
  ): Promise<IPaginated<PostResponseDto>> {
    const { page = 1, limit = 3, sortBy = 'createdAt', sortOrder = 'DESC' } =
      pagination;

    let profileId: string | undefined;
    if (userId) {
      const profile = await this.profilesService.findByUserId(userId);
      profileId = profile?.id;
    }

    const qb = this.buildListQuery(profileId).orderBy(
      `post.${sortBy}`,
      sortOrder as 'ASC' | 'DESC',
    );

    return paginate(qb, page, limit, PostResponseDto);
  }

  async findByProfileId(
    profileId: string,
    pagination: PaginationQueryDto
  ): Promise<IPaginated<PostResponseDto>> {
    const {
      page = 1,
      limit = 3,
      sortBy = 'createdAt',
      sortOrder = SortOrder.DESC,
    } = pagination;

    const qb = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.media', 'media')
      .where('author.id = :profileId', { profileId })
      .orderBy(`post.${sortBy}`, sortOrder);

    return paginate(qb, page, limit, PostResponseDto);
  }

  async findByUserName(
    username: string,
    pagination: PaginationQueryDto
  ): Promise<IPaginated<PostResponseDto>> {
    const {
      page = 1,
      limit = 3,
      sortBy = 'createdAt',
      sortOrder = SortOrder.DESC,
    } = pagination;

    const qb = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('author.user', 'user')
      .leftJoinAndSelect('post.media', 'media')
      .where('user.username = :username', { username })
      .orderBy(`post.${sortBy}`, sortOrder);

    return paginate(qb, page, limit, PostResponseDto);
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

  async findById(postId: string): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException(`Post with id ${postId} not found`);
    }

    return post
  }

  async countPostsByProfileId(profileId: string): Promise<number> {
    return this.postRepository.count({
      where: {
        author: { id: profileId },
      },
    });
  }

  async existsById(postId: string): Promise<Boolean> {
    return await this.postRepository.exists({
      where: { id: postId }
    })
  }

  async incrementLikesCount(postId: string) {
    await this.postRepository.increment({ id: postId }, 'likesCount', 1);
  }

  async decrementLikesCount(postId: string) {
    await this.postRepository.decrement({ id: postId }, 'likesCount', 1);
  }

}
