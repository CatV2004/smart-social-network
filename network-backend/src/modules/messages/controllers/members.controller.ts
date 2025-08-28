import { Controller, Post, Delete, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MembersService } from '../services/members.service';
import { AddMemberDto } from '../dtos/add-member.dto';
import { ConversationMember } from '../entities/conversation-member.entity';

@ApiTags('Conversation Members')
@Controller('conversations/:conversationId/members')
export class MembersController {
    constructor(private readonly membersService: MembersService) { }

    @Post()
    @ApiOperation({ summary: 'Add a new member to conversation' })
    @ApiResponse({ status: 201, description: 'Member added', type: ConversationMember })
    addMember(
        @Param('conversationId') conversationId: string,
        @Body() dto: AddMemberDto,
    ) {
        return this.membersService.addMember(conversationId, dto);
    }

    @Delete(':memberId')
    @ApiOperation({ summary: 'Remove a member from conversation' })
    @ApiResponse({ status: 200, description: 'Member removed' })
    removeMember(@Param('memberId') memberId: string) {
        return this.membersService.removeMember(memberId);
    }
}
