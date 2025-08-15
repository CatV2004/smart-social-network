import { Entity, PrimaryGeneratedColumn, ManyToOne, Unique, CreateDateColumn } from 'typeorm';
import { Profile } from '@/modules/profiles/entities/profile.entity';
import { Post } from '@/modules/posts/entities/post.entity';

@Entity('save_posts')
@Unique(['profile', 'post'])
export class SavePost {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Profile, { onDelete: 'CASCADE' })
    profile: Profile;

    @ManyToOne(() => Post, { onDelete: 'CASCADE' })
    post: Post;

    @CreateDateColumn()
    createdAt: Date;
}
