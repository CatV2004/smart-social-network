import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { PredictionsService } from './prediction.service';
import { ReportsService } from '@/modules/reports/reports.service';

@Controller()
export class PredictionConsumer {
    private readonly logger = new Logger(PredictionConsumer.name);

    constructor(
        private readonly predictionsService: PredictionsService,
        private readonly reportsService: ReportsService,
    ) {
        this.logger.log('PredictionConsumer initialized');
    }

    @EventPattern('analyze-post')
    async handleAnalyzePost(@Payload() data: { postId: string }) {
        this.logger.log(`Processing prediction for post ${data.postId}`);
        try {
            const aiResult = await this.predictionsService.getViolenceReport(data.postId);

            await this.reportsService.handleAIResult(data.postId, aiResult);

            this.logger.log(`Prediction for post ${data.postId} saved to DB`);
        } catch (error) {
            this.logger.error(`Failed to process prediction for post ${data.postId}`, error);
        }
    }
}
