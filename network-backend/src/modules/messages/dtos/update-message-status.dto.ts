import { ApiProperty } from '@nestjs/swagger';
import { MessageStatus } from '../entities/message.entity';
export class UpdateMessageStatusDto {
    @ApiProperty({ enum: MessageStatus })
    status: MessageStatus;
}