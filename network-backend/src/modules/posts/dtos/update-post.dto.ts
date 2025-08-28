import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class MediaUpdateDto {
    @ApiProperty({ description: 'ID của media muốn thay thế' })
    @IsString()
    mediaId: string;
}

export class UpdatePostDto {
    @ApiPropertyOptional({ description: 'Nội dung bài post' })
    @IsOptional()
    @IsString()
    content?: string;

    @ApiPropertyOptional({ type: [String], description: 'Danh sách mediaId muốn xoá' })
    @IsOptional()
    @IsArray()
    mediaToDelete?: string[];

    @ApiPropertyOptional({ type: [MediaUpdateDto], description: 'Danh sách media muốn update' })
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => MediaUpdateDto)
    mediaToUpdate?: MediaUpdateDto[];

    @ApiPropertyOptional({ description: 'Ghim bài viết hay không' })
    @IsOptional()
    @IsBoolean()
    isPinned?: boolean;
}
