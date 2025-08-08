import { ApiProperty } from '@nestjs/swagger';

export class TokensResponseDto {
  @ApiProperty({ description: 'JWT Access Token' })
  accessToken: string;

  @ApiProperty({ description: 'JWT Refresh Token' })
  refreshToken: string;

  @ApiProperty({ description: 'Access token TTL in seconds' })
  accessTokenExpiresIn: number;

  @ApiProperty({ description: 'Refresh token TTL in seconds' })
  refreshTokenExpiresIn: number;
}