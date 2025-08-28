import { Controller, Post, Get, Patch, Param, Body, UseInterceptors, UploadedFiles, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { MessagesService } from '../services/messages.service';
import { UpdateMessageStatusDto } from '../dtos/update-message-status.dto';
import { ActiveUser } from '@/common/decorators/active-user.decorator';
import { ActiveUserData } from '@/common/interfaces/active-user-data.interface';
import { FilesInterceptor } from '@nestjs/platform-express';
import { MessageReadDto, MessageResponseDto } from '../dtos/message-response.dto';
import { PaginatedResponseDto } from '@/common/dtos/paginated-response.factory';
import { PaginationQueryDto } from '@/common/dtos/pagination-query.dto';

@ApiTags('Messages')
@Controller('messages')
export class MessagesController {
    constructor(private readonly messagesService: MessagesService) { }

    @Post()
    @UseInterceptors(FilesInterceptor('files'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Send a message with optional attachments',
        schema: {
            type: 'object',
            properties: {
                conversationId: { type: 'string', example: 'uuid-conversation-id' },
                content: { type: 'string', example: 'Hello there!' },
                files: {
                    type: 'array',
                    items: {
                        type: 'string',
                        format: 'binary',
                    },
                },
            },
        },
    })
    async sendMessage(
        @ActiveUser() user: ActiveUserData,
        @Body() dto: any,
        @UploadedFiles() files?: Express.Multer.File[],
    ): Promise<MessageResponseDto> {
        return this.messagesService.sendMessage(user.id, dto, files);
    }

    @Get('conversation/:conversationId')
    @ApiOperation({ summary: 'Get all messages in a conversation' })
    @ApiOkResponse({
        description: 'Paginated list of messages',
        type: PaginatedResponseDto(MessageResponseDto),
    })
    async getMessages(
        @Param('conversationId') conversationId: string,
        @Query() pagination: PaginationQueryDto
    ) {
        return this.messagesService.getMessages(conversationId, pagination);
    }

    @Patch(':messageId/status')
    @ApiOperation({ summary: 'Update status of a message (READ/DELIVERED)' })
    @ApiResponse({ status: 200, description: 'Message status updated', type: MessageResponseDto })
    updateStatus(
        @Param('messageId') messageId: string,
        @Body() dto: UpdateMessageStatusDto,
    ) {
        return this.messagesService.updateStatus(messageId, dto);
    }

    @Post(':messageId/read')
    @ApiOperation({ summary: 'Mark a single message as read' })
    @ApiOkResponse({
        description: 'Message marked as read successfully',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean', example: true },
            },
        },
    })
    async readMessage(
        @Param('messageId') messageId: string,
        @ActiveUser() user: ActiveUserData
    ) {
        return this.messagesService.markMessageAsRead(user.id, messageId);
    }

    @Get(':id/reads')
    @ApiOperation({ summary: 'Get list of users who have read a message' })
    @ApiOkResponse({
        description: 'List of users who have read the message',
        type: [MessageReadDto],
    })
    async getMessageReads(
        @Param('id') messageId: string,
    ): Promise<MessageReadDto[]> {
        return this.messagesService.getMessageReads(messageId);
    }

    @Get('unread/count')
    @ApiOperation({ summary: 'Get total unread messages of current user' })
    @ApiOkResponse({
        description: 'Total unread messages',
        schema: {
            type: 'object',
            properties: {
                count: { type: 'number', example: 12 },
            },
        },
    })
    async getUnreadCount(
        @ActiveUser() user: ActiveUserData
    ) {
        const count = await this.messagesService.countUnreadMessages(user.id);
        return { count };
    }

    @Get('unread/:conversationId')
    @ApiOperation({ summary: 'Get unread message IDs for the current user in a conversation' })
    @ApiOkResponse({ type: [String] })
    async getUnreadMessageIds(
        @ActiveUser() user: ActiveUserData,
        @Param('conversationId') conversationId: string
    ): Promise<string[]> {
        return this.messagesService.getUnreadMessageIdsForUserInConversation(user.id, conversationId);
    }

}
