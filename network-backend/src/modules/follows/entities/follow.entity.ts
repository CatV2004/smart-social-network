import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Unique,
  JoinColumn,
  Column,
} from 'typeorm';
import { User } from '@/modules/users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export enum FollowStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

@Entity({ name: 'follows' })
@Unique(['follower', 'following'])
export class Follow {
  @ApiProperty({ description: 'ID của lượt theo dõi' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Người theo dõi (follower)' })
  @ManyToOne(() => User, user => user.following, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'follower_id' })
  follower: User;

  @ApiProperty({ description: 'Người được theo dõi (following)' })
  @ManyToOne(() => User, user => user.followers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'following_id' })
  following: User;

  @ApiProperty({ enum: FollowStatus, description: 'Trạng thái theo dõi' })
  @Column({
    type: 'enum',
    enum: FollowStatus,
    default: FollowStatus.ACCEPTED, // mặc định là accepted nếu profile công khai
  })
  status: FollowStatus;

  @ApiProperty({ description: 'Thời gian bắt đầu theo dõi' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
