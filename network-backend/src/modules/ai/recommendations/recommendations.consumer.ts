import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { RecommendationsService } from './recommendations.service';

@Controller()
export class RecommendationsConsumer {
    private readonly logger = new Logger(RecommendationsConsumer.name);

    constructor(
        private readonly recommendationsService: RecommendationsService,
    ) {
        this.logger.log('RecommendationsConsumer initialized');
    }

    @EventPattern('sync-user-recommendations')
    async handleSyncUser(@Payload() data: { userId: string }) {
        this.logger.log(`Processing sync for user ${data.userId}`);
        await this.recommendationsService.fetchAndStoreRecommendationsForUser(data.userId);
    }
}
