import { Global, Module, OnApplicationShutdown, Scope } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ModuleRef } from '@nestjs/core';
import { Redis } from 'ioredis';

import { IORedisKey } from '@/redis/redis.constants';
import { RedisService } from '@/redis/redis.service';

@Global()
@Module({
    imports: [ConfigModule],
    providers: [
        {
            provide: IORedisKey,
            useFactory: async (configService: ConfigService) => {
                return new Redis({
                    host: configService.get<string>('REDIS_HOST'),
                    port: configService.get<number>('REDIS_PORT'),
                    password: configService.get<string>('REDIS_PASSWORD'),
                    db: configService.get<number>('REDIS_DATABASE'),
                });
            },
            inject: [ConfigService],
        },
        RedisService,
    ],
    exports: [RedisService],
})
export class RedisModule implements OnApplicationShutdown {
    constructor(private readonly moduleRef: ModuleRef) { }

    async onApplicationShutdown(signal?: string): Promise<void> {
        return new Promise<void>((resolve) => {
            const redis = this.moduleRef.get(IORedisKey);
            redis.quit();
            redis.on('end', () => {
                resolve();
            });
        });
    }
}