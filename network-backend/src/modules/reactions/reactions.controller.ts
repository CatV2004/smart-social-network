import { Controller, Post as HttpPost, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ReactionsService } from './reactions.service';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { ActiveUser } from '@/common/decorators/active-user.decorator';
import { ActiveUserData } from '@/common/interfaces/active-user-data.interface';
import { ToggleReactionPostDto } from '@/modules/reactions/dto/toggle-reaction-post.dto';

@ApiTags('Reactions')
@ApiBearerAuth()
@Controller('reactions')
@UseGuards(JwtAuthGuard)
export class ReactionsController {
  constructor(private readonly reactionsService: ReactionsService) { }

  @HttpPost('posts/toggle')
  @ApiOperation({ summary: 'Toggle reaction for a post' })
  async togglePostReaction(
    @ActiveUser() user: ActiveUserData,
    @Body() dto: ToggleReactionPostDto
  ) {
    return this.reactionsService.togglePostReaction(user.id, dto);
  }
}
