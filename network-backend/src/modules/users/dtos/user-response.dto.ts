import { ApiProperty } from '@nestjs/swagger';
import { User, UserRole } from '../entities/user.entity';
import { Expose } from 'class-transformer';
import { Column } from 'typeorm';

export class UserResponseDto {
  @ApiProperty({ description: 'ID of user' })
  @Expose()
  id: string;

  @ApiProperty({ description: 'Email of user' })
  @Expose()
  email: string;

  @ApiProperty({ description: 'First name of user' })
  @Expose()
  firstName: string;

  @ApiProperty({ description: 'Last name of user' })
  @Expose()
  lastName: string;

  @ApiProperty({ description: 'username of user' })
  @Expose()
  username: string;

  @ApiProperty({ description: 'Created date of user' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ description: 'Updated date of user' })
  @Expose()
  updatedAt: Date;

  @ApiProperty({ description: 'Role of user', example: 'USER' })
  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  @Expose()
  role: UserRole;

  // constructor(user: User) {
  //   this.id = user.id;
  //   this.email = user.email;
  //   this.firstName = user.firstName;
  //   this.lastName = user.lastName;
  //   this.username = user.username;
  //   this.createdAt = user.createdAt;
  //   this.updatedAt = user.updatedAt;
  //   this.role = user.role;
  // }
}
