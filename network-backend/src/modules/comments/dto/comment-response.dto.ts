import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { ProfilePublicDto } from '@/modules/profiles/dto/profile-public.dto';

export class CommentResponseDto {
    @ApiProperty({ example: 'uuid-comment-id' })
    @Expose()
    id: string;

    @ApiProperty({ example: 'This workout is amazing!' })
    @Expose()
    content: string;

    @ApiProperty({ example: 2 })
    @Expose()
    repliesCount: number;

    @ApiProperty({ example: false })
    @Expose()
    isEdited: boolean;

    @ApiProperty({ example: false })
    @Expose()
    isPinned: boolean;

    @ApiProperty({ type: () => ProfilePublicDto })
    @Expose()
    @Type(() => ProfilePublicDto)
    author: ProfilePublicDto;

    @ApiPropertyOptional({ type: () => ProfilePublicDto })
    @Expose()
    @Type(() => ProfilePublicDto)
    replyTo?: ProfilePublicDto;

    @ApiPropertyOptional({ description: 'Parent comment ID nếu là reply' })
    @Expose()
    parentId: string | null;

    @ApiProperty()
    @Expose()
    createdAt: Date;

    @ApiProperty()
    @Expose()
    updatedAt: Date;
}
