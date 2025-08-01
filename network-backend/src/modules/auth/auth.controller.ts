import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Request } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { ActiveUser } from '@/common/decorators/active-user.decorator';
import { Public } from '@/common/decorators/public.decorator';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { TokensResponseDto } from './dto/tokens-response.dto';
import { AuthGuard } from '@nestjs/passport';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @ApiOperation({ summary: "Post access-token (sign-up account)" })
  @ApiBadRequestResponse({
    description: 'Return errors for invalid sign in fields',
  })
  @ApiOkResponse({ type: TokensResponseDto })
  @ApiBody({ type: SignInDto })
  @HttpCode(HttpStatus.OK)
  @Public()
  @UseGuards(AuthGuard('local'))
  @Post('sign-in')
  signIn(@Request() req): Promise<TokensResponseDto> {
    return this.authService.signIn(req.user);
  }

  @ApiOperation({ summary: "Sign-out account" })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOkResponse({ description: 'User has been successfully signed out' })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Post('sign-out')
  signOut(@ActiveUser('id') userId: string): Promise<void> {
    return this.authService.signOut(userId);
  }

  @ApiOperation({ summary: "Post refresh token" })
  @Public()
  @Post('refresh')
  @UseGuards(AuthGuard('refresh-token'))
  @ApiOkResponse({ type: TokensResponseDto })
  async refreshToken(
    @ActiveUser() payload: RefreshTokenDto,
  ): Promise<TokensResponseDto> {
    return this.authService.refreshToken(payload.userId, payload.tokenId);
  }

}