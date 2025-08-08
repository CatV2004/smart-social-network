import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';
import { ActiveUserData } from '@/common/interfaces/active-user-data.interface';
import { RedisService } from '@/redis/redis.service';
import { User } from '@/modules/users/entities/user.entity';
import { BcryptService } from './bcrypt.service';
import { TokensResponseDto } from './dto/tokens-response.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly bcryptService: BcryptService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly redisService: RedisService,
  ) { }

  signIn(user: Partial<User>): Promise<TokensResponseDto> {
    return this.generateTokens(user);
  }

  async signOut(userId: string): Promise<void> {
    await this.redisService.delete(`user-${userId}`);
  }

  async refreshToken(userId: string, oldTokenId: string): Promise<TokensResponseDto> {
    await this.redisService.validate(`user-${userId}`, oldTokenId);
    const user = await this.usersService.findById(userId);
    if (!user) throw new BadRequestException('Invalid old token');
    return this.generateTokens(user);
  }

  private async generateTokens(user: Partial<User>): Promise<TokensResponseDto> {
    const tokenId = randomUUID();
    await this.redisService.insert(`user-${user.id}`, tokenId);

    const accessTokenExpiresIn = Number(this.configService.get('jwt.accessTokenTtl') || 3600);
    const refreshTokenExpiresIn = Number(this.configService.get('jwt.refreshTokenTtl') || 86400);


    const accessTokenExpiresText = this.configService.get<string>('jwt.expiresIn'); // e.g. "15m"
    const refreshTokenExpiresText = this.configService.get<string>('jwt.refreshExpiresIn'); // e.g. "7d"

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          id: user.id,
          email: user.email,
          role: user.role,
          tokenId,
        } as ActiveUserData,
        {
          secret: this.configService.get<string>('jwt.secret'),
          expiresIn: accessTokenExpiresText,
        },
      ),
      this.jwtService.signAsync(
        { id: user.id, tokenId } as Pick<ActiveUserData, 'id' | 'tokenId'>,
        {
          secret: this.configService.get<string>('jwt.refreshSecret'),
          expiresIn: refreshTokenExpiresText,
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
      accessTokenExpiresIn,
      refreshTokenExpiresIn,
    };
  }

  async validateUser(userName: string, password: string): Promise<Partial<User>> {
    const user = await this.usersService.findByUsername(userName);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isPasswordValid = await this.bcryptService.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    if (!user.isActive) {
      throw new ForbiddenException('Your account is inactive. Please contact support.');
    }

    if (!user.isVerified) {
      throw new ForbiddenException('Email not verified. Please check your email.');
    }

    const { password: _, ...result } = user;
    return result;
  }

}

function Inject(KEY: string | symbol): (target: typeof AuthService, propertyKey: undefined, parameterIndex: 1) => void {
  throw new Error('Function not implemented.');
}
