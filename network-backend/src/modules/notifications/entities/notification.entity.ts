// notifications/entities/notification.entity.ts
import { Profile } from '@/modules/profiles/entities/profile.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
} from 'typeorm';
import { NotificationType } from '../types/notification.type';
import { Post } from '@/modules/posts/entities/post.entity';
import { Comment } from '@/modules/comments/entities/comment.entity';

@Entity('notifications')
@Index(['receiver', 'isRead'])
export class Notification {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Profile, { eager: true })
    sender: Profile;

    @ManyToOne(() => Profile, { eager: true })
    @Index()
    receiver: Profile;

    @Column({
        type: 'smallint',
    })
    type: NotificationType;

    @ManyToOne(() => Post, { nullable: true })
    post?: Post;

    @ManyToOne(() => Comment, { nullable: true })
    comment?: Comment;

    @Column({ default: false })
    isRead: boolean;

    /** Metadata linh hoạt (VD: message tùy biến, thông tin extra) */
    @Column({ type: 'jsonb', nullable: true })
    metadata?: Record<string, any>;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
