import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  @ApiProperty({ description: 'User ID from refresh token' })
  @IsUUID()
  userId: string;

  @ApiProperty({ description: 'Token ID for validation' })
  @IsUUID()
  tokenId: string;
}