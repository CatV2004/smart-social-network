import { Message } from '../entities/message.entity';
import { MessageResponseDto } from '../dtos/message-response.dto';
import { MessageAttachmentResponseDto } from '../dtos/message-attachment-response.dto';
import { UserPublicDto } from '@/modules/users/dtos/user-public.dto';
import { ProfilePublicMsgDto } from '@/modules/profiles/dtos/profile-public-msg.dto';

export class MessageMapper {
    static toResponseDto(message: Message): MessageResponseDto {
        const user = message.sender;

        const senderProfile: ProfilePublicMsgDto = {
            id: user.profile?.id ?? '',
            avatar: user.profile?.avatar ?? undefined,
            bio: user.profile?.bio ?? '',
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
            } as UserPublicDto,
        };

        return {
            id: message.id,
            content: message.content,
            status: message.status,
            createdAt: message.createdAt,
            updatedAt: message.updatedAt,
            sender: senderProfile,
            attachments:
                message.attachments?.map(
                    (a) =>
                    ({
                        url: a.url,
                        type: a.type,
                        publicId: a.publicId,
                    } as MessageAttachmentResponseDto),
                ) ?? [],
        };
    }

    static toResponseDtoList(messages: Message[]): MessageResponseDto[] {
        return messages.map((m) => this.toResponseDto(m));
    }
}
