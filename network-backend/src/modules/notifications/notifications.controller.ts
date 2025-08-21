import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PaginatedNotificationDto } from './dto/paginated-notification.dto';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ActiveUser } from '@/common/decorators/active-user.decorator';
import { ActiveUserData } from '@/common/interfaces/active-user-data.interface';
@ApiTags('notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) { }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: PaginatedNotificationDto })
  async getNotifications(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @ActiveUser() user: ActiveUserData,

  ): Promise<PaginatedNotificationDto> {
    return this.notificationsService.getForUser(user.id, { page, limit });
  }
}
