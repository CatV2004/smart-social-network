import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CleanupService } from './cleanup.service';
import { ResyncService } from './resync.service';
import { PostsModule } from '../posts/posts.module';
import { SearchModule } from '../search/search.module';
import { UsersModule } from '../users/users.module';
import { SyncController } from './sync.controller';
import { RecommendationResyncService } from './recommendation-sync.service';
import { AiModule } from '../ai/ai.module';
import { PredictionResyncService } from './prediction-sync.service';

@Module({
    imports: [
        ScheduleModule.forRoot(),
        PostsModule,
        SearchModule,
        UsersModule,
        AiModule,
        PostsModule,
    ],
    controllers: [SyncController],
    providers: [CleanupService, ResyncService, RecommendationResyncService, PredictionResyncService],
})
export class SyncModule { }
