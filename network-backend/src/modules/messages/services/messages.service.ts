import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { Message, MessageStatus } from '../entities/message.entity';
import { Conversation } from '../entities/conversation.entity';
import { SendMessageDto } from '../dtos/send-message.dto';
import { UpdateMessageStatusDto } from '../dtos/update-message-status.dto';
import { UsersService } from '@/modules/users/users.service';
import { CloudinaryService } from '@/cloudinary/cloudinary.service';
import { AttachmentType } from '../types/attachment.type';
import { MessageAttachment } from '../entities/message-attachment.entity';
import { MessageMapper } from '../mappers/message.mapper';
import { MessageReadDto, MessageResponseDto } from '../dtos/message-response.dto';
import { paginateWithMapper } from '@/common/utils/paginate-with-mapper';
import { PaginationQueryDto } from '@/common/dtos/pagination-query.dto';
import { MessageRead } from '../entities/message-read.entity';
import { MessageRealtimeService } from './message-realtime.service';
import { ConversationMembersService } from './conversation-members-service';

@Injectable()
export class MessagesService {
    private readonly logger = new Logger(MessagesService.name)
    constructor(
        @InjectRepository(Message)
        private messageRepo: Repository<Message>,

        @InjectRepository(Conversation)
        private conversationRepo: Repository<Conversation>,

        @InjectRepository(MessageRead)
        private readonly messageReadRepo: Repository<MessageRead>,

        private readonly usersService: UsersService,

        private readonly cloudinaryService: CloudinaryService,

        private readonly dataSource: DataSource,

        private readonly messageRealtimeService: MessageRealtimeService,

        private readonly conversationMembersService: ConversationMembersService,
    ) { }

    private detectAttachmentType(mimetype: string): AttachmentType {
        if (mimetype.startsWith('image')) return AttachmentType.IMAGE;
        if (mimetype.startsWith('video')) return AttachmentType.VIDEO;
        return AttachmentType.FILE;
    }

    async sendMessage(
        senderId: string,
        dto: SendMessageDto,
        files?: Express.Multer.File[],
    ): Promise<MessageResponseDto> {
        return this.dataSource.transaction(async (manager) => {
            const sender = await this.usersService.findById(senderId);
            if (!sender) throw new NotFoundException('Sender not found');

            const conversation = await manager.findOneBy(Conversation, { id: dto.conversationId });
            if (!conversation) throw new NotFoundException('Conversation not found');
            const message = manager.create(Message, {
                sender,
                conversation,
                content: dto.content,
                status: MessageStatus.SENT,
            });

            if (files && files.length > 0) {
                message.attachments = [];

                for (const file of files) {
                    const uploadResult = await this.cloudinaryService.uploadFile(file, 'chat_attachments');

                    const attachment = manager.create(MessageAttachment, {
                        url: uploadResult.secure_url,
                        publicId: uploadResult.public_id,
                        type: this.detectAttachmentType(file.mimetype),
                    });

                    message.attachments.push(attachment);
                }
            }

            const savedMessage = await manager.save(message);
            const loadedMessage = await manager.findOne(Message, {
                where: { id: savedMessage.id },
                relations: [
                    'sender',
                    'sender.profile',
                    'attachments',
                ],
            });
            const messageDto = await MessageMapper.toResponseDto(loadedMessage!);

            const recipientIds = await this.conversationMembersService.getUserIdsByConversation(dto.conversationId, senderId)
            this.logger.log("recipientIds: ", recipientIds)
            this.messageRealtimeService.sendNewMessage(
                conversation.id,
                messageDto,
                recipientIds,
            );

            return messageDto;
        });
    }

    async getMessages(conversationId: string, dto: PaginationQueryDto) {
        const qb = this.messageRepo
            .createQueryBuilder('message')
            .leftJoinAndSelect('message.conversation', 'conversation')
            .leftJoinAndSelect('message.sender', 'sender')
            .leftJoinAndSelect('sender.profile', 'profile')
            .leftJoinAndSelect('message.attachments', 'attachments')
            .leftJoinAndSelect('message.reads', 'reads')
            .where('conversation.id = :conversationId', { conversationId })
            .orderBy('message.createdAt', 'DESC');

        return paginateWithMapper(qb, dto.page!, dto.limit!, MessageMapper.toResponseDto);
    }

    async getMessageReads(messageId: string): Promise<MessageReadDto[]> {
        const reads = await this.messageReadRepo.find({
            where: { message: { id: messageId } },
            relations: ['user', 'user.profile'],
            order: { readAt: 'ASC' },
        });

        return reads.map(r => ({
            userId: r.user.id,
            avatar: r.user.profile.avatar!,
            readAt: r.readAt,
        }));
    }

    async updateStatus(messageId: string, dto: UpdateMessageStatusDto) {
        const message = await this.messageRepo.findOne({
            where: { id: messageId },
            // relations: ['sender', 'sender.profile', 'attachments'],
        });
        if (!message) throw new NotFoundException('Message not found');

        message.status = dto.status;
        return await this.messageRepo.save(message);

        // return MessageMapper.toResponseDto(updated);
    }

