import { ApiProperty } from "@nestjs/swagger";
import { MessageStatus } from "../entities/message.entity";
import { MessageAttachmentResponseDto } from "./message-attachment-response.dto";
import { ProfilePublicMsgDto } from "@/modules/profiles/dtos/profile-public-msg.dto";
import { Expose } from "class-transformer";

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
    @Expose()
    id: string;

    @ApiProperty({ description: 'Message content', nullable: true })
    @Expose()
    content?: string;

    @ApiProperty({ enum: MessageStatus })
    @Expose()
    status: MessageStatus;

    @ApiProperty()
    @Expose()
    createdAt: Date;

    @ApiProperty()
    @Expose()
    updatedAt: Date;

    @ApiProperty({ description: 'Sender info' })
    @Expose()
    sender: ProfilePublicMsgDto

    @ApiProperty({ type: [MessageAttachmentResponseDto] })
    @Expose()
    attachments: MessageAttachmentResponseDto[];

    @ApiProperty({ description: "conversationId" })
    @Expose()
    conversationId: string;
}