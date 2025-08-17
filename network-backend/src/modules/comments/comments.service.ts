import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { PostsService } from '../posts/posts.service';
import { ProfilesService } from '../profiles/profiles.service';
import { plainToInstance } from 'class-transformer';
import { CommentResponseDto } from './dto/comment-response.dto';
import { paginate } from '@/common/utils/pagination.util';
import { PaginatedCommentResponseDto } from './dto/paginated-comment-response.dto';
import { Profile } from '../profiles/entities/profile.entity';

@Injectable()
export class CommentsService {
  private readonly logger = new Logger(CommentsService.name)
  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepo: Repository<Comment>,

    private readonly postsService: PostsService,

    private readonly profilesService: ProfilesService,

    private readonly dataSource: DataSource,
  ) { }

  async create(dto: CreateCommentDto, userId: string): Promise<CommentResponseDto> {
    return await this.dataSource.transaction(async (manager) => {
      const [profile, post] = await Promise.all([
        this.profilesService.findByUserId(userId),
        this.postsService.findById(dto.postId),
      ]);

      let parentComment: Comment | null = null;
      if (dto.parentCommentId) {
        parentComment = await manager.findOne(Comment, { where: { id: dto.parentCommentId } });
        if (!parentComment) throw new NotFoundException('Parent comment not found');
      }

      let replyTo: Profile | null = null;
      if (dto.replyToId) {
        replyTo = await this.profilesService.findById(dto.replyToId);
        if (!replyTo) throw new NotFoundException('Reply target not found');
      }

      const comment = manager.create(Comment, {
        content: dto.content,
        author: profile,
        post,
        parent: parentComment ? (parentComment.parent ?? parentComment) : null,
        replyTo: replyTo,
        isEdited: false,
        isPinned: false,
        repliesCount: 0,
      });

      const saved = await manager.save(comment);

      if (parentComment) {
        await manager.increment(Comment, { id: parentComment.id }, 'repliesCount', 1);
      }

      const fullComment = await manager
        .createQueryBuilder(Comment, 'comment')
        .leftJoinAndSelect('comment.author', 'author')
        .leftJoinAndSelect('author.user', 'authorUser')
        .leftJoinAndSelect('comment.replyTo', 'replyTo')
        .leftJoinAndSelect('replyTo.user', 'replyToUser')
        .select([
          'comment.id',
          'comment.content',
          'comment.repliesCount',
          'comment.isEdited',
          'comment.isPinned',
          'comment.createdAt',
          'comment.updatedAt',
          'author.id',
          'author.avatar',
          'author.bio',
          'authorUser.id',
          'authorUser.email',
          'authorUser.firstName',
          'authorUser.lastName',
          'replyTo.id',
          'replyTo.avatar',
          'replyTo.bio',
          'replyToUser.id',
          'replyToUser.email',
          'replyToUser.firstName',
          'replyToUser.lastName',
        ])
        .where('comment.id = :id', { id: saved.id })
        .getOne();

      return plainToInstance(CommentResponseDto, fullComment, { excludeExtraneousValues: true });
    });
  }

  async findTopLevelByPostId(
    postId: string,
    page = 1,
    limit = 4,
  ): Promise<PaginatedCommentResponseDto> {
    const qb = this.commentsRepo
      .createQueryBuilder("comment")
      .leftJoin("comment.author", "author")
      .leftJoin("author.user", "authorUser")
      .select([
        "comment.id",
        "comment.content",
        "comment.repliesCount",
        "comment.isEdited",
        "comment.isPinned",
        "comment.createdAt",
        "comment.updatedAt",
        "author.id",
        "author.avatar",
        "author.bio",
        "authorUser.id",
        "authorUser.email",
        "authorUser.firstName",
        "authorUser.lastName",
      ])
      .where("comment.post_id = :postId", { postId })
      .andWhere("comment.parent_id IS NULL")
      .orderBy("comment.createdAt", "DESC")
    return paginate<Comment>(
      qb,
      page,
      limit,
      CommentResponseDto,
    ) as Promise<PaginatedCommentResponseDto>;
  }

  async findRepliesByParentId(
    parentCommentId: string,
    page = 1,
    limit = 4,
  ): Promise<PaginatedCommentResponseDto> {
    const qb = this.commentsRepo
      .createQueryBuilder('comment')
      .leftJoin('comment.author', 'author')
      .leftJoin('author.user', 'authorUser')
      .leftJoin('comment.replyTo', 'replyTo')
      .leftJoin('replyTo.user', 'replyToUser')
      .select([
        'comment.id',
        'comment.content',
        'comment.repliesCount',
        'comment.isEdited',
        'comment.isPinned',
        'comment.createdAt',
        'comment.updatedAt',
        'author.id',
        'author.avatar',
        'author.bio',
        'authorUser.id',
        'authorUser.email',
        'authorUser.firstName',
        'authorUser.lastName',
        'replyTo.id',
        'replyTo.avatar',
        'replyTo.bio',
        'replyToUser.id',
        'replyToUser.email',
        'replyToUser.firstName',
        'replyToUser.lastName',
      ])
      .where('comment.parent_id = :parentCommentId', { parentCommentId })
      .orderBy('comment.createdAt', 'ASC');

    return paginate<Comment>(
      qb,
      page,
      limit,
      CommentResponseDto,
    ) as Promise<PaginatedCommentResponseDto>;
  }


}