    async markMessageAsRead(userId: string, messageId: string) {
        const existing = await this.messageReadRepo.findOne({
            where: { user: { id: userId }, message: { id: messageId } },
        });

        if (!existing) {
            const readEntity = this.messageReadRepo.create({
                user: { id: userId } as any,
                message: { id: messageId } as any,
            });
            await this.messageReadRepo.save(readEntity);
        }

        // Update status = READ
        await this.messageRepo.update({ id: messageId }, { status: MessageStatus.READ });

        return { success: true, status: MessageStatus.READ };
    }


    async getUnreadCount(conversationId: string, userId: string): Promise<number> {
        const result = await this.messageRepo
            .createQueryBuilder('message')
            .leftJoin('message_reads', 'read', 'read."messageId" = message.id AND read."userId" = :userId', { userId })
            .where('message.conversation_id = :conversationId', { conversationId })
            .andWhere('message.sender_id != :userId', { userId })
            .select('COUNT(message.id) - COUNT(read.id)', 'unreadCount')
            .getRawOne<{ unreadCount: string }>();

        return parseInt(result?.unreadCount || '0', 10);
    }

    /**
     * Lấy unreadCount cho nhiều conversation cùng lúc
     */
    async getUnreadCountsForUser(conversationIds: string[], userId: string) {
        const rows = await this.messageRepo
            .createQueryBuilder('message')
            .leftJoin(
                'message_reads',
                'read',
                'read."messageId" = message.id AND read."userId" = :userId',
                { userId },
            )
            .where('message.conversation_id IN (:...conversationIds)', { conversationIds })
            .andWhere('message.sender_id != :userId', { userId })
            .select('message.conversation_id', 'conversationId')
            .addSelect('COUNT(message.id) - COUNT(read.id)', 'unreadCount')
            .groupBy('message.conversation_id')
            .getRawMany<{ conversationId: string; unreadCount: string }>();

        const map: Record<string, number> = {};
        rows.forEach(r => {
            map[r.conversationId] = parseInt(r.unreadCount, 10);
        });
        return map;
    }

    async getLastMessagesForConversations(conversationIds: string[]) {
        if (!conversationIds.length) return {};

        const rows = await this.messageRepo
            .createQueryBuilder("message")
            .distinctOn(["message.conversation_id"])
            .leftJoinAndSelect("message.conversation", "conversation")
            .leftJoinAndSelect("message.sender", "sender")
            .leftJoinAndSelect("sender.profile", "profile")
            .leftJoinAndSelect("message.attachments", "attachments")
            .where("message.conversation_id IN (:...conversationIds)", { conversationIds })
            .orderBy("message.conversation_id", "ASC")
            .addOrderBy("message.created_at", "DESC")
            .getMany();
        const result: Record<string, Message> = {};
        for (const msg of rows) {
            result[msg.conversation.id] = msg;
        }
        return result;
    }

    async markConversationAsRead(conversationId: string, userId: string): Promise<number> {
        const unreadMessages = await this.messageRepo
            .createQueryBuilder("message")
            .leftJoin("message.reads", "read", "read.userId  = :userId", { userId })
            .where("message.conversation_id = :conversationId", { conversationId })
            .andWhere("message.sender_id != :userId", { userId })
            .andWhere("read.id IS NULL")
            .getMany();

        if (!unreadMessages.length) return 0;

        const readEntities = unreadMessages.map((msg) =>
            this.messageReadRepo.create({
                message: msg,
                user: { id: userId } as any,
            }),
        );

        await this.messageReadRepo.save(readEntities);

        await this.messageRepo
            .createQueryBuilder()
            .update()
            .set({ status: MessageStatus.READ })
            .where("id IN (:...ids)", { ids: unreadMessages.map((m) => m.id) })
            .execute();

        return readEntities.length;
    }

    async markConversationAsUnread(conversationId: string, userId: string, limit = 10): Promise<number> {
        // Lấy các message đã đọc gần nhất của user trong conversation, giới hạn theo limit
        const readMessages = await this.messageReadRepo
            .createQueryBuilder("read")
            .leftJoinAndSelect("read.message", "message")
            .where("message.conversation_id = :conversationId", { conversationId })
            .andWhere("read.userId = :userId", { userId })
            .orderBy("message.created_at", "DESC")
            .limit(limit)
            .getMany();

        if (!readMessages.length) return 0;

        const deleted = await this.messageReadRepo.remove(readMessages);

        return deleted.length;
    }

    async countUnreadMessages(userId: string): Promise<number> {
        const count = await this.messageRepo
            .createQueryBuilder('message')
            .leftJoin('message.reads', 'read', 'read.userId = :userId', { userId })
            .innerJoin('message.conversation', 'conversation')
            .innerJoin('conversation.members', 'member', 'member.userId = :userId', { userId })
            .where('message.sender_id != :userId', { userId })
            .andWhere('read.id IS NULL')
            .getCount();

        return count;
    }

}
