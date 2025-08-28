import { Controller, Post, Get, UseGuards, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { SavePostsService } from './save-posts.service';
import { ToggleSavePostDto } from './dtos/toggle-save-post.dto';
import { ActiveUser } from '@/common/decorators/active-user.decorator';
import { ActiveUserData } from '@/common/interfaces/active-user-data.interface';
import { PaginatedResponseDto } from '@/common/dtos/paginated-response.factory';
import { PostResponseDto } from '../posts/dtos/response-post.dto';
import { PaginationQueryDto } from '@/common/dtos/pagination-query.dto';
import { IPaginated } from '@/common/dtos/paginated.interface';

@ApiTags('save-posts')
@Controller('save-posts')
@UseGuards(JwtAuthGuard)
export class SavePostsController {
  constructor(private readonly savePostsService: SavePostsService) { }

  @Post('toggle')
  @ApiOperation({ summary: 'Toggle save/un-save a post' })
  async toggle(
    @ActiveUser() user: ActiveUserData,
    @Body() dto: ToggleSavePostDto,
  ) {
    return this.savePostsService.toggleSave(user.id, dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all saved posts of the current user' })
  @ApiOkResponse({ type: PaginatedResponseDto(PostResponseDto) })
  async getSavedPosts(
    @ActiveUser() user: ActiveUserData,
    @Query() pagination: PaginationQueryDto,
  ): Promise<IPaginated<PostResponseDto>> {
    return this.savePostsService.getSavedPosts(user.id, pagination);
  }
}
