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

// import { Injectable, Inject, Logger, OnModuleInit } from '@nestjs/common';
// import { ClientProxy } from '@nestjs/microservices';
// import { lastValueFrom } from 'rxjs';
// import { RecommendationsService } from './recommendations.service';

// @Injectable()
// export class RecommendationProducer implements OnModuleInit {
//     private readonly logger = new Logger(RecommendationProducer.name);

//     constructor(
//         @Inject('RECOMMENDATION_QUEUE') private readonly client: ClientProxy,
//         private readonly recommendationService: RecommendationsService,
//     ) { }

//     async onModuleInit() {
//         try {
//             await this.client.connect();
//             this.logger.log('Connected to RabbitMQ');
//         } catch (error) {
//             this.logger.error('Failed to connect to RabbitMQ', error);
//         }
//     }

//     async enqueueSyncJobs(
//         userIds: string[],
//         algorithm = 'common_neighbors',
//         topN = 5,
//     ) {
//         this.logger.log(`Sending sync jobs for ${userIds.length} users`);

//         try {
//             const results = await lastValueFrom(
//                 this.client.send('sync-user-recommendations', { userIds, algorithm, topN }),
//             );

//             this.logger.log("results: ", results)

//             // results dạngg: { userId: Recommendation[] }
//             for (const userId of Object.keys(results)) {
//                 const recs = results[userId];
//                 this.logger.log(`Got ${recs.length} recommendations for user ${userId}`);
//                 await this.recommendationService.storeRecommendations(userId, recs);
//             }
//         } catch (error) {
//             this.logger.error(`Failed to get recommendations for users`, error);
//         }
//     }


// }
