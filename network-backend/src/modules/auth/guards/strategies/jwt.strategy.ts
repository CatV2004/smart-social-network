import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import jwtConfig from '@/common/config/jwt.config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ActiveUserData } from '@/common/interfaces/active-user-data.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtConfiguration.secret ?? (() => {
                throw new Error('JWT secret is not defined');
            })(),
        });
    }

    async validate(payload: ActiveUserData): Promise<ActiveUserData> {
        return {
            id: payload.id,
            email: payload.email,
            role: payload.role,
            tokenId: payload.tokenId,
        };
    }
}
