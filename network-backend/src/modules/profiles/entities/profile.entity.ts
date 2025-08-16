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
import { Follow } from '@/modules/follows/entities/follow.entity';
import { ReactionPost } from '@/modules/reactions/entities/reaction-post.entity';
import { Comment } from '@/modules/comments/entities/comment.entity';

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

@Entity({ name: 'profiles' })
export class Profile {
  @ApiProperty({ description: 'Unique identifier of the profile' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'User account associated with this profile' })
  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ApiProperty({ description: 'Avatar image URL', nullable: true })
  @Column({
    nullable: true,
    default:
      'https://res.cloudinary.com/dohsfqs6d/image/upload/v1754206154/avatarDefault_nbrjul.jpg',
  })
  avatar?: string;

  @ApiProperty({ description: 'Cover image URL', nullable: true })
  @Column({
    name: 'cover_image',
    nullable: true,
    default:
      'http://res.cloudinary.com/dohsfqs6d/image/upload/v1754492693/covers/mr7yk18zxykv1mbllxy1.jpg',
  })
  coverImage?: string;

  @ApiProperty({ description: 'Biography of the profile owner', nullable: true })
  @Column({ type: 'text', nullable: true })
  bio?: string;

  @ApiProperty({ description: 'Location of the profile owner', nullable: true })
  @Column({ nullable: true })
  location?: string;

  @ApiProperty({ description: 'Date of birth', type: String, format: 'date', nullable: true })
  @Column({ type: 'date', nullable: true })
  dateOfBirth?: Date;

  @ApiProperty({ description: 'Gender of the profile owner', enum: Gender, nullable: true })
  @Column({ type: 'enum', enum: Gender, nullable: true })
  gender?: Gender;

  @ApiProperty({ description: 'Phone number', nullable: true })
  @Column({ nullable: true })
  phoneNumber?: string;

  @ApiProperty({ description: 'Personal website URL', nullable: true })
  @Column({ nullable: true })
  website?: string;

  @ApiProperty({ description: 'Facebook profile URL', nullable: true })
  @Column({ nullable: true })
  facebook?: string;

  @ApiProperty({ description: 'LinkedIn profile URL', nullable: true })
  @Column({ nullable: true })
  linkedin?: string;

  @ApiProperty({ description: 'GitHub profile URL', nullable: true })
  @Column({ nullable: true })
  github?: string;

  @ApiProperty({ description: 'Whether the profile is private', example: false })
  @Column({ default: false })
  isPrivate: boolean;

  /** Relations */

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];

  @OneToMany(() => Follow, (follow) => follow.follower)
  following: Follow[];

  @OneToMany(() => Follow, (follow) => follow.following)
  followers: Follow[];

  @OneToMany(() => ReactionPost, (reaction) => reaction.profile)
  reactionPosts: ReactionPost[];

  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Comment[];

  /** Timestamps */

  @ApiProperty({ description: 'Profile creation date' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: 'Profile last update date' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
