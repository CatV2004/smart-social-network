import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { SocketService } from '@/socket/socket.service'; 

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private logger: Logger = new Logger('SocketGateway');

  constructor(private readonly socketService: SocketService) {}

  afterInit(server: Server) {
    this.logger.log('WebSocket Initialized');
    this.socketService.setServer(server);
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('sendMessage')
  handleMessage(
    @MessageBody() payload: { toUserId: string; content: string },
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.log(`Message from ${client.id}: ${JSON.stringify(payload)}`);
    this.socketService.sendMessageToUser(payload.toUserId, payload.content);
  }
}
