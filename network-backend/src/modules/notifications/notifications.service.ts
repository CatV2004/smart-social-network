import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { CreateNotificationDto } from './dtos/create-notification.dto';
import { UpdateNotificationDto } from './dtos/update-notification.dto';
import { NotificationType } from './types/notification.type';
import { NotificationDto } from './dtos/notification.dto';
import { PaginationQueryDto } from '@/common/dtos/pagination-query.dto';
import { IPaginated } from '@/common/dtos/paginated.interface';
import { ProfilesService } from '../profiles/profiles.service';
import { NotificationMapper } from './mappers/notification.mapper';
import { paginateWithMapper } from '@/common/utils/paginate-with-mapper';
import { FollowProfileResponseDto } from '../follows/dtos/follow-profile-response.dto';
import { NotificationRealtimeService } from '@/socket/notifications/notification-realtime.service';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
    private readonly notificationRealtimeService: NotificationRealtimeService,
    @Inject(forwardRef(() => ProfilesService))
    private readonly profilesService: ProfilesService,
  ) { }

  /**
   * Tạo thông báo mới (generic)
   */
  async create(dto: CreateNotificationDto) {

    const receiverProfile = await this.profilesService.findByIdWithRelations(dto.receiverId, ['user']);
    const receiverUserId = receiverProfile.user.id;
    const isReceiverOnline = this.notificationRealtimeService.isUserOnline(receiverUserId);
    try {
      const noti = this.notificationRepo.create({
        sender: dto.senderId ? ({ id: dto.senderId } as any) : null,
        receiver: { id: dto.receiverId } as any,
        type: dto.type,
        post: dto.postId ? ({ id: dto.postId } as any) : undefined,
        comment: dto.commentId ? ({ id: dto.commentId } as any) : undefined,
        metadata: dto.metadata,
      });
      const saved = await this.notificationRepo.save(noti);

      const loaded = await this.buildDetailQuery()
        .where('n.id = :id', { id: saved.id })
        .getOne();

      const notiDto = NotificationMapper.toDto(loaded!);


      if (isReceiverOnline && saved) {
        this.notificationRealtimeService.sendNotification(receiverUserId, notiDto);
        this.logger.log(`Notification sent realtime to user ${receiverUserId}`);
      } else {
        this.logger.log(`User ${receiverUserId} is offline, notification saved only`);
      }

      return saved;
    } catch (error) {
      this.logger.error(`Error creating notification: ${error.message}`);
      throw error;
    }
  }

  private buildDetailQuery() {
    return this.notificationRepo
      .createQueryBuilder('n')
      .leftJoinAndSelect('n.sender', 'sender')
      .leftJoinAndSelect('sender.user', 'senderUser')
      .leftJoinAndSelect('n.post', 'post')
      .leftJoinAndSelect('post.media', 'postMedia')
      .leftJoinAndSelect('n.comment', 'comment')
      .leftJoinAndSelect('comment.post', 'commentPost')
      .leftJoinAndSelect('commentPost.media', 'commentPostMedia');
  }

  private buildListQuery(profileId: string): SelectQueryBuilder<Notification> {
    return this.notificationRepo
      .createQueryBuilder('n')
      .leftJoinAndSelect('n.sender', 'sender')
      .leftJoinAndSelect('sender.user', 'senderUser')
      .leftJoinAndSelect('n.post', 'post')
      .leftJoinAndSelect('post.media', 'postMedia')
      .leftJoinAndSelect('n.comment', 'comment')
      .leftJoinAndSelect('comment.post', 'commentPost')
      .leftJoinAndSelect('commentPost.media', 'commentPostMedia')
      .where('n.receiver.id = :profileId', { profileId });
  }

  /**
   * Lấy danh sách thông báo (phân trang + sort)
   */
  async getForUser(
    pagination: PaginationQueryDto,
    userId: string,
  ): Promise<IPaginated<NotificationDto>> {
    const profile = await this.profilesService.findByUserId(userId)
    const {
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = pagination;

    const qb = this.buildListQuery(profile.id).orderBy(
      `n.${sortBy}`,
      sortOrder as 'ASC' | 'DESC',
    );
    // return paginate<Notification>(qb, page, limit, NotificationDto);
    return paginateWithMapper(qb, page, limit, NotificationMapper.toDto);
  }

  /**
   * Đánh dấu 1 thông báo đã đọc / update metadata
   */
  async update(notificationId: string, dto: UpdateNotificationDto) {
    await this.notificationRepo.update(notificationId, dto);
    return this.notificationRepo.findOne({ where: { id: notificationId } });
  }

  /**
   * Đánh dấu tất cả thông báo của 1 user là đã đọc
   */
  async markAllAsRead(userId: string) {
    await this.notificationRepo.update(
      { receiver: { id: userId }, isRead: false },
      { isRead: true },
    );
    return { success: true };
  }

  /**
   * Đếm số thông báo chưa đọc của 1 user
   */
  async countUnread(userId: string) {
    const profile = await this.profilesService.findByUserId(userId)
    return this.notificationRepo.count({
      where: { receiver: { id: profile.id }, isRead: false },
    });
  }

  /**
   * Xóa thông báo
   */
  async remove(notificationId: string) {
    await this.notificationRepo.delete(notificationId);
    return { success: true };
  }

  // =====================================================
  //                   HELPER METHODS 
  // =====================================================

  async notifyLikePost(senderId: string, receiverId: string, postId: string) {
    return this.create({
      senderId,
      receiverId,
      type: NotificationType.LIKE_POST,
      postId,
      metadata: { message: 'liked your post' },
    });
  }

  async notifyCommentPost(
    senderId: string,
    receiverId: string,
    postId: string,
    commentId: string,
  ) {
    return this.create({
      senderId,
      receiverId,
      type: NotificationType.COMMENT_POST,
      postId,
      commentId,
      metadata: { message: 'commented on your post' },
    });
  }

  async notifyReplyComment(
    senderId: string,
    receiverId: string,
    postId: string,
    commentId: string,
  ) {
    return this.create({
      senderId,
      receiverId,
      type: NotificationType.REPLY_COMMENT,
      postId,
      commentId,
      metadata: { message: 'replied to your comment' },
    });
  }

  async notifyFollow(senderId: string, receiverId: string) {
    return this.create({
      senderId,
      receiverId,
      type: NotificationType.FOLLOW,
      metadata: {
        message: 'started following you',
      },
    });
  }

  async notifyFollowRequestAccepted(senderId: string, receiverId: string) {
    return this.create({
      senderId,
      receiverId,
      type: NotificationType.FOLLOW_REQUEST_ACCEPTED,
      metadata: {
        message: 'accepted your follow request',
      },
    });
  }

  async notifyRequestFollow(
    senderId: string,
    receiverId: string,
    followInfo: FollowProfileResponseDto,
  ) {
    const metadata = {
      ...followInfo,
      message: `${followInfo.profile.user.firstName} ${followInfo.profile.user.lastName} requested to follow you`,
    };

    return this.create({
      senderId,
      receiverId,
      type: NotificationType.FOLLOW_REQUEST,
      metadata,
    });
  }

  async notifyPostRemoved(
    receiverId: string,
    postId: string,
    reason: string,
  ) {
    console.log("postId: ", postId)
    const metadata = {
      postId,
      reason,
      message: `Bài viết của bạn đã bị xóa vì vi phạm chuẩn mực cộng đồng: ${reason}`,
    };

    return this.create({
      receiverId: receiverId,
      type: NotificationType.POST_REMOVED,
      metadata: metadata,
    });
  }


  async notifyMention(
    senderId: string,
    receiverId: string,
    postId?: string,
    commentId?: string,
  ) {
    return this.create({
      senderId,
      receiverId,
      type: NotificationType.MENTION,
      postId,
      commentId,
      metadata: { message: 'mentioned you' },
    });
  }

  async notifyTag(senderId: string, receiverId: string, postId: string) {
    return this.create({
      senderId,
      receiverId,
      type: NotificationType.TAG,
      postId,
      metadata: { message: 'tagged you in a post' },
    });
  }
}
