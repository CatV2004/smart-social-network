import { plainToInstance } from 'class-transformer';
import { Conversation } from '../entities/conversation.entity';
import { ConversationResponseDto, MessageSummaryDto } from '../dtos/conversation-response.dto';
import { Message } from '../entities/message.entity';

export class ConversationMapper {
    static async toResponseDto(
        convo: Conversation,
        currentUserId: string,
        unreadCount?: number,
        lastMessage?: Message
    ): Promise<ConversationResponseDto> {
        const dto = plainToInstance(ConversationResponseDto, convo, {
            excludeExtraneousValues: true,
        });


        const currentMember = convo.members?.find(m => m.user.id === currentUserId);
        dto.isPinned = currentMember?.isPinned ?? false;

        dto.unreadCount = unreadCount ?? 0;

        if (convo.isGroup) {
            dto.displayName = convo.name;
            dto.displayAvatar = convo.avatar;
            dto.memberCount = convo.members?.length ?? 0;
        } else {
            const opponent = convo.members?.find(m => m.user.id !== currentUserId)?.user;
            dto.displayName = opponent ? `${opponent.firstName} ${opponent.lastName}` : undefined;
            dto.displayAvatar = opponent?.profile.avatar;
            dto.targetUserId = opponent?.id;
        }

        if (lastMessage) {
            dto.lastMessage = plainToInstance(MessageSummaryDto, {
                id: lastMessage.id,
                content: lastMessage.content,
                createdAt: lastMessage.createdAt,
                senderId: lastMessage.sender.id,
                senderFullName: `${lastMessage.sender.firstName} ${lastMessage.sender.lastName}`,
                attachments: lastMessage.attachments?.map(att => ({
                    type: att.type,
                })) ?? [],
            });
        }

        return dto;
    }
}
