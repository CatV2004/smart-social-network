import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class UserResponseDto {
  @ApiProperty({ description: 'ID of user' })
  id: string;

  @ApiProperty({ description: 'Email of user' })
  email: string;

  @ApiProperty({ description: 'First name of user' })
  first_name: string;

  @ApiProperty({ description: 'Last name of user' })
  last_name: string;

  @ApiProperty({ description: 'Created date of user' })
  created_at: Date;

  @ApiProperty({ description: 'Updated date of user' })
  updated_at: Date;

  @ApiProperty({ description: 'Deleted date of user', nullable: true, required: false })
  deleted_at?: Date | null;

  @ApiProperty({ description: 'Whether current user follows this user' })
  isFollowed: boolean;

  constructor(user: User, isFollowed: boolean = false) {
    this.id = user.id;
    this.email = user.email;
    this.first_name = user.firstName;
    this.last_name = user.lastName;
    this.created_at = user.createdAt;
    this.updated_at = user.updatedAt;
    this.deleted_at = user.deletedAt;
    this.isFollowed = isFollowed;
  }
}
