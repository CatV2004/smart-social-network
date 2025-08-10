import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { MediaResponseDto } from '@/modules/media/dto/response-media.dto';
import { ProfilePublicDto } from '@/modules/profiles/dto/profile-public.dto';

export class PostResponseDto {
    @ApiProperty()
    @Expose()
    id: string;

    @ApiProperty({ nullable: true })
    @Expose()
    content?: string;

    @ApiProperty({ type: ProfilePublicDto })
    @Expose()
    @Type(() => ProfilePublicDto)
    author: ProfilePublicDto;

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

    @ApiProperty()
    @Expose()
    createdAt: Date;

    @ApiProperty()
    @Expose()
    updatedAt: Date;
}
