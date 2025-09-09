import { Injectable, Inject, Logger, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class PredictionProducer implements OnModuleInit {
    private readonly logger = new Logger(PredictionProducer.name);

    constructor(
        @Inject('PREDICTION_QUEUE') private readonly client: ClientProxy,
    ) { }

    async onModuleInit() {
        try {
            await this.client.connect();
            this.logger.log('Connected to RabbitMQ');
        } catch (error) {
            this.logger.error('Failed to connect to RabbitMQ', error);
        }
    }

    async enqueuePredictionJob(postId: string) {
        this.logger.log(`Enqueuing prediction job for post ${postId}`);
        try {
            await lastValueFrom(this.client.emit('analyze-post', { postId }));
            this.logger.log(`Prediction job enqueued successfully for post ${postId}`);
        } catch (error) {
            this.logger.error(`Failed to enqueue prediction job for post ${postId}`, error);
        }
    }
}
