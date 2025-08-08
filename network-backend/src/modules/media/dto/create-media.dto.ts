import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { MediaType } from '../types/media.types';

export class CreateMediaDto {
  @ApiProperty({ enum: MediaType })
  @IsEnum(MediaType)
  type: MediaType;

  @ApiProperty({ description: 'ID of the associated post' })
  @IsUUID()
  @IsNotEmpty()
  postId: string;
}
