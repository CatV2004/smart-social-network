import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConversationMember, MemberRole } from '../entities/conversation-member.entity';
import { Conversation } from '../entities/conversation.entity';
import { AddMemberDto } from '../dtos/add-member.dto';
import { UsersService } from '@/modules/users/users.service';

@Injectable()
export class MembersService {
    constructor(
        @InjectRepository(ConversationMember)
        private memberRepo: Repository<ConversationMember>,

        @InjectRepository(Conversation)
        private conversationRepo: Repository<Conversation>,

        private readonly usersService: UsersService,
    ) { }

    async addMember(conversationId: string, dto: AddMemberDto) {
        const conversation = await this.conversationRepo.findOneBy({ id: conversationId });
        if (!conversation) throw new NotFoundException('Conversation not found');

        const user = await this.usersService.findById(dto.userId);
        if (!user) throw new NotFoundException('User not found');

        const member = this.memberRepo.create({
            conversation,
            user,
            role: dto.role as MemberRole,
        });
        return this.memberRepo.save(member);
    }

    async removeMember(memberId: string) {
        const member = await this.memberRepo.findOneBy({ id: memberId });
        if (!member) throw new NotFoundException('Member not found');

        return this.memberRepo.remove(member);
    }
}
