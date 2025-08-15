import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    CreateDateColumn,
    Column,
    Unique,
    UpdateDateColumn,
} from 'typeorm';
import { Post } from '@/modules/posts/entities/post.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Profile } from '@/modules/profiles/entities/profile.entity';

@Entity({ name: 'reaction_posts' })
@Unique(['profile', 'post'])
export class ReactionPost {
    @ApiProperty({ description: 'ID of reaction' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ description: 'User who reacted' })
    @ManyToOne(() => Profile, (profile) => profile.reactionPosts, { onDelete: 'CASCADE' })
    profile: Profile;

    @ApiProperty({ description: 'Post that was reacted to' })
    @ManyToOne(() => Post, (post) => post.reactions, { onDelete: 'CASCADE' })
    post: Post;

    @ApiProperty({ description: 'Reaction created at' })
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @ApiProperty({ description: 'Reaction updated at' })
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
