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
    this.logger.log('🚀 SocketGateway initialized');
  }

  async handleConnection(client: Socket) {
    try {
      const { userId } = client.handshake.auth;

      if (!userId) {
        this.logger.warn(`Connection rejected: No userId provided`);
        client.disconnect();
        return;
      }

      this.socketService.registerConnection(client.id, userId);

      client.join(`user_${userId}`);

      this.logger.log(`✅ User ${userId} connected (socket: ${client.id})`);

    } catch (error) {
      this.logger.error(`Connection error: ${error.message}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = this.socketService.getUserIdBySocketId(client.id);
    if (userId) {
      this.logger.log(`❌ User ${userId} disconnected (socket: ${client.id})`);
      this.socketService.unregisterConnection(client.id, userId);
    }
  }
}