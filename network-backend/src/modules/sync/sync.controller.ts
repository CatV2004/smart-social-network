import { Controller, Post } from '@nestjs/common';
import { RecommendationResyncService } from './recommendation-sync.service';

@Controller('resync')
export class SyncController {
    constructor(private readonly recommendationResyncService: RecommendationResyncService) { }

    @Post('recommendations')
    async triggerSync() {
        await this.recommendationResyncService.manualRecommendationSync()
        return { message: 'Recommendation sync triggered manually!' };
    }
}
