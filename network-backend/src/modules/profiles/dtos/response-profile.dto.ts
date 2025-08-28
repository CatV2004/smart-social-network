import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { Gender } from '../entities/profile.entity';
import { UserResponseDto } from '@/modules/users/dtos/user-response.dto';
import { FollowStatus } from '@/modules/follows/entities/follow.entity';

export class ProfileResponseDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty({ type: () => UserResponseDto })
  @Expose()
  @Type(() => UserResponseDto)
  user: UserResponseDto;

  @ApiProperty({ nullable: true })
  @Expose()
  avatar?: string;

  @ApiProperty({ nullable: true })
  @Expose()
  coverImage?: string;

  @ApiProperty({ nullable: true })
  @Expose()
  bio?: string;

  @ApiProperty({ nullable: true })
  @Expose()
  location?: string;

  @ApiProperty({ type: String, format: 'date', nullable: true })
  @Expose()
  @Transform(({ value }) => {
    if (!value) return null;
    if (typeof value === 'string') return value;
    if (value instanceof Date) return value.toISOString().split('T')[0];
    return null;
  })
  dateOfBirth?: string;

  @ApiProperty({ enum: Gender, nullable: true })
  @Expose()
  gender?: Gender;

  @ApiProperty({ nullable: true })
  @Expose()
  phoneNumber?: string;

  @ApiProperty({ nullable: true })
  @Expose()
  website?: string;

  @ApiProperty({ nullable: true })
  @Expose()
  facebook?: string;

  @ApiProperty({ nullable: true })
  @Expose()
  linkedin?: string;

  @ApiProperty({ nullable: true })
  @Expose()
  github?: string;

  @ApiProperty()
  @Expose()
  isPrivate: boolean;

  @ApiProperty()
  @Expose()
  isFollowed: boolean;

  @ApiProperty()
  @Expose()
  followStatus: FollowStatus;

  @ApiProperty()
  @Expose()
  followersCount: number;

  @ApiProperty()
  @Expose()
  followingCount: number;

  @ApiProperty()
  @Expose()
  postsCount: number;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;
}
