import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { MediaType } from '@/modules/media/types/media.types';
import { Post } from '@/modules/posts/entities/post.entity';

@Entity({ name: 'media' })
export class Media {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ enum: MediaType, description: 'Type of media' })
  @Column({ type: 'enum', enum: MediaType })
  type: MediaType;

  @ApiProperty({ description: 'URL to the media file (image/video)' })
  @Column()
  url: string;

  @ApiProperty({ description: 'Thumbnail (if video)', required: false })
  @Column({ nullable: true })
  thumbnail?: string;

  @ApiProperty({ description: 'Duration in seconds (for video)', required: false })
  @Column({ type: 'float', nullable: true })
  duration?: number;

  @ApiProperty({ description: 'Width of the media', required: false })
  @Column({ type: 'int', nullable: true })
  width?: number;

  @ApiProperty({ description: 'Height of the media', required: false })
  @Column({ type: 'int', nullable: true })
  height?: number;

  @ManyToOne(() => Post, (post) => post.media, { onDelete: 'CASCADE' })
  post: Post;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
