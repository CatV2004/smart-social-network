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
import { Profile } from '@/modules/profiles/entities/profile.entity';

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
  @ManyToOne(() => Profile, profile => profile.following, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'follower_id' })
  follower: Profile;

  @ApiProperty({ description: 'Người được theo dõi (following)' })
  @ManyToOne(() => Profile, profile => profile.followers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'following_id' })
  following: Profile;

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
