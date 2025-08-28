import { ApiProperty } from '@nestjs/swagger';
import { NotificationDto } from './notification.dto';
import { PaginationMetaDto } from '@/common/dtos/pagination-meta.dto';

export class PaginatedNotificationDto {
    @ApiProperty({ type: [NotificationDto] })
    data: NotificationDto[];

    @ApiProperty({ type: PaginationMetaDto })
    meta: PaginationMetaDto;
}
