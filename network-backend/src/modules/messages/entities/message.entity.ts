import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    OneToMany,
    Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '@/modules/users/entities/user.entity';
import { Conversation } from './conversation.entity';
import { MessageAttachment } from './message-attachment.entity';
import { MessageRead } from './message-read.entity';

export enum MessageStatus {
    SENT = 'SENT',
    DELIVERED = 'DELIVERED',
    READ = 'READ',
}

@Entity('messages')
@Index('idx_message_conversation', ['conversation'])
export class Message {
    @ApiProperty({ description: 'Unique ID of the message' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'sender_id' })
    sender: User;

    @ManyToOne(() => Conversation, (conversation) => conversation.messages, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'conversation_id' })
    conversation: Conversation;

    @ApiProperty({ description: 'Message content', example: 'Hello!' })
    @Column({ type: 'text', nullable: true })
    content?: string;

    @OneToMany(() => MessageAttachment, (attachment) => attachment.message, { cascade: true })
    attachments: MessageAttachment[];

    @OneToMany(() => MessageRead, (read) => read.message, { cascade: true })
    reads: MessageRead[];

    @ApiProperty({ enum: MessageStatus, example: MessageStatus.SENT })
    @Column({ type: 'enum', enum: MessageStatus, default: MessageStatus.SENT })
    status: MessageStatus;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
