import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { SocketService } from '../socket.service';
import { MessageResponseDto } from '@/modules/messages/dtos/message-response.dto';

@WebSocketGateway({
    cors: {
        origin: process.env.FRONTEND_URL || '*',
    },
    namespace: '/messages',
})
export class MessagesGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private readonly logger = new Logger(MessagesGateway.name);

    constructor(private readonly socketService: SocketService) { }

    afterInit(server: Server) {
        this.socketService.setServer(server);
        this.logger.log('MessagesGateway initialized');
    }

    async handleConnection(client: Socket) {
        try {
            const { userId } = client.handshake.auth;

            if (!userId) {
                this.logger.warn(`Messages connection rejected: No userId`);
                client.disconnect();
                return;
            }

            // Đăng ký kết nối với namespace messages
            this.socketService.registerConnection('/messages', client.id, userId);

            // Join user room trong messages namespace
            client.join(`user_${userId}`);

            this.logger.log(`User ${userId} connected to messages (socket: ${client.id})`);

        } catch (error) {
            this.logger.error(`Messages connection error: ${error.message}`);
            client.disconnect();
        }
    }

    handleDisconnect(client: Socket) {
        this.socketService.unregisterConnection(client.id);
        const userId = this.socketService.getUserIdBySocketId(client.id);
        if (userId) {
            this.logger.log(`User ${userId} disconnected from messages (socket: ${client.id})`);
        }
    }

    @SubscribeMessage('join_conversation')
    handleJoinConversation(
        @ConnectedSocket() client: Socket,
        @MessageBody() conversationId: string
    ) {
        const userId = this.socketService.getUserIdBySocketId(client.id);
        if (userId) {
            client.join(`conversation_${conversationId}`);
            this.logger.log(`User ${userId} joined conversation ${conversationId}`);
        }
    }

    @SubscribeMessage('leave_conversation')
    handleLeaveConversation(
        @ConnectedSocket() client: Socket,
        @MessageBody() conversationId: string
    ) {
        client.leave(`conversation_${conversationId}`);
        this.logger.log(`Client left conversation ${conversationId}`);
    }

    @SubscribeMessage('typing')
    handleTyping(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { conversationId: string, isTyping: boolean }
    ) {
        const userId = this.socketService.getUserIdBySocketId(client.id);
        if (userId) {
            this.server.to(`conversation_${data.conversationId}`).emit('user_typing', {
                userId,
                isTyping: data.isTyping
            });
        }
    }

    // Gửi message đến conversation
    sendToConversation(conversationId: string, message: any) {
        this.server.to(`conversation_${conversationId}`).emit('new_message', message);
        this.logger.debug(` Sent message to conversation ${conversationId}`);
    }

    // Gửi message đến user cụ thể trong namespace messages
    sendToUser(userId: string, message: MessageResponseDto) {
        this.socketService.emitToUserInNamespace(userId, '/messages', 'new_message', message);
        this.logger.debug(`Sent message to user ${userId} in messages namespace`);
    }

    // Gửi message đến nhiều users
    sendToUsers(userIds: string[], message: any) {
        userIds.forEach(userId => {
            this.sendToUser(userId, message);
        });
    }

    // Kiểm tra user có online trong messages namespace không
    isUserOnline(userId: string): boolean {
        return this.socketService.isUserOnlineInNamespace(userId, '/messages');
    }
}