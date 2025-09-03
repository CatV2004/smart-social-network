import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Conversation } from '../entities/conversation.entity';
import { ConversationMember, MemberRole } from '../entities/conversation-member.entity';
import { CreateConversationDto } from '../dtos/create-conversation.dto';
import { UsersService } from '@/modules/users/users.service';
import { ConversationMemberMapper } from '../mappers/conversation-member.mapper';
import { paginateWithMapper } from '@/common/utils/paginate-with-mapper';
import { PaginationQueryDto } from '@/common/dtos/pagination-query.dto';
import { ConversationMapper } from '../mappers/conversation.mapper';
import { MessagesService } from './messages.service';
import { paginateWithBatchMapper } from '@/common/utils/paginateWithBatchMapper';

@Injectable()
export class ConversationsService {
    constructor(
        @InjectRepository(Conversation)
        private conversationRepo: Repository<Conversation>,

        @InjectRepository(ConversationMember)
        private memberRepo: Repository<ConversationMember>,

        private readonly usersService: UsersService,

        private readonly messagesService: MessagesService
    ) { }

    async createConversation(dto: CreateConversationDto, creatorId: string) {
        if (!dto.isGroup) {
            const otherId = dto.memberIds[0];
            const exists = await this.isDirectConversationExists(creatorId, otherId);
            if (exists) {
                throw new BadRequestException('Direct conversation already exists between these users');
            }
        }
        const creator = await this.usersService.findById(creatorId)
        if (!creator) throw new NotFoundException('Creator not found');

        const members = await this.usersService.findByIds(dto.memberIds);

        const conversation = this.conversationRepo.create({
            isGroup: dto.isGroup,
            name: dto.name,
            avatar: dto.avatar || 'https://res.cloudinary.com/dohsfqs6d/image/upload/v1756139322/group-avatar_n73btl.png',
            creator,
        });
        const saved = await this.conversationRepo.save(conversation);

        // add creator as ADMIN
        const creatorMember = this.memberRepo.create({
            conversation,
            user: creator,
            role: MemberRole.ADMIN,
        });
        await this.memberRepo.save(creatorMember);

        // add other members
        const otherMembers = members.map((user) =>
            this.memberRepo.create({ conversation, user, role: MemberRole.MEMBER }),
        );
        await this.memberRepo.save(otherMembers);

        const fullConversation = await this.conversationRepo.findOne({
            where: { id: saved.id },
            relations: [
                'members',
                'members.user',
                'members.user.profile',
                'creator',
                'creator.profile',
            ],
        });

        if (!fullConversation) throw new NotFoundException('Conversation not found after creation');

        return await ConversationMapper.toResponseDto(
            fullConversation,
            creatorId
        );
    }

    async getConversationById(conversationId: string, userId: string) {
        const conversation = await this.conversationRepo.findOne({
            where: { id: conversationId },
            relations: [
                'members',
                'members.user',
                'members.user.profile',
                'messages',
                'messages.attachments',
                'messages.sender',
                'messages.sender.profile',
            ],
        });

        if (!conversation) {
            throw new NotFoundException('Conversation not found');
        }

        const [unreadCount, lastMessage] = await Promise.all([
            this.messagesService.getUnreadCountsForUser([conversation.id], userId),
            this.messagesService.getLastMessagesForConversations([conversation.id]),
        ]);

        return ConversationMapper.toResponseDto(
            conversation,
            userId,
            unreadCount[conversation.id] ?? 0,
            lastMessage[conversation.id],
        );
    }

    async getConversationsByUser(userId: string, dto: PaginationQueryDto) {
        const qb = this.conversationRepo
            .createQueryBuilder('conversation')
            .innerJoin('conversation.members', 'member')
            .innerJoin('member.user', 'memberUser', 'memberUser.id = :userId', { userId })
            .leftJoinAndSelect('conversation.members', 'allMembers')
            .leftJoinAndSelect('allMembers.user', 'users')
            .leftJoinAndSelect('users.profile', 'profiles')
            .orderBy('conversation.updatedAt', 'DESC');

        return paginateWithBatchMapper(
            qb,
            dto.page ?? 1,
            dto.limit ?? 20,
            async (convos) => {
                if (!convos.length) {
                    return [];
                }

                const convoIds = convos.map(c => c.id);

                const [unreadCounts, lastMessages] = await Promise.all([
                    this.messagesService.getUnreadCountsForUser(convoIds, userId),
                    this.messagesService.getLastMessagesForConversations(convoIds),
                ]);
                console.log("lastMessages: ", lastMessages)

                return Promise.all(
                    convos.map(convo =>
                        ConversationMapper.toResponseDto(
                            convo,
                            userId,
                            unreadCounts[convo.id] ?? 0,
                            lastMessages[convo.id],
                        )
                    ),
                );
            },
        );
    }

    async getMembers(conversationId: string, paginate: PaginationQueryDto) {
        const qb = this.memberRepo
            .createQueryBuilder('member')
            .leftJoinAndSelect('member.user', 'user')
            .leftJoinAndSelect('member.conversation', 'conversation')
            .leftJoinAndSelect('user.profile', 'profile')
            .where('conversation.id = :conversationId', { conversationId })
            .orderBy('member.createdAt', 'ASC');

        return paginateWithMapper(
            qb,
            paginate.page ?? 1,
            paginate.limit ?? 20,
            ConversationMemberMapper.toResponseDto,
        );
    }

    async deleteConversation(conversationId: string) {
        const conversation = await this.conversationRepo.findOne({
            where: { id: conversationId },
            relations: ['members', 'creator'],
        });
        if (!conversation) throw new NotFoundException();
        await this.conversationRepo.remove(conversation);
    }


    //Utils
    async isDirectConversationExists(creatorId: string, otherUserId: string): Promise<boolean> {
        const existing = await this.conversationRepo
            .createQueryBuilder('conversation')
            .innerJoin('conversation.members', 'm1')
            .innerJoin('conversation.members', 'm2')
            .where('conversation.isGroup = false')
            .andWhere('m1.userId = :creatorId', { creatorId })
            .andWhere('m2.userId = :otherUserId', { otherUserId })
            .getOne();


        return !!existing;
    }


}
