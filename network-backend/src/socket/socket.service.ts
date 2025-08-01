import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';

@Injectable()
export class SocketService {
  private server: Server;

  setServer(server: Server) {
    this.server = server;
  }

  sendMessageToUser(userId: string, message: string) {
    this.server.to(userId).emit('receiveMessage', message);
  }

  sendNotification(userId: string, notification: string) {
    this.server.to(userId).emit('notification', notification);
  }
}
