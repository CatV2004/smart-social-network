import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToOne,
    OneToMany,
} from 'typeorm';
import { Profile } from '@/modules/profiles/entities/profile.entity';
import { Media } from '@/modules/media/entities/media.entity';
import { Reaction } from '@/modules/reactions/entities/reaction.entity';
import { Comment } from '@/modules/comments/entities/comment.entity';

@Entity({ name: 'posts' })
export class Post {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text', nullable: true })
    content?: string;

    @ManyToOne(() => Profile, (profile) => profile.posts, { onDelete: 'CASCADE' })
    author: Profile;

    @OneToMany(() => Media, (media) => media.post, {
        cascade: true,
        eager: true, // Optional: load media when loading post
    })
    media: Media[];

    @OneToMany(() => Comment, comment => comment.post)
    comments: Comment[];

    @OneToMany(() => Reaction, reaction => reaction.post)
    reactions: Reaction[];

    @Column({ default: false })
    isEdited: boolean;

    @Column({ default: false })
    isPinned: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt?: Date;
}
