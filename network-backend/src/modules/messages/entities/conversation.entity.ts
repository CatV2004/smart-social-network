import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '@/modules/users/entities/user.entity';
import { ConversationMember } from './conversation-member.entity';
import { Message } from './message.entity';

@Entity('conversations')
export class Conversation {
    @ApiProperty({ description: 'Unique ID of the conversation' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ description: 'Is this a group conversation?', example: false })
    @Column({ default: false })
    isGroup: boolean;

    @ApiProperty({ description: 'Name of the conversation (for group chats)', nullable: true })
    @Column({ nullable: true })
    name?: string;

    @ApiProperty({ description: 'Group avatar', example: '/default-group.png' })
    @Column({ nullable: false, default: 'https://res.cloudinary.com/dohsfqs6d/image/upload/v1756139322/group-avatar_n73btl.png' })
    avatar?: string;

    /** Ai tạo ra cuộc trò chuyện */
    @ManyToOne(() => User)
    creator: User;

    /** Thành viên */
    @OneToMany(() => ConversationMember, (member) => member.conversation, { cascade: true })
    members: ConversationMember[];

    /** Tin nhắn */
    @OneToMany(() => Message, (message) => message.conversation)
    messages: Message[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
