import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationType } from './types/notification.type';
import { NotificationsGateway } from './notifications.gateway';
import { paginate } from '@/common/utils/pagination.util';
import { NotificationDto } from './dto/notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
    private readonly notificationGateway: NotificationsGateway,
  ) { }

  /**
   * Tạo thông báo mới (generic)
   */
  async create(dto: CreateNotificationDto) {
    const noti = this.notificationRepo.create({
      sender: { id: dto.senderId } as any,
      receiver: { id: dto.receiverId } as any,
      type: dto.type,
      post: dto.postId ? ({ id: dto.postId } as any) : undefined,
      comment: dto.commentId ? ({ id: dto.commentId } as any) : undefined,
      metadata: dto.metadata,
    });
    const saved = await this.notificationRepo.save(noti);

    this.notificationGateway.sendNotificationToUser(dto.receiverId, saved);

    return saved;
  }

  /**
   * Lấy danh sách thông báo của 1 user (phân trang)
   */
  async getForUser(
    userId: string,
    options: { page?: number; limit?: number } = {},
  ) {
    const page = options.page ?? 1;
    const limit = options.limit ?? 20;

    const qb = this.notificationRepo
      .createQueryBuilder('n')
      .leftJoinAndSelect('n.sender', 'sender')
      .leftJoinAndSelect('sender.user', 'senderUser')
      .where('n.receiverId = :userId', { userId })
      .orderBy('n.createdAt', 'DESC');

    return paginate<Notification>(qb, page, limit, NotificationDto);
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
    return this.notificationRepo.count({
      where: { receiver: { id: userId }, isRead: false },
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
      metadata: { message: 'started following you' },
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
