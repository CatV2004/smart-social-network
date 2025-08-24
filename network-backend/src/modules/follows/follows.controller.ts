import {
  Controller,
  Post,
  Patch,
  Delete,
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
  ApiForbiddenResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiQuery,
} from '@nestjs/swagger';

import { FollowsService } from './follows.service';
import { ActiveUser } from '@/common/decorators/active-user.decorator';
import { ActiveUserData } from '@/common/interfaces/active-user-data.interface';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FollowProfileResponseDto } from './dto/follow-profile-response.dto';
import { IPaginated } from '@/common/dtos/paginated.interface';

@ApiTags('follows')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('follows')
export class FollowsController {
  constructor(private readonly followsService: FollowsService) { }

  @ApiOperation({ summary: 'Send a follow request to a user' })
  @ApiOkResponse({ description: 'Follow request sent successfully' })
  @ApiBadRequestResponse({ description: 'Cannot follow yourself' })
  @ApiConflictResponse({ description: 'Follow request already exists' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Post(':userId')
  @HttpCode(HttpStatus.OK)
  async follow(
    @ActiveUser() user: ActiveUserData,
    @Param('userId') userId: string,
  ) {
    return this.followsService.requestFollow(user.id, userId);
  }

  @ApiOperation({ summary: 'Accept a follow request' })
  @ApiOkResponse({ description: 'Follow request accepted successfully' })
  @ApiForbiddenResponse({ description: 'Not allowed to accept this request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Patch(':followId/accept')
  @HttpCode(HttpStatus.OK)
  async accept(
    @ActiveUser() user: ActiveUserData,
    @Param('followId') followId: string,
  ) {
    return this.followsService.acceptFollowRequest(followId, user.id);
  }

  @ApiOperation({ summary: 'Reject a follow request' })
  @ApiOkResponse({ description: 'Follow request rejected successfully' })
  @ApiForbiddenResponse({ description: 'Not allowed to reject this request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Delete(':followId/reject')
  @HttpCode(HttpStatus.OK)
  async reject(
    @ActiveUser() user: ActiveUserData,
    @Param('followId') followId: string,
  ) {
    return this.followsService.rejectFollowRequest(followId, user.id);
  }

  @ApiOperation({ summary: 'Unfollow a user' })
  @ApiOkResponse({ description: 'Unfollowed successfully' })
  @ApiNotFoundResponse({ description: 'Follow relationship not found' })
  @Delete(':userId/unfollow')
  @HttpCode(HttpStatus.OK)
  async unfollow(
    @ActiveUser() user: ActiveUserData,
    @Param('userId') userId: string,
  ) {
    return this.followsService.unfollow(user.id, userId);
  }

  @ApiOperation({ summary: 'Get all users who follow the current user' })
  @ApiOkResponse({ description: 'List of followers returned' })
  @Get('followers')
  async getFollowers(
    @ActiveUser() user: ActiveUserData,
  ): Promise<FollowProfileResponseDto[]> {
    return this.followsService.getFollowers(user.id);
  }

  @ApiOperation({ summary: 'Get all users the current user is following' })
  @ApiOkResponse({ description: 'List of followings returned' })
  @Get('following')
  async getFollowing(
    @ActiveUser() user: ActiveUserData,
  ): Promise<FollowProfileResponseDto[]> {
    return this.followsService.getFollowing(user.id);
  }

  @ApiOperation({ summary: 'Get all follow requests I have sent (PENDING)' })
  @ApiOkResponse({ description: 'List of users I requested to follow' })
  @Get('sent-requests')
  async getSentFollowRequests(
    @ActiveUser() user: ActiveUserData,
  ): Promise<FollowProfileResponseDto[]> {
    return this.followsService.getSentFollowRequests(user.id);
  }

  @ApiOperation({ summary: 'Get all follow requests sent to me (PENDING)' })
  @ApiOkResponse({ description: 'Paginated list of users requesting to follow me' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @Get('received-requests')
  async getReceivedFollowRequests(
    @ActiveUser() user: ActiveUserData,
    @Query('page', new ParseIntPipe({ errorHttpStatusCode: 400 })) page = 1,
    @Query('limit', new ParseIntPipe({ errorHttpStatusCode: 400 })) limit = 10,
  ): Promise<IPaginated<FollowProfileResponseDto>> {
    return this.followsService.getReceivedFollowRequests(user.id, page, limit);
  }
}
