import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, Unique, Index } from 'typeorm';
import { Message } from './message.entity';
import { User } from '@/modules/users/entities/user.entity';

@Entity('message_reads')
@Unique(['message', 'user'])
@Index('idx_message_user', ['message', 'user'])
export class MessageRead {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Message, { onDelete: 'CASCADE' })
    message: Message;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    user: User;

    @CreateDateColumn({ name: 'read_at' })
    readAt: Date;
}
