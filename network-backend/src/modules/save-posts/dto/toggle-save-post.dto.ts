import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsUUID } from 'class-validator';

export class ToggleSavePostDto {
    @ApiProperty({ example: 'post-uuid', description: 'ID of post you need save or unsave' })
    @IsUUID()
    postId: string;

    @ApiProperty({ description: 'true = save, false = unsave' })
    @IsBoolean()
    saved: boolean;
}
