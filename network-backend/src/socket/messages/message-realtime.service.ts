import { Injectable, Logger } from '@nestjs/common';
import { MessageResponseDto } from '../../modules/messages/dtos/message-response.dto';
import { SocketGateway } from '@/socket/socket.gateway';

@Injectable()
export class MessageRealtimeService {
    private readonly logger = new Logger(MessageRealtimeService.name);

    constructor(
        private readonly socketGateway: SocketGateway
    ) { }

    async sendNewMessage(conversationId: string, message: MessageResponseDto, recipientIds: string[]) {
        try {
            // this.socketGateway.sendToConversation(conversationId, message);
            
            recipientIds.forEach(userId => {
                this.socketGateway.sendToUser(userId, message);
            });
            this.logger.log(`Sent message to conversation ${conversationId} and ${recipientIds.length} users`);
        } catch (error) {
            this.logger.error(`Failed to send realtime message: ${error.message}`);
        }
    }

    // async sendTypingIndicator(conversationId: string, userId: string, isTyping: boolean) {
    //     this.socketGateway.sendToConversation(conversationId, {
    //         type: 'typing',
    //         userId,
    //         isTyping,
    //         timestamp: new Date()
    //     });
    // }

    // Kiểm tra user online status
    isUserOnline(userId: string): boolean {
        return this.socketGateway.isUserOnline(userId);
    }
}