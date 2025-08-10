import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    CreateDateColumn,
    Column,
    Unique,
} from 'typeorm';
import { Post } from '@/modules/posts/entities/post.entity';
import { ApiProperty } from '@nestjs/swagger';
import { ReactionType } from '@/modules/reactions/types/reaction.types';
import { Profile } from '@/modules/profiles/entities/profile.entity';


@Entity({ name: 'reactions' })
@Unique(['profile', 'post'])
export class Reaction {
    @ApiProperty({ description: 'ID of reaction' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ description: 'User who reacted' })
    @ManyToOne(() => Profile, profile => profile.id, { onDelete: 'CASCADE' })
    profile: Profile;

    @ApiProperty({ description: 'Post that was reacted to' })
    @ManyToOne(() => Post, post => post.reactions, { onDelete: 'CASCADE' })
    post: Post;

    @ApiProperty({ description: 'Type of reaction', enum: ReactionType })
    @Column({ type: 'enum', enum: ReactionType, default: ReactionType.LOVE })
    type: ReactionType;

    @ApiProperty({ description: 'Reaction created at' })
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
