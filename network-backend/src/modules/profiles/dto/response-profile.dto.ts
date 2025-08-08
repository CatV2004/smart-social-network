import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { Gender } from '../entities/profile.entity';

export class ProfileResponseDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  @Transform(({ obj }) => obj.user?.id)
  userId: string;

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
  @Transform(({ value }) => value?.toISOString().split('T')[0])
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
  followersCount: number;

  @ApiProperty()
  @Expose()
  followingCount: number;


  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;
}
