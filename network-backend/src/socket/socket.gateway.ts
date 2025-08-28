// socket.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { SocketService } from './socket.service';

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

      // Đăng ký kết nối với namespace mặc định ("/")
      this.socketService.registerConnection('/', client.id, userId);
      client.join(`user_${userId}`);

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
}