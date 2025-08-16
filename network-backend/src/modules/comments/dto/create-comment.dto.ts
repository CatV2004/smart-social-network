import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateCommentDto {
    @ApiProperty({
        description: 'The content of the comment',
        example: 'This workout is amazing!',
    })
    @IsNotEmpty()
    content: string;

    @ApiProperty({
        description: 'The ID of the post this comment belongs to',
        example: 'a1d2e3f4-5678-90ab-cdef-1234567890ab',
    })
    @IsUUID()
    postId: string;

    @ApiPropertyOptional({
        description: 'The ID of the parent comment if this is a reply',
        example: 'f8d5a1d6-5c7f-4e9e-9b57-8c7a6d9f7e12',
    })
    @IsOptional()
    @IsUUID()
    parentCommentId?: string;

    @ApiPropertyOptional({
        description: 'ID của profile đang được reply',
        example: 'p9c5d7a2-4b7c-9e6a-8c7a6d9f7e12',
    })
    @IsOptional()
    @IsUUID()
    replyToId?: string;
}
