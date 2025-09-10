import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { MediaResponseDto } from '@/modules/media/dtos/response-media.dto';
import { ProfilePublicDto } from '@/modules/profiles/dtos/profile-public.dto';
import { PostStatus } from '../entities/post.entity';

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

    @ApiProperty({ description: 'Is reacted post?' })
    @Expose()
    isReacted: boolean;

    @ApiProperty({ description: 'Is saved post?' })
    @Expose()
    isSaved: boolean;

    @ApiProperty({ description: 'Total likes' })
    @Expose()
    likesCount: number;

    @ApiProperty({ description: 'Total comments' })
    @Expose()
    commentsCount: number;

    @ApiProperty()
    @Expose()
    status: PostStatus;

    @ApiProperty()
    @Expose()
    createdAt: Date;

    @ApiProperty()
    @Expose()
    updatedAt: Date;

    @ApiProperty()
    @Expose()
    deletedAt: Date | null;
}
