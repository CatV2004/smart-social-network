import { Module } from '@nestjs/common';
import { SocketGateway } from '@/socket/socket.gateway';
import { SocketService } from '@/socket/socket.service';
import { MessageRealtimeService } from './messages/message-realtime.service';
import { NotificationRealtimeService } from './notifications/notification-realtime.service';

@Module({
  providers: [
    SocketGateway,
    SocketService,
    MessageRealtimeService,
    NotificationRealtimeService,
  ],
  exports: [
    SocketService,
    MessageRealtimeService,
    NotificationRealtimeService,
  ],
})
export class SocketModule { }
