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
import { SignInDto } from './dto/sign-in.dto';
import { TokensResponseDto } from './dto/tokens-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly bcryptService: BcryptService,
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new BadRequestException('Invalid old token');
    return this.generateTokens(user);
  }

  private async generateTokens(user: Partial<User>) {
    const tokenId = randomUUID();
    await this.redisService.insert(`user-${user.id}`, tokenId);

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
          expiresIn: this.configService.get<string>('jwt.accessTokenTtl'),
        },
      ),
      this.jwtService.signAsync(
        { id: user.id, tokenId } as Pick<ActiveUserData, 'id' | 'tokenId'>,
        {
          secret: this.configService.get<string>('jwt.refreshSecret'),
          expiresIn: this.configService.get<string>('jwt.refreshTokenTtl'),
        },
      ),
    ]);

    return { accessToken, refreshToken };
  }

  async validateUser(userName: string, password: string): Promise<Partial<User>> {
    const user = await this.userRepository.findOne({ where: { email: userName } });
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