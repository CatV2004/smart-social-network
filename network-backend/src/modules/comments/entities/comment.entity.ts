import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Post } from '@/modules/posts/entities/post.entity';
import { User } from '@/modules/users/entities/user.entity';

@Entity('comments')
export class Comment {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Nội dung comment' })
  @Column({ type: 'text' })
  content: string;

  @ApiProperty({ description: 'Người viết comment' })
  @ManyToOne(() => User, user => user.id, { eager: true })
  author: User;

  @ApiProperty({ description: 'Bài viết được comment' })
  @ManyToOne(() => Post, post => post.comments, { onDelete: 'CASCADE' })
  post: Post;

  @ApiProperty({ description: 'Comment cha nếu là trả lời', nullable: true })
  @ManyToOne(() => Comment, comment => comment.replies, { nullable: true, onDelete: 'CASCADE' })
  parentComment?: Comment;

  @OneToMany(() => Comment, comment => comment.parentComment)
  replies: Comment[];

  @ApiProperty()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
