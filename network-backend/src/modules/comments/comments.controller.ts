import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
  Get,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiCreatedResponse,
  ApiQuery,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { ActiveUser } from '@/common/decorators/active-user.decorator';
import { ActiveUserData } from '@/common/interfaces/active-user-data.interface';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { CommentsService } from './comments.service';
import { CommentResponseDto } from './dtos/comment-response.dto';
import { PaginatedCommentResponseDto } from './dtos/paginated-comment-response.dto';

@ApiTags('comments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) { }

  @ApiOperation({ summary: 'Create a new comment on a post' })
  @ApiCreatedResponse({
    description: 'Comment created successfully',
  })
  @ApiBadRequestResponse({
    description: 'Invalid request payload',
  })
  @ApiNotFoundResponse({
    description: 'Post or parent comment not found',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createComment(
    @ActiveUser() user: ActiveUserData,
    @Body() dto: CreateCommentDto,
  ): Promise<CommentResponseDto> {
    return this.commentsService.create(dto, user.id);
  }

  @Get("post/:postId")
  @ApiOperation({ summary: "Get top-level comments of a post" })
  @ApiOkResponse({ type: PaginatedCommentResponseDto })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number, default 1' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page, default 4' })
  async getTopLevelComments(
    @Param("postId") postId: string,
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 4,
  ): Promise<PaginatedCommentResponseDto> {
    return this.commentsService.findTopLevelByPostId(postId, page, limit);
  }

  @Get(':parentCommentId/replies')
  @ApiOperation({ summary: 'Get replies (child comments) of a parent comment' })
  @ApiOkResponse({ type: PaginatedCommentResponseDto })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number, default 1' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page, default 4' })
  async getReplies(
    @Param('parentCommentId') parentCommentId: string,
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 4,
  ): Promise<PaginatedCommentResponseDto> {
    return this.commentsService.findRepliesByParentId(parentCommentId, page, limit);
  }



}
