import { IsBoolean, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateNotificationDto {
    @ApiPropertyOptional({ description: 'Đánh dấu đã đọc hay chưa' })
    @IsOptional()
    @IsBoolean()
    isRead?: boolean;

    @ApiPropertyOptional({ description: 'Metadata bổ sung dạng JSON' })
    @IsOptional()
    metadata?: Record<string, any>;
}
