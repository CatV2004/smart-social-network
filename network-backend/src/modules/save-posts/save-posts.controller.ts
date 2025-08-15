import { Controller, Post, Get, UseGuards, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { SavePostsService } from './save-posts.service';
import { ToggleSavePostDto } from './dto/toggle-save-post.dto';
import { ActiveUser } from '@/common/decorators/active-user.decorator';
import { ActiveUserData } from '@/common/interfaces/active-user-data.interface';

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
  @ApiOperation({ summary: 'Get all saved posts of the current user' })
  async getSavedPosts(@ActiveUser() user: ActiveUserData) {
    return this.savePostsService.getSavedPosts(user.id);
  }
}
