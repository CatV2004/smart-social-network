import { UserPublicDto } from '@/modules/users/dto/user-public.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class FollowUserResponseDto {
  @ApiProperty({ type: () => UserPublicDto })
  @Expose()
  @Type(() => UserPublicDto)
  user: UserPublicDto;

  @ApiProperty({ type: String, format: 'date-time' })
  @Expose()
  followedAt: Date;
}