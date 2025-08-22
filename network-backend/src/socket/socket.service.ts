import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { Server } from 'socket.io';

@Injectable()
export class SocketService implements OnModuleDestroy {
  private readonly logger = new Logger(SocketService.name)
  private server: Server;
  private userSockets: Map<string, string[]> = new Map();
  private socketUsers: Map<string, string> = new Map();

  setServer(server: Server) {
    this.server = server;
  }

  registerConnection(socketId: string, userId: string) {
    if (!this.userSockets.has(userId)) {
      this.userSockets.set(userId, []);
    }
    this.userSockets.get(userId)!.push(socketId);
    this.socketUsers.set(socketId, userId);
    this.logger.log(`🔗 Registered ${socketId} for user ${userId}`);
  }

  unregisterConnection(socketId: string, userId: string) {
    const userSockets = this.userSockets.get(userId);
    if (userSockets) {
      const index = userSockets.indexOf(socketId);
      if (index > -1) {
        userSockets.splice(index, 1);
      }
      if (userSockets.length === 0) {
        this.userSockets.delete(userId);
      }
    }
    this.socketUsers.delete(socketId);
  }

  getUserIdBySocketId(socketId: string): string | undefined {
    return this.socketUsers.get(socketId);
  }

  getSocketIdsByUserId(userId: string): string[] {
    return this.userSockets.get(userId) || [];
  }

  isUserOnline(userId: string): boolean {
    const sockets = this.userSockets.get(userId);
    const kq = !!sockets && sockets.length > 0;
    this.logger.log(`${userId} is online: `, kq)
    return kq;
  }

  getUserSocketIds(userId: string): string[] {
    return this.userSockets.get(userId) || [];
  }

  // Chỉ giữ lại method emit chung, không xử lý namespace cụ thể
  emitToUser(userId: string, event: string, data: any) {
    const socketIds = this.getSocketIdsByUserId(userId);
    if (socketIds.length > 0) {
      this.server.emit(event, data); // Gửi đến tất cả clients
    }
  }

  onModuleDestroy() {
    this.userSockets.clear();
    this.socketUsers.clear();
  }
}