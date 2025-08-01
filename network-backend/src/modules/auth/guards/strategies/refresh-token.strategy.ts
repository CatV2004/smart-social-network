import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import jwtConfig from '@/common/config/jwt.config';
import { RefreshTokenDto } from '../../dto/refresh-token.dto';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'refresh-token') {
    constructor(
        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: jwtConfiguration.refreshSecret ?? (() => {
                throw new Error('JWT refresh secret is not defined');
            })(),
            passReqToCallback: true,
        });
    }

    async validate(req: Request, payload: RefreshTokenDto): Promise<RefreshTokenDto> {
        const refreshToken = req.get('Authorization')?.replace('Bearer', '').trim();
        if (!refreshToken) throw new UnauthorizedException('Refresh token missing');

        return { userId: payload.userId, tokenId: payload.tokenId }; // Trả về DTO
    }
}