import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { PostsService } from '../posts/posts.service';
import { SearchService } from '../search/search.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CleanupService {
    private readonly logger = new Logger(CleanupService.name);
    private readonly RETENTION_DAYS: number;
    private readonly BATCH_SIZE: number;

    constructor(
        private readonly postsService: PostsService,
        private readonly searchService: SearchService,
        private readonly schedulerRegistry: SchedulerRegistry,
        private readonly configService: ConfigService,
    ) {
        this.RETENTION_DAYS = parseInt(this.configService.get('RETENTION_DAYS', '30'), 10);
        this.BATCH_SIZE = parseInt(this.configService.get('CLEANUP_BATCH_SIZE', '500'), 10);
        this.setupCron();
    }

    private setupCron() {
        const cronExpression = '0 0 * * *'; // chạy mỗi ngày lúc 0:00

        const job = new CronJob(cronExpression, async () => {
            this.logger.log(`Starting cleanup job (retention: ${this.RETENTION_DAYS}d, batch: ${this.BATCH_SIZE})`);
            await this.handleExpiredPosts();
        });

        this.schedulerRegistry.addCronJob('cleanupPosts', job);
        job.start();
    }

    async handleExpiredPosts() {
        let processed = 0;

        while (true) {
            const expiredBatch = await this.postsService.findExpiredPosts(this.RETENTION_DAYS, this.BATCH_SIZE);
            if (!expiredBatch.length) break;

            const ids = expiredBatch.map((p) => p.id);

            try {
                await this.postsService.permanentlyDeleteMany(ids);
            } catch (err) {
                this.logger.error(`DB permanent delete failed`, err instanceof Error ? err.stack : String(err));
            }

            try {
                await this.searchService.bulkDeletePosts(ids);
            } catch (err) {
                this.logger.error(`ES bulk delete failed`, err instanceof Error ? err.stack : String(err));
            }

            processed += expiredBatch.length;
            this.logger.log(`Cleaned ${processed} expired posts so far...`);

            if (expiredBatch.length < this.BATCH_SIZE) break;
        }

        this.logger.log(`Cleanup job finished. Total cleaned: ${processed}`);
    }
}
