import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { v4 as uuidv4 } from 'uuid';

import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as dayjs from 'dayjs';

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

@Entity({
  name: 'users',
})
export class User {
  @ApiProperty({
    description: 'ID of user',
    example: '89c018cc-8a77-4dbd-94e1-dbaa710a2a9c',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Email of user', example: 'atest@email.com' })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ description: 'First name of user', example: 'John' })
  @Column()
  firstName: string;

  @ApiProperty({ description: 'Last name of user', example: 'Doe' })
  @Column()
  lastName: string;

  @ApiHideProperty()
  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;

  @ApiProperty({ description: 'Role of user', example: 'USER' })
  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @ApiProperty({ description: 'account is active?', example: 'True or False' })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Email is verified?', example: false })
  @Column({ name: 'is_verified', default: false })
  isVerified: boolean;

  @ApiHideProperty()
  @Column({ name: 'verification_token', type: 'varchar', nullable: true })
  @Exclude({ toPlainOnly: true })
  verificationToken: string | null;

  @ApiProperty({ description: 'Verification token expiry date', nullable: true })
  @Column({ name: 'verification_token_expires', type: 'timestamp', nullable: true })
  verificationTokenExpires: Date | null;

  @ApiProperty({ description: 'Created date of user' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: 'Updated date of user' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ApiProperty({ description: 'Deleted date of user', required: false, nullable: true })
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date | null;

  @BeforeInsert()
  generateVerificationToken() {
    this.verificationToken = uuidv4();
    this.verificationTokenExpires = dayjs().add(24, 'hour').toDate();
  }

  isVerificationTokenValid(): boolean {
    return (
      !!this.verificationToken &&
      !!this.verificationTokenExpires &&
      dayjs().isBefore(this.verificationTokenExpires)
    );
  }
}