import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsUUID } from 'class-validator';

export class ToggleReactionPostDto {
    @ApiProperty({ description: 'ID of post' })
    @IsUUID()
    postId: string;

    @ApiProperty({ description: 'true = like, false = unlike' })
    @IsBoolean()
    liked: boolean;
}
