import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class SenderUserDto {
    @ApiProperty()
    @Expose() id: string;

    @ApiProperty()
    @Expose() firstName: string;

    @ApiProperty()
    @Expose() lastName: string;
}

export class SenderDto {
    @ApiProperty()
    @Expose() id: string;

    @ApiProperty({ type: () => SenderUserDto })
    @Expose()
    @Type(() => SenderUserDto)
    user: SenderUserDto;

    @ApiProperty({ required: false })
    @Expose() avatar?: string;
}

export class NotificationDto {
    @ApiProperty()
    @Expose() id: string;

    @ApiProperty()
    @Expose() type: string;

    @ApiProperty()
    @Expose() isRead: boolean;

    @ApiProperty()
    @Expose() createdAt: Date;

    @ApiProperty({ type: () => SenderDto })
    @Expose()
    @Type(() => SenderDto)
    sender: SenderDto;
}
