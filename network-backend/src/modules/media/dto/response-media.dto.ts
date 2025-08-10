import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { MediaType } from '../types/media.types';

export class MediaResponseDto {
    @ApiProperty()
    @Expose()
    id: string;

    @ApiProperty({ enum: MediaType })
    @Expose()
    type: MediaType;

    @ApiProperty()
    @Expose()
    url: string;

    @ApiProperty({ required: false })
    @Expose()
    thumbnail?: string;

    @ApiProperty({ required: false })
    @Expose()
    duration?: number;

    @ApiProperty({ required: false })
    @Expose()
    width?: number;

    @ApiProperty({ required: false })
    @Expose()
    height?: number;

    @ApiProperty()
    @Expose()
    createdAt: Date;

    @ApiProperty()
    @Expose()
    updatedAt: Date;
}
