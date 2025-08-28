import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { AttachmentType } from '../types/attachment.type';

export class MessageAttachmentSummaryDto {
    @ApiProperty({ enum: AttachmentType, example: AttachmentType.IMAGE })
    @Expose()
    type: AttachmentType;
}
export class MessageSummaryDto {
    @ApiProperty()
    @Expose()
    id: string;

    @ApiProperty()
    @Expose()
    content: string;

    @ApiProperty()
    @Expose()
    createdAt: Date;

    @ApiProperty()
    @Expose()
    senderId: string;

    @ApiProperty()
    @Expose()
    senderFullName: string;

    @ApiProperty({ type: [MessageAttachmentSummaryDto] })
    @Expose()
    @Type(() => MessageAttachmentSummaryDto)
    attachments: MessageAttachmentSummaryDto[];
}
export class ConversationResponseDto {
    @ApiProperty()
    @Expose()
    id: string;

    @ApiProperty({ description: 'Is this a group conversation?', example: false })
    @Expose()
    isGroup: boolean;

    @ApiProperty()
    @Expose()
    createdAt: Date;

    @ApiProperty()
    @Expose()
    updatedAt: Date;

    @ApiProperty({ description: 'Display name for UI (opponent in 1-1)' })
    @Expose()
    displayName?: string;

    @ApiProperty({ description: 'Display avatar for UI (opponent in 1-1)' })
    @Expose()
    displayAvatar?: string;

    @ApiProperty({ description: 'Number of unread messages for the current user', example: 3 })
    @Expose()
    unreadCount: number;

    @ApiProperty({ description: 'Number of member in group', example: 3 })
    @Expose()
    memberCount?: number;

    @ApiProperty({ description: 'Is this conversation pinned to top?', example: false })
    @Expose()
    isPinned: boolean;

    @ApiProperty({ description: 'The last message in this conversation', type: MessageSummaryDto, required: false })
    @Expose()
    @Type(() => MessageSummaryDto)
    lastMessage?: MessageSummaryDto;
}
