import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  ClassSerializerInterceptor,
  Query,
  UseGuards,
  Param,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiOperation,
  ApiQuery,
  ApiNotFoundResponse,
  ApiParam,
} from '@nestjs/swagger';

import { ActiveUser } from '@/common/decorators/active-user.decorator';
import { Public } from '@/common/decorators/public.decorator';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { ResendVerificationDto } from './dto/resend-verification.dto';
import { ActiveUserData } from '@/common/interfaces/active-user-data.interface';

@ApiTags('users')
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @ApiOperation({
    summary: 'Register new account',
    description: 'Create new user and send verification email via RabbitMQ'
  })
  @ApiCreatedResponse({
    description: 'User registered successfully (verification email sent)',
    type: UserResponseDto
  })
  @ApiBadRequestResponse({ description: 'Invalid email/password format' })
  @ApiConflictResponse({ description: 'Email already registered' })
  @Public()
  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  async createUser(
    @Body() createUserDto: CreateUserDto
  ): Promise<UserResponseDto> {
    return this.usersService.createUser(createUserDto);
  }


  @ApiOperation({ summary: 'Verify email address' })
  @ApiOkResponse({
    description: 'Email verified successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Email successfully verified' }
      }
    }
  })
  @ApiBadRequestResponse({
    description: 'Invalid/expired token or already verified'
  })
  @ApiQuery({
    name: 'token',
    required: true,
    example: 'a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8'
  })
  @Public()
  @Get('verify-email')
  async verifyEmail(
    @Query('token') token: string
  ): Promise<{ message: string }> {
    return this.usersService.verifyEmail(token);
  }

  @ApiOperation({ summary: 'Resend verification email' })
  @ApiOkResponse({
    description: 'New verification email sent',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Verification email resent successfully' }
      }
    }
  })
  @ApiBadRequestResponse({
    description: 'Email not found or already verified'
  })
  @Public()
  @Post('resend-verification')
  @HttpCode(HttpStatus.OK)
  async resendVerification(
    @Body() { email }: ResendVerificationDto
  ): Promise<{ message: string }> {
    return this.usersService.resendVerificationEmail(email);
  }

  @ApiOperation({
    summary: 'Get current user profile',
    description: 'Requires valid access token'
  })
  @ApiOkResponse({
    description: 'Return user profile data',
    type: UserResponseDto
  })
  @ApiUnauthorizedResponse({ description: 'Invalid/expired token' })
  @ApiBearerAuth()
  @Get('me')
  async getMe(
    @ActiveUser() user: ActiveUserData,
  ): Promise<UserResponseDto> {
    return this.usersService.findUserById(user.id);
  }

  @ApiOperation({
    summary: 'Get user profile by ID',
    description: 'Fetch a user profile by its ID'
  })
  @ApiOkResponse({
    description: 'Return user profile data',
    type: UserResponseDto
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'UUID of the user',
    example: 'd8f2a3c9-f1f1-451d-9f97-ab0bd53ba8bc'
  })
  @Get(':id')
  async getUserById(
    @Param('id') id: string,
  ): Promise<UserResponseDto> {
    return this.usersService.findUserById(id);
  }
}