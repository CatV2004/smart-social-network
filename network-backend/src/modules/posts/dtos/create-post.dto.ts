import { IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiPropertyOptional({
    description: 'Optional content of the post',
    example: 'Just finished a great workout!',
  })
  @IsOptional()
  @IsString()
  content?: string;
}
