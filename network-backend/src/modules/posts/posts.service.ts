import { BadRequestException, forwardRef, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dtos/create-post.dto';
import { Post } from './entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, IsNull, LessThan, Not, Repository, SelectQueryBuilder } from 'typeorm';
import { ProfilesService } from '../profiles/profiles.service';
import { PaginationQueryDto, SortOrder } from '@/common/dtos/pagination-query.dto';
import { IPaginated } from '@/common/dtos/paginated.interface';
import { PostResponseDto } from './dtos/response-post.dto';
import { paginate } from '@/common/utils/pagination.util';
import { MediaService } from '../media/media.service';
import { MediaType } from '../media/types/media.type';
import { SearchService } from '../search/search.service';
import { PostSearchDto } from '../search/dtos/post-search.dto';
import dayjs from 'dayjs';

interface UpdatePostOptions {
  content?: string;
  mediaToDelete?: string[];
  mediaToUpdate?: Array<{ mediaId: string; file: Express.Multer.File }>;
  newMedia?: Express.Multer.File[];
  isPinned?: boolean;
}

@Injectable()
export class PostsService {
  private readonly logger = new Logger(PostsService.name);
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,

    @Inject(forwardRef(() => ProfilesService))
    private readonly profilesService: ProfilesService,

    @Inject(forwardRef(() => MediaService))
    private readonly mediaService: MediaService,

    private readonly dataSource: DataSource,

    private readonly searchService: SearchService,

  ) { }
  async create(dto: CreatePostDto, userId: string): Promise<Post> {
    const { content } = dto;

    const profile = await this.profilesService.findByUserId(userId);
    const post = this.postRepository.create({ content, author: profile });
    const savedPost = await this.postRepository.save(post);

    const postSearchDto: PostSearchDto = {
      id: savedPost.id,
      content: savedPost.content,
      authorId: profile.id,
    };

    this.searchService.addPost(postSearchDto).catch(err => {
      console.error('Failed to index post in Elasticsearch', err);
    });
    return savedPost;
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
      relations: ['media', 'author'],
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.media && post.media.length > 0) {
      for (const media of post.media) {
        try {
          await this.mediaService.deleteMediaById(media.id);
        } catch (err) {
          this.logger.error(`Failed to delete media ${media.id}`, err);
        }
      }
    }

    await this.postRepository.delete(postId);
  }

  async updatePost(
    postId: string,
    updateOptions: UpdatePostOptions,
  ): Promise<Post> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const post = await this.postRepository.findOne({
        where: { id: postId },
        relations: ['author', 'media'],
      });

      if (!post) {
        throw new NotFoundException('Post not found');
      }

      if (updateOptions.content !== undefined) {
        post.content = updateOptions.content;
        post.isEdited = true;
      }

      if (updateOptions.mediaToDelete && updateOptions.mediaToDelete.length > 0) {
        await this.handleMediaDeletion(updateOptions.mediaToDelete, post);
      }

      if (updateOptions.mediaToUpdate && updateOptions.mediaToUpdate.length > 0) {
        await this.handleMediaUpdates(updateOptions.mediaToUpdate, post);
      }

      if (updateOptions.newMedia && updateOptions.newMedia.length > 0) {
        await this.handleNewMedia(updateOptions.newMedia, postId, post);
      }

      if (updateOptions.isPinned !== undefined) {
        post.isPinned = updateOptions.isPinned;
      }

      this.validateMediaCount(post.media);

      const updatedPost = await queryRunner.manager.save(post);
      await queryRunner.commitTransaction();

      return updatedPost;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private validateMediaCount(media: any[]): void {
    const maxMediaPerPost = 10;
    if (media.length > maxMediaPerPost) {
      throw new BadRequestException(`A post can have maximum ${maxMediaPerPost} media files`);
    }
  }

  private async handleMediaDeletion(mediaIds: string[], post: Post): Promise<void> {
    for (const mediaId of mediaIds) {
      await this.mediaService.deleteMediaById(mediaId);
    }

    post.media = post.media.filter(media => !mediaIds.includes(media.id));
  }

  private async handleMediaUpdates(
    mediaUpdates: Array<{ mediaId: string; file: Express.Multer.File }>,
    post: Post,
  ): Promise<void> {
    for (const { mediaId, file } of mediaUpdates) {
      const mediaExists = post.media.some(media => media.id === mediaId);
      if (!mediaExists) {
        throw new BadRequestException(`Media ${mediaId} does not belong to this post`);
      }

      await this.mediaService.updateMedia(mediaId, file);
    }
  }

  private getMediaType(mimeType: string): MediaType {
    if (mimeType.startsWith('image/')) {
      return MediaType.IMAGE;
    } else if (mimeType.startsWith('video/')) {
      return MediaType.VIDEO;
    }
    return MediaType.IMAGE;
  }

  private async handleNewMedia(
    files: Express.Multer.File[],
    postId: string,
    post: Post,
  ): Promise<void> {
    for (const file of files) {
      const mediaType = this.getMediaType(file.mimetype);

      const newMedia = await this.mediaService.createNewMedia(file, postId, mediaType);

      post.media.push(newMedia);
    }
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

  async getSoftDeletedPosts(
    pagination: PaginationQueryDto,
  ): Promise<IPaginated<PostResponseDto>> {
    const { page = 1, limit = 3, sortBy = 'deletedAt', sortOrder = 'DESC' } =
      pagination;

    const qb = this.postRepository
      .createQueryBuilder('post')
      .withDeleted()
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('author.user', 'user')
      .leftJoinAndSelect('post.media', 'media')
      .where('post.deletedAt IS NOT NULL')
      .orderBy(`post.${sortBy}`, sortOrder as 'ASC' | 'DESC');

    return paginate(qb, page, limit, PostResponseDto);
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
      .leftJoinAndSelect('author.user', 'user')
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

  async getSavedPosts(
    userId: string,
    pagination: PaginationQueryDto,
  ): Promise<IPaginated<PostResponseDto>> {
    const profile = await this.profilesService.findByUserId(userId);
    if (!profile) throw new NotFoundException('Profile not found');

    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = SortOrder.DESC,
    } = pagination;

    const qb = this.postRepository
      .createQueryBuilder('post')
      .innerJoin('post.savedBy', 'savePost', 'savePost.profileId = :profileId', {
        profileId: profile.id,
      })
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('author.user', 'user')
      .leftJoinAndSelect('post.media', 'media')
      .orderBy(`post.${sortBy}`, sortOrder);

    return paginate(qb, page, limit, PostResponseDto);
  }


  async findByIdWithRelations(id: string, relations: string[] = [], withDeleted = false): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations,
      withDeleted,
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

  /**
   * Lấy các bài viết đã soft-delete lâu hơn retentionDays ngày.
   */
  async findExpiredPosts(retentionDays: number, limit: number): Promise<Post[]> {
    const expiryDate = dayjs().subtract(retentionDays, 'day').toDate();

    return this.postRepository.find({
      where: {
        deletedAt: LessThan(expiryDate),
      },
      take: limit,
      order: { deletedAt: 'ASC' },
    });
  }

  /**
   * Xóa vĩnh viễn các bài viết theo danh sách ID.
   */
  async permanentlyDeleteMany(ids: string[]): Promise<void> {
    if (!ids.length) return;

    await this.postRepository.delete(ids);
  }

  /**
   * Lấy danh sách các post chưa soft-delete theo batch (phân trang).
   * @param params.limit Số lượng bài viết muốn lấy
   * @param params.offset Vị trí bắt đầu (default = 0)
   * @returns { items: Post[], nextOffset: number | null }
   */
  async findAllActivePaged(params: { limit: number; offset?: number }): Promise<{ items: Post[]; nextOffset: number | null }> {
    const { limit, offset = 0 } = params;

    // Lấy batch bài viết chưa soft-delete
    const items = await this.postRepository.find({
      where: { deletedAt: IsNull() },
      order: { createdAt: 'DESC' },
      take: limit,
      skip: offset,
      relations: ['author'],
    });

    // Nếu số lượng trả về < limit => không còn batch tiếp theo
    const nextOffset = items.length === limit ? offset + limit : null;

    return { items, nextOffset };
  }

  async findByIds(
    ids: string[],
    pagination: PaginationQueryDto,
    userId?: string,
  ): Promise<IPaginated<PostResponseDto>> {
    const { page = 1, limit = 3, sortBy = 'createdAt', sortOrder = 'DESC' } = pagination;

    let profileId: string | undefined;
    if (userId) {
      const profile = await this.profilesService.findByUserId(userId);
      profileId = profile?.id;
    }

    const qb = this.buildListQuery(profileId)
      .andWhere('post.id IN (:...ids)', { ids })
      .orderBy(`post.${sortBy}`, sortOrder as 'ASC' | 'DESC');

    return paginate(qb, page, limit, PostResponseDto);
  }


}
