import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
  ) { }

  async create(dto: CreateCommentDto, userId: string): Promise<CommentResponseDto> {
    const [profile, post] = await Promise.all([
      this.profilesService.findByUserId(userId),
      this.postsService.findById(dto.postId),
    ]);

    let parentComment: Comment | null = null;
    let replyTo: Profile | null = null;

    if (dto.parentCommentId) {
      parentComment = await this.commentsRepo.findOne({ where: { id: dto.parentCommentId } });
      if (!parentComment) throw new NotFoundException('Parent comment not found');
    }

    if (dto.replyToId) {
      replyTo = await this.profilesService.findById(dto.replyToId);
      if (!replyTo) throw new NotFoundException('Reply target not found');
    }

    const comment = this.commentsRepo.create({
      content: dto.content,
      author: profile,
      post,
      parent: parentComment ? (parentComment.parent ? parentComment.parent : parentComment) : null,
      replyTo,
      isEdited: false,
      isPinned: false,
      repliesCount: 0,
    });

    const saved = await this.commentsRepo.save(comment);

    if (parentComment) {
      await this.commentsRepo.increment({ id: parentComment.id }, 'repliesCount', 1);
    }

    const fullComment = await this.commentsRepo.findOne({
      where: { id: saved.id },
      relations: ['author', 'author.user', 'replyTo', 'replyTo.user'],
    });

    return plainToInstance(CommentResponseDto, fullComment, {
      excludeExtraneousValues: true,
    });
  }


  async findTopLevelByPostId(
    postId: string,
    page = 1,
    limit = 4,
  ): Promise<PaginatedCommentResponseDto> {
    const qb = this.commentsRepo
      .createQueryBuilder("comment")
      .leftJoinAndSelect("comment.author", "author")
      .leftJoinAndSelect("author.user", "user")
      .where("comment.post_id = :postId", { postId })
      .andWhere("comment.parent_id IS NULL")
      .orderBy("comment.created_at", "DESC");

    return paginate<Comment>(
      qb,
      page,
      limit,
      CommentResponseDto,
    ) as Promise<PaginatedCommentResponseDto>;
  }


}
