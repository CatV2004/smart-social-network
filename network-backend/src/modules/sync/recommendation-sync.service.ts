import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { RecommendationProducer } from '../ai/recommendations/recommendations.producer';

@Injectable()
export class RecommendationResyncService {
    private readonly logger = new Logger(RecommendationResyncService.name);

    constructor(
        private readonly schedulerRegistry: SchedulerRegistry,
        private readonly recommendationProducer: RecommendationProducer,
        private readonly usersService: UsersService,
        private readonly configService: ConfigService,
    ) {
        this.setupCron();
    }

    private setupCron() {
        const cronExpression = this.configService.get('RECOMMENDATION_CRON', '0 */6 * * *');

        const job = new CronJob(cronExpression, async () => {
            this.logger.log('Starting recommendation sync job...');
            const users = await this.usersService.findAllActiveNotAdmin();
            for (const u of users) {
                await this.recommendationProducer.enqueueSyncJob(u.id);
            }
        });

        this.schedulerRegistry.addCronJob('recommendationSync', job);
        job.start();
    }

    async manualRecommendationSync() {
        const users = await this.usersService.findAllActiveNotAdmin();
        for (const u of users) {
            await this.recommendationProducer.enqueueSyncJob(u.id);
        }
    }
}


// import { Injectable, Logger } from '@nestjs/common';
// import { SchedulerRegistry } from '@nestjs/schedule';
// import { CronJob } from 'cron';
// import { ConfigService } from '@nestjs/config';
// import { UsersService } from '../users/users.service';
// import { RecommendationProducer } from '../ai/recommendations/recommendations.producer';

// @Injectable()
// export class RecommendationResyncService {
//     private readonly logger = new Logger(RecommendationResyncService.name);

//     constructor(
//         private readonly schedulerRegistry: SchedulerRegistry,
//         private readonly recommendationProducer: RecommendationProducer,
//         private readonly usersService: UsersService,
//         private readonly configService: ConfigService,
//     ) {
//         this.setupCron();
//     }

//     private setupCron() {
//         const cronExpression = this.configService.get('RECOMMENDATION_CRON', '0 */6 * * *');

//         const job = new CronJob(cronExpression, async () => {
//             this.logger.log('Starting recommendation sync job...');
//             const users = await this.usersService.findAllActiveNotAdmin();
//             const userIds = users.map((u) => u.id);

//             if (userIds.length) {
//                 await this.recommendationProducer.enqueueSyncJobs(userIds);
//             } else {
//                 this.logger.warn('No active users found for sync');
//             }
//         });

//         this.schedulerRegistry.addCronJob('recommendationSync', job);
//         job.start();
//     }

//     async manualRecommendationSync() {
//         const users = await this.usersService.findAllActiveNotAdmin();
//         const userIds = users.map((u) => u.id);
//         if (userIds.length) {
//             await this.recommendationProducer.enqueueSyncJobs(userIds);
//         }
//     }

// }
