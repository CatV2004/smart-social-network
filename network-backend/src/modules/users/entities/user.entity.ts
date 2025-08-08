import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { v4 as uuidv4 } from 'uuid';

import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import dayjs from 'dayjs';
import { Reaction } from '@/modules/reactions/entities/reaction.entity';
import { Follow } from '@/modules/follows/entities/follow.entity';
import { Profile } from '@/modules/profiles/entities/profile.entity';
// import { ConfigService } from '@nestjs/config';

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

@Entity({
  name: 'users',
})
export class User {
  // constructor(private readonly configService: ConfigService) { }

  @ApiProperty({
    description: 'ID of user',
    example: '89c018cc-8a77-4dbd-94e1-dbaa710a2a9c',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Profile, profile => profile.user)
  profile: Profile;

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

  @OneToMany(() => Follow, follow => follow.follower)
  following: Follow[];

  @OneToMany(() => Follow, follow => follow.following)
  followers: Follow[];

  @OneToMany(() => Reaction, reaction => reaction.user)
  reactions: Reaction[];

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

  // @BeforeInsert()
  // generateVerificationToken() {
  //   const expiresInSeconds = this.configService.get<number>('VERIFICATION_TOKEN_EXPIRES_IN_SECONDS', 60);
  //   this.verificationToken = uuidv4();
  //   this.verificationTokenExpires = dayjs().add(expiresInSeconds, 'second').toDate();
  // }

  isVerificationTokenValid(): boolean {
    return (
      !!this.verificationToken &&
      !!this.verificationTokenExpires &&
      dayjs().isBefore(this.verificationTokenExpires)
    );
  }
}