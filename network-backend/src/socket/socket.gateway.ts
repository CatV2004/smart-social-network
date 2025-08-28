// socket.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { SocketService } from './socket.service';
import { NotificationDto } from '@/modules/notifications/dtos/notification.dto';
import { MessageResponseDto } from '@/modules/messages/dtos/message-response.dto';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || '*',
  },
})
export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(SocketGateway.name);

  constructor(private readonly socketService: SocketService) { }

  afterInit(server: Server) {
    this.socketService.setServer(server);
    this.logger.log('SocketGateway initialized');
  }

  async handleConnection(client: Socket) {
    try {
      const { userId } = client.handshake.auth;

      this.logger.debug(
        `[NotificationsGateway] Client connected: socketId=${client.id}, userId=${userId}, namespace=${client.nsp.name}`
      );

      if (!userId) {
        this.logger.warn(`Connection rejected: No userId provided`);
        client.disconnect();
        return;
      }

      this.socketService.registerConnection('/', client.id, userId);
      // join user room 
      client.join(`user_${userId}`);

      // join notification room
      client.join(`notifications_${userId}`);

      this.logger.log(`User ${userId} connected to main namespace (socket: ${client.id})`);
    } catch (error) {
      this.logger.error(`Connection error: ${error.message}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.socketService.unregisterConnection(client.id);
    this.logger.log(`Socket disconnected: ${client.id}`);
  }

  //region Messages Events
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
    const userId = this.socketService.getUserIdBySocketId(client.id);
    client.leave(`conversation_${conversationId}`);
    this.logger.log(`User ${userId} left conversation ${conversationId}`);
  }

  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string, isTyping: boolean }
  ) {
    const userId = this.socketService.getUserIdBySocketId(client.id);
    if (userId) {
      // Gửi đến tất cả clients trong conversation (trừ người gửi)
      client.to(`conversation_${data.conversationId}`).emit('user_typing', {
        userId,
        isTyping: data.isTyping
      });
      this.logger.debug(`User ${userId} ${data.isTyping ? 'started' : 'stopped'} typing in conversation ${data.conversationId}`);
    }
  }
  //endregion

  //region Notifications Events
  @SubscribeMessage('join_notifications')
  handleJoinNotifications(@ConnectedSocket() client: Socket) {
    const userId = this.socketService.getUserIdBySocketId(client.id);
    if (userId) {
      client.join(`notifications_${userId}`);
      this.logger.log(`User ${userId} joined notifications room`);
    }
  }

  @SubscribeMessage('leave_notifications')
  handleLeaveNotifications(@ConnectedSocket() client: Socket) {
    const userId = this.socketService.getUserIdBySocketId(client.id);
    if (userId) {
      client.leave(`notifications_${userId}`);
      this.logger.log(`User ${userId} left notifications room`);
    }
  }
  //endregion


  //region Utility Methods
  // Gửi message đến conversation
  sendToConversation(conversationId: string, message: MessageResponseDto) {
    this.server.to(`conversation_${conversationId}`).emit('new_message', message);
    this.logger.debug(`Sent message to conversation ${conversationId}`);
  }

  // Gửi message đến user cụ thể
  sendToUser(userId: string, message: MessageResponseDto) {
    this.server.to(`user_${userId}`).emit('new_message', message);
    this.logger.debug(`Sent message to user ${userId}`);
  }

  // Gửi notification đến user
  sendNotificationToUser(userId: string, notification: NotificationDto) {
    const isOnline = this.socketService.isUserOnlineInNamespace(userId, '/');
    if (isOnline) {
      this.server.to(`notifications_${userId}`).emit('new_notification', notification);
      this.logger.debug(`Sent notification to online user ${userId}`);
      return true;
    } else {
      this.logger.debug(`User ${userId} is offline, notification queued`);
      return false;
    }
  }

  // Gửi multiple notifications
  sendMultipleNotificationsToUser(userId: string, notifications: NotificationDto[]) {
    const isOnline = this.socketService.isUserOnlineInNamespace(userId, '/');
    if (isOnline && notifications.length > 0) {
      this.server.to(`notifications_${userId}`).emit('new_notifications_batch', notifications);
      this.logger.debug(`Sent ${notifications.length} notifications to user ${userId}`);
      return true;
    }
    return false;
  }

  // Gửi notification đến nhiều users
  sendNotificationToUsers(userIds: string[], notification: NotificationDto) {
    userIds.forEach(userId => {
      this.sendNotificationToUser(userId, notification);
    });
  }

  // Kiểm tra user online
  isUserOnline(userId: string): boolean {
    return this.socketService.isUserOnlineInNamespace(userId, '/');
  }

  // Kiểm tra user online trong conversation
  isUserOnlineInConversation(userId: string, conversationId: string): boolean {
    const socketIds = this.socketService.getSocketIdsByUserAndNamespace(userId, '/');
    if (socketIds.length === 0) return false;

    for (const socketId of socketIds) {
      const rooms = this.socketService.getRoomsBySocketId(socketId, '/');
      if (rooms.includes(conversationId)) {
        return true;
      }
    }
    return false;
  }
  //endregion

}