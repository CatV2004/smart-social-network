// notifications/notification.gateway.ts
import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Notification } from './entities/notification.entity';

@WebSocketGateway({
    cors: {
        origin: '*', // nên config cụ thể domain FE
    },
})
export class NotificationsGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private connectedUsers = new Map<string, string>(); // socketId -> userId

    afterInit(server: Server) {
        console.log('🚀 NotificationGateway initialized');
    }

    handleConnection(client: Socket) {
        const userId = client.handshake.query.userId as string;
        if (userId) {
            this.connectedUsers.set(client.id, userId);
            console.log(`✅ User ${userId} connected`);
        }
    }

    handleDisconnect(client: Socket) {
        const userId = this.connectedUsers.get(client.id);
        if (userId) {
            console.log(`❌ User ${userId} disconnected`);
            this.connectedUsers.delete(client.id);
        }
    }

    /**
     * Gửi noti realtime đến userId
     */
    sendNotificationToUser(userId: string, notification: Notification) {
        // tìm tất cả socketId có userId này
        for (const [socketId, uid] of this.connectedUsers.entries()) {
            if (uid === userId) {
                this.server.to(socketId).emit('notification', notification);
            }
        }
    }
}
