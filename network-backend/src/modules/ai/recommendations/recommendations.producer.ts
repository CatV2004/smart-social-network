import { Injectable, Inject, Logger, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class RecommendationProducer implements OnModuleInit {
    private readonly logger = new Logger(RecommendationProducer.name);

    constructor(
        @Inject('RECOMMENDATION_QUEUE') private readonly client: ClientProxy,
    ) { }

    async onModuleInit() {
        try {
            await this.client.connect();
            this.logger.log('Connected to RabbitMQ');
        } catch (error) {
            this.logger.error('Failed to connect to RabbitMQ', error);
        }
    }

    async enqueueSyncJob(userId: string) {
        this.logger.log(`Enqueuing sync job for user ${userId}`);
        try {
            // Chuyển Observable sang Promise và await
            await lastValueFrom(this.client.emit('sync-user-recommendations', { userId }));
            this.logger.log(`Job enqueued successfully for user ${userId}`);
        } catch (error) {
            // Bắt mọi lỗi emit
            this.logger.error(`Failed to enqueue job for user ${userId}`, error);
        }
    }
}
