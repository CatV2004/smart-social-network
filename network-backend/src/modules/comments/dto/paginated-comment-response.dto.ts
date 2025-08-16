import { ApiProperty } from '@nestjs/swagger';
import { CommentResponseDto } from './comment-response.dto';
import { PaginationMetaDto } from '@/common/dtos/pagination-meta.dto';

export class PaginatedCommentResponseDto {
    @ApiProperty({ type: [CommentResponseDto] })
    data: CommentResponseDto[];

    @ApiProperty({ type: PaginationMetaDto })
    meta: PaginationMetaDto;
}
