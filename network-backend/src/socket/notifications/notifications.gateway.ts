import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

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
    private userConnections: Map<string, string[]> = new Map(); // userId -> socketIds

    afterInit(server: Server) {
        this.logger.log('🚀 NotificationsGateway initialized');
    }

    async handleConnection(client: Socket) {
        try {
            const { userId } = client.handshake.auth;

            if (!userId) {
                this.logger.warn(`Notifications connection rejected: No userId`);
                client.disconnect();
                return;
            }

            // Register connection
            if (!this.userConnections.has(userId)) {
                this.userConnections.set(userId, []);
            }

            this.userConnections.get(userId)!.push(client.id);

            // Join user room
            client.join(`user_${userId}`);

            this.logger.log(`✅ User ${userId} connected to notifications (socket: ${client.id})`);

        } catch (error) {
            this.logger.error(`Notifications connection error: ${error.message}`);
            client.disconnect();
        }
    }

    handleDisconnect(client: Socket) {
        // Find and remove connection
        for (const [userId, socketIds] of this.userConnections.entries()) {
            const index = socketIds.indexOf(client.id);
            if (index > -1) {
                socketIds.splice(index, 1);
                if (socketIds.length === 0) {
                    this.userConnections.delete(userId);
                }
                this.logger.log(`❌ User ${userId} disconnected from notifications (socket: ${client.id})`);
                break;
            }
        }
    }

    isUserOnline(userId: string): boolean {
        return (this.userConnections.get(userId)?.length ?? 0) > 0;
    }

    sendToUser(userId: string, notification: any) {
        this.server.to(`user_${userId}`).emit('new_notification', notification);
        this.logger.debug(`📩 Sent notification to user ${userId}`);
    }

    sendToUsers(userIds: string[], notification: any) {
        userIds.forEach(userId => {
            this.sendToUser(userId, notification);
        });
    }

    sendNotificationToUser(userId: string, notification: any) {
        if (this.isUserOnline(userId)) {
            this.server.to(`user_${userId}`).emit('new_notification', notification);
            this.logger.debug(`📩 Sent notification to online user ${userId}`);
            return true;
        } else {
            this.logger.debug(`User ${userId} is offline, notification queued`);
            return false;
        }
    }
}