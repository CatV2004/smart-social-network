import { ApiProperty } from '@nestjs/swagger';

export class SendMessageDto {
    @ApiProperty({ description: 'Conversation ID' })
    conversationId: string;

    @ApiProperty({ description: 'Message content', required: false })
    content?: string;
}
