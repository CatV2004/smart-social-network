import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PostPreviewDto } from '@/modules/posts/dtos/post-preview.dto';
import { CommentPreviewDto } from '@/modules/comments/dtos/comment-preview.dto';

export class SenderUserDto {
    @ApiProperty()
    @Expose() id: string;

    @ApiProperty()
    @Expose() firstName: string;

    @ApiProperty()
    @Expose() lastName: string;

    @ApiProperty()
    @Expose() username: string;
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

    @ApiProperty({ required: false, type: Object, description: 'Additional metadata' })
    @Expose()
    metadata?: Record<string, any>;

    @ApiProperty({ required: false, type: () => PostPreviewDto })
    @Expose()
    @Type(() => PostPreviewDto)
    post?: PostPreviewDto;

    @ApiProperty({ required: false, type: () => CommentPreviewDto })
    @Expose()
    @Type(() => CommentPreviewDto)
    comment?: CommentPreviewDto;
}
