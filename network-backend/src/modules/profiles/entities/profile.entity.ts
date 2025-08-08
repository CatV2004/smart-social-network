import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '@/modules/users/entities/user.entity';
import { Post } from '@/modules/posts/entities/post.entity';

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

@Entity({ name: 'profiles' })
export class Profile {
  @ApiProperty({ description: 'ID of profile' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'User that owns this profile' })
  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ApiProperty({ description: 'Avatar image URL', nullable: true })
  @Column({ nullable: true, default: 'https://res.cloudinary.com/dohsfqs6d/image/upload/v1754206154/avatarDefault_nbrjul.jpg' })
  avatar?: string;

  @ApiProperty({ description: 'Cover image URL', nullable: true })
  @Column({ name: 'cover_image', nullable: true, default: 'http://res.cloudinary.com/dohsfqs6d/image/upload/v1754492693/covers/mr7yk18zxykv1mbllxy1.jpg' })
  coverImage?: string;

  @ApiProperty({ description: 'Biography of the user', nullable: true })
  @Column({ type: 'text', nullable: true })
  bio?: string;

  @ApiProperty({ description: 'Location of user', example: 'Ho Chi Minh City', nullable: true })
  @Column({ nullable: true })
  location?: string;

  @ApiProperty({ description: 'Date of birth', type: String, format: 'date', nullable: true })
  @Column({ type: 'date', nullable: true })
  dateOfBirth?: Date;

  @ApiProperty({ description: 'Gender of user', enum: Gender, nullable: true })
  @Column({ type: 'enum', enum: Gender, nullable: true })
  gender?: Gender;

  @ApiProperty({ description: 'Phone number of user', nullable: true })
  @Column({ nullable: true })
  phoneNumber?: string;

  @ApiProperty({ description: 'Personal website', nullable: true })
  @Column({ nullable: true })
  website?: string;

  @ApiProperty({ description: 'Facebook URL', nullable: true })
  @Column({ nullable: true })
  facebook?: string;

  @ApiProperty({ description: 'LinkedIn URL', nullable: true })
  @Column({ nullable: true })
  linkedin?: string;

  @ApiProperty({ description: 'Github URL', nullable: true })
  @Column({ nullable: true })
  github?: string;

  @ApiProperty({ description: 'Is profile private?', example: false })
  @Column({ default: false })
  isPrivate: boolean;

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];

  @ApiProperty({ description: 'Created date of profile' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: 'Updated date of profile' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
