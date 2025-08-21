import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { PostsService } from '../posts/posts.service';
import { SearchService } from '../search/search.service';
import dayjs from 'dayjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ResyncService {
    private readonly logger = new Logger(ResyncService.name);
    private readonly BATCH_SIZE: number;

    constructor(
        private readonly postsService: PostsService,
        private readonly searchService: SearchService,
        private readonly schedulerRegistry: SchedulerRegistry,
        private readonly configService: ConfigService,
    ) {
        this.BATCH_SIZE = parseInt(this.configService.get('RESYNC_BATCH_SIZE', '1000'), 10);
        this.setupCron();
    }

    private setupCron() {
        const cronExpression = this.configService.get('RESYNC_CRON', '0 */6 * * *');

        const job = new CronJob(cronExpression, async () => {
            this.logger.log(`Starting ES resync (batch: ${this.BATCH_SIZE})`);
            await this.syncAllPostsToES();
        });

        this.schedulerRegistry.addCronJob('resyncPosts', job);
        job.start();
    }

    async syncAllPostsToES() {
        let offset = 0;
        let total = 0;

        while (true) {
            const { items, nextOffset } = await this.postsService.findAllActivePaged({
                limit: this.BATCH_SIZE,
                offset,
            });

            if (!items.length) break;

            try {
                const postsToIndex = items.map((p) => ({
                    id: p.id,
                    content: p.content,
                    authorId: p.author.id,
                    createdAt: dayjs(p.createdAt).toISOString(),
                }));
                await this.searchService.bulkIndexPosts(postsToIndex);
                total += items.length;
                this.logger.log(`Indexed ${total} posts so far...`);
            } catch (err) {
                this.logger.error(`ES bulk index failed at offset ${offset}`, err instanceof Error ? err.stack : String(err));
            }

            if (nextOffset == null || items.length < this.BATCH_SIZE) break;
            offset = nextOffset;
        }

        this.logger.log(`ES sync completed. Total indexed posts: ${total}`);
    }
}
