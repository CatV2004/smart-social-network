import { Controller, Post } from '@nestjs/common';
import { RecommendationResyncService } from './recommendation-sync.service';
import { PredictionResyncService } from './prediction-sync.service';

@Controller('resync')
export class SyncController {
    constructor(
        private readonly recommendationResyncService: RecommendationResyncService,
        private readonly predictionResyncService: PredictionResyncService
    ) { }

    @Post('recommendations')
    async triggerRecommendationSync() {
        await this.recommendationResyncService.manualRecommendationSync()
        return { message: 'Recommendation sync triggered manually!' };
    }
    @Post('prediction')
    async triggerPredictionSync() {
        await this.predictionResyncService.manualPredictionSync()
        return { message: 'Prediction sync triggered manually!' };
    }
}
