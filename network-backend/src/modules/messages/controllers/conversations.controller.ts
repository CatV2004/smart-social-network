import { Controller, Post, Body, Param, Get, UseGuards, Query, Delete, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiOkResponse, ApiParam } from '@nestjs/swagger';
import { ConversationsService } from '../services/conversations.service';
import { CreateConversationDto } from '../dtos/create-conversation.dto';
import { Conversation } from '../entities/conversation.entity';
import { ActiveUser } from '@/common/decorators/active-user.decorator';
import { ActiveUserData } from '@/common/interfaces/active-user-data.interface';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { PaginatedResponseDto } from '@/common/dtos/paginated-response.factory';
import { ConversationMemberResponseDto } from '../dtos/conversation-member-response.dto';
import { PaginationQueryDto } from '@/common/dtos/pagination-query.dto';
import { IPaginated } from '@/common/dtos/paginated.interface';
import { MessagesService } from '../services/messages.service';
import { ConversationResponseDto } from '../dtos/conversation-response.dto';

@ApiTags('Conversations')
@UseGuards(JwtAuthGuard)
@Controller('conversations')
export class ConversationsController {
    constructor(
        private readonly conversationsService: ConversationsService,
        private readonly messageService: MessagesService,
    ) { }

    @Post()
    @ApiOperation({ summary: 'Create a new conversation (1-1 or group)' })
    @ApiResponse({ status: 201, description: 'Conversation created', type: Conversation })
    createConversation(
        @Body() dto: CreateConversationDto,
        @ActiveUser() user: ActiveUserData,
    ) {
        return this.conversationsService.createConversation(dto, user.id);
    }

    @Get(':conversationId/members')
    @ApiOperation({ summary: 'Get members of a conversation with pagination' })
    @ApiOkResponse({
        description: 'Paginated members',
        type: PaginatedResponseDto(ConversationMemberResponseDto),
    })
    async getMembers(
        @Param('conversationId') conversationId: string,
        @Query() pagination: PaginationQueryDto,
    ): Promise<IPaginated<ConversationMemberResponseDto>> {
        return this.conversationsService.getMembers(conversationId, pagination);
    }

    @Get()
    @ApiOperation({ summary: 'Get conversations of a user with pagination' })
    @ApiOkResponse({
        description: 'Paginated conversations',
        type: PaginatedResponseDto(ConversationMemberResponseDto),
    })
    async getConversationsByUser(
        @ActiveUser() user: ActiveUserData,
        @Query() pagination: PaginationQueryDto,
    ) {
        return this.conversationsService.getConversationsByUser(
            user.id,
            pagination,
        );
    }

    @ApiOperation({ summary: 'Get conversation by id' })
    @ApiOkResponse({ type: ConversationResponseDto })
    @Get(':id')
    async getConversationById(
        @Param('id', ParseUUIDPipe) id: string,
        @ActiveUser() user: ActiveUserData,
    ) {
        return this.conversationsService.getConversationById(id, user.id);
    }

    @Delete(':conversationId')
    @ApiOperation({ summary: 'Delete a conversation (only creator/admin)' })
    @ApiResponse({ status: 200, description: 'Conversation deleted successfully' })
    async deleteConversation(
        @Param('conversationId') conversationId: string,
    ) {
        return this.conversationsService.deleteConversation(conversationId);
    }

    @Post(':conversationId/read')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Mark all unread messages in a conversation as read' })
    @ApiParam({ name: 'conversationId', type: String, description: 'Conversation ID' })
    @ApiResponse({ status: 200, description: 'Successfully marked as read' })
    @ApiResponse({ status: 401, description: 'Unauthorized or invalid token' })
    @ApiResponse({ status: 404, description: 'Conversation not found' })
    async markAsRead(
        @Param('conversationId') conversationId: string,
        @ActiveUser() user: ActiveUserData,
    ) {
        const count = await this.messageService.markConversationAsRead(conversationId, user.id);
        return { success: true, markedCount: count };
    }

    @Post(':conversationId/unread')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Mark all messages in a conversation as unread' })
    @ApiParam({ name: 'conversationId', type: String, description: 'Conversation ID' })
    @ApiResponse({ status: 200, description: 'Successfully marked as unread' })
    @ApiResponse({ status: 401, description: 'Unauthorized or invalid token' })
    @ApiResponse({ status: 404, description: 'Conversation not found' })
    async markAsUnread(
        @Param('conversationId') conversationId: string,
        @ActiveUser() user: ActiveUserData,
    ) {
        const count = await this.messageService.markConversationAsUnread(conversationId, user.id);
        return { success: true, markedCount: count };
    }


}
