import { ProfilePublicDto } from '@/modules/profiles/dto/profile-public.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class FollowProfileResponseDto {
  @ApiProperty({ type: () => ProfilePublicDto })
  @Expose()
  @Type(() => ProfilePublicDto)
  profile: ProfilePublicDto;

  @ApiProperty({ type: String, format: 'date-time' })
  @Expose()
  followedAt: Date;
}