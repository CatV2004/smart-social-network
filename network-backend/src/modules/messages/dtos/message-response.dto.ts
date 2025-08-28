import { ApiProperty } from "@nestjs/swagger";
import { MessageStatus } from "../entities/message.entity";
import { MessageAttachmentResponseDto } from "./message-attachment-response.dto";
import { ProfilePublicMsgDto } from "@/modules/profiles/dtos/profile-public-msg.dto";

export class MessageReadDto {
    @ApiProperty()
    userId: string;

    @ApiProperty()
    avatar: String;

    @ApiProperty()
    readAt: Date;
}

export class MessageResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty({ description: 'Message content', nullable: true })
    content?: string;

    @ApiProperty({ enum: MessageStatus })
    status: MessageStatus;
    
    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty({ description: 'Sender info' })
    sender: ProfilePublicMsgDto

    @ApiProperty({ type: [MessageAttachmentResponseDto] })
    attachments: MessageAttachmentResponseDto[];
}