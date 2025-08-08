import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Put } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ProfileResponseDto } from './dto/response-profile.dto';
import { ActiveUser } from '@/common/decorators/active-user.decorator';
import { ActiveUserData } from '@/common/interfaces/active-user-data.interface';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @ApiOperation({
    summary: 'Get current user profile',
    description: 'Get profile info of the currently authenticated user',
  })
  @ApiOkResponse({
    description: 'Profile fetched successfully',
    type: ProfileResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('me')
  @HttpCode(HttpStatus.OK)
  async getMyProfile(
    @ActiveUser() user: ActiveUserData,
  ): Promise<ProfileResponseDto> {
    return this.profilesService.getProfileByUserId(user.id);
  }

  @ApiOperation({
    summary: 'Update current user profile',
    description: 'Update profile info of the currently authenticated user',
  })
  @ApiOkResponse({
    description: 'Profile updated successfully',
    type: ProfileResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Profile not found' })
  @Put('me')
  @HttpCode(HttpStatus.OK)
  async updateMyProfile(
    @ActiveUser() user: ActiveUserData,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<ProfileResponseDto> {
    return this.profilesService.updateProfile(user.id, updateProfileDto);
  }

  @Get()
  findAll() {
    return this.profilesService.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.profilesService.remove(+id);
  }
}
