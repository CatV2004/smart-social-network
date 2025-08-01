import { Inject, Injectable, Logger } from '@nestjs/common';
import { Redis } from 'ioredis';

import { IORedisKey } from '@/redis/redis.constants';

@Injectable()
export class RedisService {
    private readonly logger = new Logger(RedisService.name);
    constructor(
        @Inject(IORedisKey)
        private readonly redisClient: Redis,
    ) { }

    async getKeys(pattern = '*'): Promise<string[]> {
        try {
            return await this.redisClient.keys(pattern);
        } catch (err) {
            this.logger.error(`Error getting keys with pattern ${pattern}`, err);
            return [];
        }
    }

    async insert(key: string, value: string | number): Promise<void> {
        await this.redisClient.set(key, value);
    }

    async get(key: string): Promise<string | null> {
        try {
            return await this.redisClient.get(key);
        } catch (err) {
            this.logger.error(`Error getting key ${key}`, err);
            return null;
        }
    }

    async delete(key: string): Promise<void> {
        await this.redisClient.del(key);
    }

    async validate(key: string, value: string): Promise<boolean> {
        const storedValue = await this.redisClient.get(key);
        return storedValue === value;
    }
}