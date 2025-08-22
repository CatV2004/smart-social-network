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
        this.logger.log('🚀 MessagesGateway initialized');
    }

    async handleConnection(client: Socket) {
        try {
            const { userId } = client.handshake.auth;

            if (!userId) {
                this.logger.warn(`Messages connection rejected: No userId`);
                client.disconnect();
                return;
            }

            // Join user room trong messages namespace
            client.join(`user_${userId}`);

            this.logger.log(`✅ User ${userId} connected to messages (socket: ${client.id})`);

        } catch (error) {
            this.logger.error(`Messages connection error: ${error.message}`);
            client.disconnect();
        }
    }

    handleDisconnect(client: Socket) {
        const userId = this.socketService.getUserIdBySocketId(client.id);
        if (userId) {
            this.logger.log(`❌ User ${userId} disconnected from messages (socket: ${client.id})`);
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
        this.logger.debug(`📩 Sent message to conversation ${conversationId}`);
    }

    // Gửi message đến user
    sendToUser(userId: string, message: any) {
        this.server.to(`user_${userId}`).emit('new_message', message);
        this.logger.debug(`📩 Sent message to user ${userId}`);
    }
}