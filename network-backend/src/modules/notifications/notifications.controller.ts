import {
  Controller,
  Get,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Body,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PaginatedNotificationDto } from './dto/paginated-notification.dto';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ActiveUser } from '@/common/decorators/active-user.decorator';
import { ActiveUserData } from '@/common/interfaces/active-user-data.interface';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationDto } from './dto/notification.dto';
import { PaginationQueryDto } from '@/common/dtos/pagination-query.dto';

@ApiTags('notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) { }

  /**
   * Lấy danh sách thông báo (có phân trang)
   */
  @Get()
  @ApiOkResponse({ type: PaginatedNotificationDto })
  async getNotifications(
    @Query() pagination: PaginationQueryDto,
    @ActiveUser() user: ActiveUserData,
  ): Promise<PaginatedNotificationDto> {
    return this.notificationsService.getForUser(pagination, user.id);
  }

  /**
   * Đếm số thông báo chưa đọc
   */
  @Get('unread-count')
  async countUnread(@ActiveUser() user: ActiveUserData) {
    return this.notificationsService.countUnread(user.id);
  }

  /**
   * Đánh dấu tất cả thông báo đã đọc
   */
  @Patch('mark-all-as-read')
  async markAllAsRead(@ActiveUser() user: ActiveUserData) {
    return this.notificationsService.markAllAsRead(user.id);
  }

  /**
   * Cập nhật 1 thông báo (đánh dấu đã đọc / update metadata)
   */
  @Patch(':id')
  @ApiOkResponse({ type: NotificationDto })
  async updateNotification(
    @Param('id') id: string,
    @Body() dto: UpdateNotificationDto,
  ) {
    return this.notificationsService.update(id, dto);
  }

  /**
   * Xóa thông báo
   */
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.notificationsService.remove(id);
  }
}
