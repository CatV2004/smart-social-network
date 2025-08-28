import { Injectable, Logger } from '@nestjs/common';
import { SocketGateway } from '@/socket/socket.gateway';
import { NotificationDto } from '@/modules/notifications/dtos/notification.dto';

@Injectable()
export class NotificationRealtimeService {
    private readonly logger = new Logger(NotificationRealtimeService.name);

    constructor(private readonly socketGateway: SocketGateway) { }

    async sendNotification(userId: string, notification: NotificationDto) {
        try {
            const delivered = this.socketGateway.sendNotificationToUser(userId, notification);
            this.logger.log(`Sent notification to user ${userId}, delivered: ${delivered}`);
            return delivered;
        } catch (error) {
            this.logger.error(`Failed to send notification: ${error.message}`);
            return false;
        }
    }

    async sendNotifications(userIds: string[], notification: NotificationDto) {
        try {
            userIds.forEach(userId => {
                this.socketGateway.sendNotificationToUser(userId, notification);
            });
            this.logger.log(`Sent notification to ${userIds.length} users`);
        } catch (error) {
            this.logger.error(`Failed to send notifications: ${error.message}`);
        }
    }

    async sendMultipleNotifications(userId: string, notifications: NotificationDto[]) {
        try {
            const delivered = this.socketGateway.sendMultipleNotificationsToUser(userId, notifications);
            this.logger.log(`Sent ${notifications.length} notifications to user ${userId}, delivered: ${delivered}`);
            return delivered;
        } catch (error) {
            this.logger.error(`Failed to send multiple notifications: ${error.message}`);
            return false;
        }
    }

    isUserOnline(userId: string): boolean {
        return this.socketGateway.isUserOnline(userId);
    }
}