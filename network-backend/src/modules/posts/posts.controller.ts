import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpCode, UseGuards, Query, BadRequestException, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { ApiBadRequestResponse, ApiBody, ApiConsumes, ApiCreatedResponse, ApiForbiddenResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiQuery, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Post as PostEntity } from './entities/post.entity';
import { ActiveUser } from '@/common/decorators/active-user.decorator';
import { ActiveUserData } from '@/common/interfaces/active-user-data.interface';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PostOwnerGuard } from './guards/post-owner.guard';
import { PaginationQueryDto } from '@/common/dtos/pagination-query.dto';
import { PaginatedResponseDto } from '@/common/dtos/paginated-response.factory';
import { PostResponseDto } from './dto/response-post.dto';
import { IPaginated } from '@/common/dtos/paginated.interface';
import { PostOwnerGuardForHardDeleteAndRestore } from './guards/post-owner-hard-restore.gaurd';
import { UpdatePostDto } from './dto/update-post.dto';
import { UpdateMediaDto } from '../media/dto/update-media.dto';
import { AnyFilesInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { PostEditResponseDto } from './dto/post-edit-response.dto';
import { plainToInstance } from 'class-transformer';

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

  @Patch(':id')
  @UseGuards(JwtAuthGuard, PostOwnerGuard)
  @UseInterceptors(FilesInterceptor('files'))
  async updatePost(
    @Param('id') id: string,
    @Body() dto: UpdatePostDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.postsService.updatePost(id, {
      ...dto,
      newMedia: files,
      mediaToUpdate: dto.mediaToUpdate?.map((m, index) => ({
        mediaId: m.mediaId,
        file: files[index],
      })),
    });
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

  @Get('deleted')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get soft-deleted posts with pagination' })
  @ApiOkResponse({ type: PaginatedResponseDto(PostResponseDto) })
  async getSoftDeletedPosts(
    @Query() pagination: PaginationQueryDto,
  ): Promise<IPaginated<PostResponseDto>> {
    return this.postsService.getSoftDeletedPosts(pagination);
  }

  @Patch(':id/restore')
  @UseGuards(JwtAuthGuard, PostOwnerGuardForHardDeleteAndRestore)
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
  @UseGuards(JwtAuthGuard, PostOwnerGuardForHardDeleteAndRestore)
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

  @Get('by-ids')
  @ApiOperation({ summary: 'Get posts by a list of IDs with pagination' })
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: PaginatedResponseDto(PostResponseDto) })
  async getByIds(
    @Query('ids') ids: string | string[],
    @Query() pagination: PaginationQueryDto,
    @ActiveUser() user: ActiveUserData,
  ): Promise<IPaginated<PostResponseDto>> {
    const idsArray: string[] = Array.isArray(ids)
      ? ids
      : typeof ids === 'string'
        ? ids.split(',')
        : [];

    return this.postsService.findByIds(idsArray, pagination, user.id);
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

  @Get('user/:username')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get posts by profileId with pagination' })
  @ApiOkResponse({ type: PaginatedResponseDto(PostResponseDto) })
  async getByUsername(
    @Param('username') username: string,
    @Query() pagination: PaginationQueryDto,
  ): Promise<IPaginated<PostResponseDto>> {
    return this.postsService.findByUserName(username, pagination);
  }

  @Get("saved")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all saved posts of the current user' })
  @ApiOkResponse({ type: PaginatedResponseDto(PostResponseDto) })
  async getSavedPosts(
    @ActiveUser() user: ActiveUserData,
    @Query() pagination: PaginationQueryDto,
  ): Promise<IPaginated<PostResponseDto>> {
    return this.postsService.getSavedPosts(user.id, pagination);
  }

  @Get(':id/edit')
  @ApiOkResponse({ type: PostEditResponseDto })
  @ApiNotFoundResponse({ description: 'Post not found' })
  async getPostForEdit(@Param('id') id: string): Promise<PostEditResponseDto> {
    const post = await this.postsService.findByIdWithRelations(id, ['media']);
    return plainToInstance(PostEditResponseDto, post, { excludeExtraneousValues: true });
  }
}
