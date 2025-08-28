import { MessagesGateway } from '@/socket/messages/messages.gateway';
import { Injectable, Logger } from '@nestjs/common';
import { MessageResponseDto } from '../dtos/message-response.dto';

@Injectable()
export class MessageRealtimeService {
    private readonly logger = new Logger(MessageRealtimeService.name);

    constructor(
        private readonly messagesGateway: MessagesGateway,
    ) { }

    async sendNewMessage(conversationId: string, message: MessageResponseDto, recipientIds: string[]) {
        try {
            this.messagesGateway.sendToConversation(conversationId, message);

            recipientIds.forEach(userId => {
                this.messagesGateway.sendToUser(userId, message);
            });
            this.logger.log(`Sent message to conversation ${conversationId} and ${recipientIds.length} users`);
        } catch (error) {
            this.logger.error(`Failed to send realtime message: ${error.message}`);
        }
    }

    // Gửi thông báo typing
    async sendTypingIndicator(conversationId: string, userId: string, isTyping: boolean) {
        this.messagesGateway.sendToConversation(conversationId, {
            type: 'typing',
            userId,
            isTyping,
            timestamp: new Date()
        });
    }

    // Kiểm tra user online status
    isUserOnlineForMessages(userId: string): boolean {
        return this.messagesGateway.isUserOnline(userId);
    }

    // Lấy danh sách user online trong conversation
    getOnlineUsersInConversation(conversationId: string, memberIds: string[]): string[] {
        return memberIds.filter(userId => this.isUserOnlineForMessages(userId));
    }
}