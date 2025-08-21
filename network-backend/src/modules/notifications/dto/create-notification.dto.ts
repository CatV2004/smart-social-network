import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NotificationType } from '../types/notification.type';

export class CreateNotificationDto {
    @ApiProperty({ description: 'ID của người gửi' })
    @IsString()
    senderId: string;

    @ApiProperty({ description: 'ID của người nhận' })
    @IsString()
    receiverId: string;

    @ApiProperty({ enum: NotificationType, description: 'Loại thông báo' })
    @IsEnum(NotificationType)
    type: NotificationType;

    @ApiPropertyOptional({ description: 'ID bài post liên quan (nếu có)' })
    @IsOptional()
    @IsString()
    postId?: string;

    @ApiPropertyOptional({ description: 'ID comment liên quan (nếu có)' })
    @IsOptional()
    @IsString()
    commentId?: string;

    @ApiPropertyOptional({ description: 'Metadata bổ sung dạng JSON' })
    @IsOptional()
    metadata?: Record<string, any>;
}
