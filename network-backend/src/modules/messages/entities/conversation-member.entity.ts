import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Unique,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Conversation } from './conversation.entity';
import { User } from '@/modules/users/entities/user.entity';

export enum MemberRole {
    ADMIN = 'ADMIN',
    MEMBER = 'MEMBER',
}

@Entity('conversation_members')
@Unique(['conversation', 'user'])
export class ConversationMember {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Conversation, (conversation) => conversation.members, { onDelete: 'CASCADE' })
    conversation: Conversation;

    @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
    user: User;

    @ApiProperty({ enum: MemberRole, example: MemberRole.MEMBER })
    @Column({ type: 'enum', enum: MemberRole, default: MemberRole.MEMBER })
    role: MemberRole;

    @ApiProperty({ description: 'Is conversation pinned by this user?', example: false })
    @Column({ default: false })
    isPinned: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
