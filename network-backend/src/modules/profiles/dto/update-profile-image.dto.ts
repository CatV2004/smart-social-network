import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty } from 'class-validator';

export class UpdateProfileImageDto {
    @ApiProperty({ enum: ['avatar', 'cover'], description: 'Type of image to update' })
    @IsNotEmpty()
    @IsIn(['avatar', 'cover'])
    type: 'avatar' | 'cover';
}
