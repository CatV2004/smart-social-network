import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Message } from './message.entity';
import { AttachmentType } from '../types/attachment.type';



@Entity('message_attachments')
export class MessageAttachment {
    @ApiProperty({ description: 'Unique ID of the attachment' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Message, (message) => message.attachments, { onDelete: 'CASCADE' })
    message: Message;

    @ApiProperty({ description: 'Attachment file URL' })
    @Column()
    url: string;

    @ApiProperty({ description: 'Attachment file publicId (Cloudinary key)' })
    @Column()
    publicId: string;

    @ApiProperty({ enum: AttachmentType, example: AttachmentType.IMAGE })
    @Column({ type: 'enum', enum: AttachmentType, default: AttachmentType.FILE })
    type: AttachmentType;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
