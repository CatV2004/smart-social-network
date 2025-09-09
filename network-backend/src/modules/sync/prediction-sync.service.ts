import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { ConfigService } from '@nestjs/config';
import { PostsService } from '../posts/posts.service';
// import { PredictionsService } from '../ai/predictions/prediction.service';
// import { ReportsService } from '../reports/reports.service';
import { PredictionProducer } from '../ai/predictions/prediction.producer';

@Injectable()
export class PredictionResyncService {
    private readonly logger = new Logger(PredictionResyncService.name);

    constructor(
        private readonly schedulerRegistry: SchedulerRegistry,
        private readonly postsService: PostsService,
        // private readonly predictionsService: PredictionsService,
        // private readonly reportsService: ReportsService,
        private readonly configService: ConfigService,
        private readonly predictionProducer: PredictionProducer,
    ) {
        this.setupCron();
    }

    private setupCron() {
        const cronExpression = this.configService.get(
            'PREDICTION_CRON',
            '0 */5 * * * *',
        );

        const job = new CronJob(cronExpression, async () => {
            this.logger.log('Starting prediction sync job...');
            const posts = await this.postsService.getPostsToCheck();
            for (const post of posts) {
                await this.predictionProducer.enqueuePredictionJob(post.id);
            }
        });

        this.schedulerRegistry.addCronJob('predictionSync', job);
        job.start();
    }

    async manualPredictionSync() {
        const posts = await this.postsService.getPostsToCheck();
        this.logger.log("posts: ", posts)
        for (const post of posts) {
            await this.predictionProducer.enqueuePredictionJob(post.id);
        }
    }

}

