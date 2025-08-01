import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { BcryptService } from './bcrypt.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { RedisModule } from '@/redis/redis.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './guards/strategies/jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './guards/roles.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { RefreshTokenStrategy } from './guards/strategies/refresh-token.strategy';
import { LocalStrategy } from './guards/strategies/local.strategy';


@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => UsersModule),
    PassportModule,
    RedisModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: { expiresIn: configService.get<string>('jwt.accessTokenTtl') },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, BcryptService, JwtStrategy, RefreshTokenStrategy, LocalStrategy,
    {
      provide: APP_GUARD,
      useClass: RolesGuard, 
    },
  ],
  exports: [JwtModule, BcryptService],
})
export class AuthModule { }