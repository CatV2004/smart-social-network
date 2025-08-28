import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ConversationMember } from '../entities/conversation-member.entity';

@Injectable()
export class ConversationMembersService {
    constructor(private readonly dataSource: DataSource) { }
    async getUserIdsByConversation(
        conversationId: string,
        currentUserId: string
    ): Promise<string[]> {
        const members = await this.dataSource
            .getRepository(ConversationMember)
            .createQueryBuilder('member')
            .leftJoinAndSelect('member.user', 'user')
            .where('member.conversationId = :conversationId', { conversationId })
            .getMany();

        if (!members || members.length === 0) {
            throw new NotFoundException('No members found for this conversation');
        }

        // Lọc ra những userId khác với currentUserId
        return members
            .map(member => member.user.id)
            .filter(userId => userId !== currentUserId);
    }

}
