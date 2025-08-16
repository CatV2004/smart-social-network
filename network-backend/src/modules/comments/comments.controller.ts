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
} from '@nestjs/swagger';

import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { ActiveUser } from '@/common/decorators/active-user.decorator';
import { ActiveUserData } from '@/common/interfaces/active-user-data.interface';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentsService } from './comments.service';
import { CommentResponseDto } from './dto/comment-response.dto';
import { PaginatedCommentResponseDto } from './dto/paginated-comment-response.dto';

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
  async getTopLevelComments(
    @Param("postId") postId: string,
    @Query("page") page = 1,
    @Query("limit") limit = 4,
  ): Promise<PaginatedCommentResponseDto> {
    return this.commentsService.findTopLevelByPostId(postId, +page, +limit);
  }

}
