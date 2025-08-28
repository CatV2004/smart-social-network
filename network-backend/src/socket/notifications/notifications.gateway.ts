// notifications.gateway.ts
import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { SocketService } from '../socket.service';
import { NotificationDto } from '@/modules/notifications/dtos/notification.dto';

@WebSocketGateway({
    cors: {
        origin: process.env.FRONTEND_URL || '*',
    },
    namespace: '/notifications',
})
export class NotificationsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private readonly logger = new Logger(NotificationsGateway.name);

    constructor(private readonly socketService: SocketService) { }

    afterInit(server: Server) {
        this.socketService.setServer(server);
        this.logger.log('NotificationsGateway initialized');
    }

    async handleConnection(client: Socket) {
        try {
            const { userId } = client.handshake.auth;

            if (!userId) {
                this.logger.warn(`Notifications connection rejected: No userId`);
                client.disconnect();
                return;
            }

            this.socketService.registerConnection('/notifications', client.id, userId);
            client.join(`user_${userId}`);

            this.logger.log(`User ${userId} connected to notifications (socket: ${client.id})`);

        } catch (error) {
            this.logger.error(`Notifications connection error: ${error.message}`);
            client.disconnect();
        }
    }

    handleDisconnect(client: Socket) {
        this.socketService.unregisterConnection(client.id);
        this.logger.log(`Socket disconnected from notifications: ${client.id}`);
    }

    isUserOnline(userId: string): boolean {
        return this.socketService.isUserOnlineInNamespace(userId, '/notifications');
    }

    sendToUser(userId: string, notification: NotificationDto) {
        this.socketService.emitToUserInNamespace(userId, '/notifications', 'new_notification', notification);
        this.logger.debug(`Sent notification to user ${userId}`);
    }

    sendMultipleToUser(userId: string, notifications: any[]) {
        if (this.isUserOnline(userId)) {
            this.socketService.emitToUserInNamespace(userId, '/notifications', 'new_notifications_batch', notifications);
            this.logger.debug(`Sent ${notifications.length} notifications to user ${userId}`);
            return true;
        }
        return false;
    }

    sendToUsers(userIds: string[], notification: any) {
        userIds.forEach(userId => {
            this.sendToUser(userId, notification);
        });
    }

    sendNotificationToUser(userId: string, notification: NotificationDto) {
        if (this.isUserOnline(userId)) {
            this.sendToUser(userId, notification);
            this.logger.debug(`Sent notification to online user ${userId}`);
            return true;
        } else {
            this.logger.debug(`User ${userId} is offline, notification queued`);
            return false;
        }
    }

}