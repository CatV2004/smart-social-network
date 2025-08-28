import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { MediaResponseDto } from '@/modules/media/dtos/response-media.dto';

export class PostEditResponseDto {
    @ApiProperty()
    @Expose()
    id: string;

    @ApiProperty({ nullable: true })
    @Expose()
    content?: string;

    @ApiProperty({ type: [MediaResponseDto] })
    @Expose()
    @Type(() => MediaResponseDto)
    media: MediaResponseDto[];

    @ApiProperty()
    @Expose()
    isEdited: boolean;

    @ApiProperty()
    @Expose()
    isPinned: boolean;
}
