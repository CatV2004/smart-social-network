import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpCode, UseGuards, Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { ApiBadRequestResponse, ApiBody, ApiCreatedResponse, ApiForbiddenResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Post as PostEntity } from './entities/post.entity';
import { ActiveUser } from '@/common/decorators/active-user.decorator';
import { ActiveUserData } from '@/common/interfaces/active-user-data.interface';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PostOwnerGuard } from './guards/post-owner.guard';
import { PaginationQueryDto } from '@/common/dtos/pagination-query.dto';
import { PaginatedResponseDto } from '@/common/dtos/paginated-response.factory';
import { PostResponseDto } from './dto/response-post.dto';
import { IPaginated } from '@/common/dtos/paginated.interface';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new post',
    description: 'Create a new post with optional content. Media can be uploaded after.',
  })
  @ApiBody({ type: CreatePostDto })
  @ApiCreatedResponse({
    description: 'Post created successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Post created successfully' },
        postId: { type: 'string', format: 'uuid', example: '550e8400-e29b-41d4-a716-446655440000' },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async createPost(
    @Body() dto: CreatePostDto,
    @ActiveUser() user: ActiveUserData,
  ): Promise<{ message: string; postId: string }> {
    const post = await this.postsService.create(dto, user.id);
    return {
      message: 'Post created successfully',
      postId: post.id,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PostOwnerGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Soft delete a post',
    description: 'Marks the post as deleted without removing it from the database.',
  })
  @ApiNoContentResponse({ description: 'Post soft-deleted successfully' })
  @ApiNotFoundResponse({ description: 'Post not found' })
  async deletePost(@Param('id') id: string): Promise<void> {
    await this.postsService.softDelete(id);
  }

  @Patch(':id/restore')
  @UseGuards(JwtAuthGuard, PostOwnerGuard)
  @ApiOperation({
    summary: 'Restore a soft-deleted post',
    description: 'Restores a post that was previously soft-deleted.',
  })
  @ApiOkResponse({
    description: 'Post restored successfully',
    type: PostEntity,
  })
  @ApiNotFoundResponse({ description: 'Post not found' })
  async restorePost(@Param('id') id: string) {
    return this.postsService.restorePost(id);
  }

  @Delete(':id/hard')
  @UseGuards(PostOwnerGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Permanently delete a post',
    description: 'Completely removes the post from the database. This action cannot be undone.',
  })
  @ApiNoContentResponse({ description: 'Post permanently deleted successfully' })
  @ApiNotFoundResponse({ description: 'Post not found' })
  @ApiForbiddenResponse({ description: 'Forbidden - Only admins can hard delete posts' })
  async hardDeletePost(@Param('id') id: string) {
    return this.postsService.hardDeletePost(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all posts with pagination' })
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: PaginatedResponseDto(PostResponseDto) })
  async getAll(
    @Query() pagination: PaginationQueryDto,
    @ActiveUser() user: ActiveUserData
  ): Promise<IPaginated<PostResponseDto>> {
    return this.postsService.findAll(pagination, user.id);
  }

  @Get('profile/:profileId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get posts by profileId with pagination' })
  @ApiOkResponse({ type: PaginatedResponseDto(PostResponseDto) })
  async getByProfile(
    @Param('profileId') profileId: string,
    @Query() pagination: PaginationQueryDto,
  ): Promise<IPaginated<PostResponseDto>> {
    return this.postsService.findByProfileId(profileId, pagination);
  }
}
