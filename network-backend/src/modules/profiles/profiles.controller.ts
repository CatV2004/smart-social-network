import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Put, ParseUUIDPipe, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { ApiBadRequestResponse, ApiBody, ApiConsumes, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ProfileResponseDto } from './dtos/response-profile.dto';
import { ActiveUser } from '@/common/decorators/active-user.decorator';
import { ActiveUserData } from '@/common/interfaces/active-user-data.interface';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { UpdateProfileImageDto } from './dtos/update-profile-image.dto';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) { }

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
    summary: 'Get profile by user ID',
    description: 'Get profile info by userID',
  })
  @ApiOkResponse({
    description: 'Profile fetched successfully',
    type: ProfileResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get(':userId')
  @HttpCode(HttpStatus.OK)
  async getProfileById(
    @Param('userId', new ParseUUIDPipe({ version: '4' })) userId: string
  ): Promise<ProfileResponseDto> {
    return this.profilesService.getProfileByUserId(userId);
  }

  @ApiOperation({
    summary: 'Get profile by user username',
    description: 'Get profile info by username',
  })
  @ApiOkResponse({
    description: 'Profile fetched successfully',
    type: ProfileResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('user/:username')
  @HttpCode(HttpStatus.OK)
  async getProfileByUsername(
    @Param('username') username: string,
    @ActiveUser() user: ActiveUserData
  ): Promise<ProfileResponseDto> {
    return this.profilesService.getProfileByUsername(username, user.id);
  }

  @Put('me')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'avatar', maxCount: 1 },
      { name: 'coverImage', maxCount: 1 },
    ]),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Update profile with optional files',
    schema: {
      type: 'object',
      properties: {
        bio: { type: 'string' },
        location: { type: 'string' },
        dateOfBirth: { type: 'string', format: 'date' },
        gender: { type: 'string', enum: ['MALE', 'FEMALE', 'OTHER'] },
        phoneNumber: { type: 'string' },
        website: { type: 'string' },
        facebook: { type: 'string' },
        linkedin: { type: 'string' },
        github: { type: 'string' },
        isPrivate: { type: 'boolean' },
        avatar: { type: 'string', format: 'binary' },
        coverImage: { type: 'string', format: 'binary' },
      },
    },
  })
  async updateMyProfile(
    @ActiveUser() user: ActiveUserData,
    @UploadedFiles()
    files: {
      avatar?: Express.Multer.File[];
      coverImage?: Express.Multer.File[];
    },
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<ProfileResponseDto> {
    return this.profilesService.updateProfile(
      user.id,
      updateProfileDto,
      files,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.profilesService.remove(+id);
  }

  // @Put('upload-image')
  // @UseInterceptors(FileInterceptor('file'))
  // @ApiConsumes('multipart/form-data')
  // @ApiBody({
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       type: { type: 'string', enum: ['avatar', 'cover'] },
  //       file: { type: 'string', format: 'binary' },
  //     },
  //   },
  // })
  // async uploadProfileImage(
  //   @ActiveUser() user: ActiveUserData,
  //   @UploadedFile() file: Express.Multer.File,
  //   @Body() dto: UpdateProfileImageDto,
  // ): Promise<ProfileResponseDto> {
  //   return this.profilesService.updateProfileImage(user.id, file, dto);
  // }
}
