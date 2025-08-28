// socket.service.ts
import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { Server } from 'socket.io';

@Injectable()
export class SocketService implements OnModuleDestroy {
  private readonly logger = new Logger(SocketService.name);
  private server: Server;

  // Quản lý theo namespace và userId
  private namespaceConnections: Map<string, Map<string, string[]>> = new Map();
  private socketInfo: Map<string, { userId: string; namespace: string }> = new Map();

  setServer(server: Server) {
    this.server = server;
  }

  registerConnection(namespace: string, socketId: string, userId: string) {
    if (!this.namespaceConnections.has(namespace)) {
      this.namespaceConnections.set(namespace, new Map());
    }

    const namespaceMap = this.namespaceConnections.get(namespace)!;

    if (!namespaceMap.has(userId)) {
      namespaceMap.set(userId, []);
    }

    namespaceMap.get(userId)!.push(socketId);
    this.socketInfo.set(socketId, { userId, namespace });

    this.logger.log(`🔗 Registered ${socketId} for user ${userId} in namespace ${namespace}`);
  }

  unregisterConnection(socketId: string) {
    const info = this.socketInfo.get(socketId);
    if (info) {
      const { userId, namespace } = info;
      const namespaceMap = this.namespaceConnections.get(namespace);

      if (namespaceMap) {
        const userSockets = namespaceMap.get(userId);
        if (userSockets) {
          const index = userSockets.indexOf(socketId);
          if (index > -1) {
            userSockets.splice(index, 1);
          }
          if (userSockets.length === 0) {
            namespaceMap.delete(userId);
          }
        }
      }

      this.socketInfo.delete(socketId);
      this.logger.log(`🔗 Unregistered ${socketId} for user ${userId} in namespace ${namespace}`);
    }
  }

  getUserIdBySocketId(socketId: string): string | undefined {
    return this.socketInfo.get(socketId)?.userId;
  }

  isUserOnline(userId: string, namespace?: string): boolean {
    if (namespace) {
      const namespaceMap = this.namespaceConnections.get(namespace);
      return !!(namespaceMap && namespaceMap.get(userId)?.length);
    }

    // Kiểm tra trên tất cả namespaces
    for (const namespaceMap of this.namespaceConnections.values()) {
      if (namespaceMap.get(userId)?.length) {
        return true;
      }
    }
    return false;
  }

  isUserOnlineInNamespace(userId: string, namespace: string): boolean {
    const namespaceMap = this.namespaceConnections.get(namespace);
    return !!(namespaceMap && namespaceMap.get(userId)?.length);
  }

  getSocketIdsByUserAndNamespace(userId: string, namespace: string): string[] {
    const namespaceMap = this.namespaceConnections.get(namespace);
    const socketIds = namespaceMap?.get(userId) || [];

    this.logger.debug(
      `[NotificationsGateway] Lookup namespace=${namespace}, userId=${userId} → socketIds=${JSON.stringify(socketIds)}`
    );

    return socketIds;
  }


  getSocketIdsByUserId(userId: string): string[] {
    const socketIds: string[] = [];

    for (const namespaceMap of this.namespaceConnections.values()) {
      const userSockets = namespaceMap.get(userId);
      if (userSockets) {
        socketIds.push(...userSockets);
      }
    }

    return socketIds;
  }

  // Gửi event đến user qua tất cả namespaces
  emitToUser(userId: string, event: string, data: any) {
    const socketIds = this.getSocketIdsByUserId(userId);
    if (socketIds.length > 0) {
      socketIds.forEach(socketId => {
        this.server.to(socketId).emit(event, data);
      });
    }
  }

  // Gửi event đến user trong namespace cụ thể
  emitToUserInNamespace(
    userId: string,
    namespace: string,
    event: string,
    data: any
  ) {
    const socketIds = this.getSocketIdsByUserAndNamespace(userId, namespace);

    this.logger.debug(
      `[NotificationsGateway] Emit event="${event}" to userId=${userId} in namespace=${namespace}, socketIds=${JSON.stringify(socketIds)}`
    );

    if (socketIds.length > 0) {
      socketIds.forEach(socketId => {
        this.logger.debug(
          `[NotificationsGateway] → Emitting to socketId=${socketId}, data=${JSON.stringify(data)}`
        );
        this.server.to(socketId).emit(event, data);
      });
    } else {
      this.logger.warn(
        `[NotificationsGateway] No sockets found for userId=${userId} in namespace=${namespace}`
      );
    }
  }

  getOnlineUsersInNamespace(namespace: string): string[] {
    const namespaceMap = this.namespaceConnections.get(namespace);
    if (!namespaceMap) return [];

    const onlineUsers: string[] = [];
    for (const [userId, sockets] of namespaceMap.entries()) {
      if (sockets.length > 0) {
        onlineUsers.push(userId);
      }
    }
    return onlineUsers;
  }

  emitToRoomInNamespace(namespace: string, room: string, event: string, data: any) {
    const namespaceInstance = this.server.of(namespace);
    if (namespaceInstance) {
      namespaceInstance.to(room).emit(event, data);
    }
  }


  onModuleDestroy() {
    this.namespaceConnections.clear();
    this.socketInfo.clear();
  }
}