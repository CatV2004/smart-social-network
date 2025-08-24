import { Notification } from "../entities/notification.entity";
import { NotificationDto } from "../dto/notification.dto";
import { NotificationType } from "../types/notification.type";

export class NotificationMapper {
    static toDto(entity: Notification): NotificationDto {
        return {
            id: entity.id,
            type: NotificationType[entity.type],
            isRead: entity.isRead,
            createdAt: entity.createdAt,
            sender: entity.sender as any,
            metadata: entity.metadata,
            post: entity.post
                ? {
                    id: entity.post.id,
                    previewUrl:
                        entity.post.media?.[0]?.thumbnail || entity.post.media?.[0]?.url,
                }
                : undefined,
            comment: entity.comment
                ? {
                    id: entity.comment.id,
                    content: entity.comment.content,
                    post: {
                        id: entity.comment.post.id,
                        previewUrl:
                            entity.comment.post.media?.[0]?.thumbnail ||
                            entity.comment.post.media?.[0]?.url,
                    },
                }
                : undefined,
        };
    }
}
