import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RecommendationsService } from './recommendations/recommendations.service';
import { RecommendationsController } from './recommendations/recommendations.controller';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRecommendation } from './entities/user-recommention.entity';
import { RecommendationsConsumer } from './recommendations/recommendations.consumer';
import { RecommendationProducer } from './recommendations/recommendations.producer';
import { QueueModule } from '../queue/queue.module';
import { ProfilesModule } from '../profiles/profiles.module';
import { ReportsModule } from '../reports/reports.module';
import { PredictionProducer } from './predictions/prediction.producer';
import { PredictionsService } from './predictions/prediction.service';
import { PredictionConsumer } from './predictions/prediction.consumer';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserRecommendation]),
        HttpModule,
        UsersModule,
        QueueModule,
        ProfilesModule,
        ReportsModule
    ],
    providers: [RecommendationsService, RecommendationProducer, PredictionProducer, PredictionsService],
    controllers: [RecommendationsController, RecommendationsConsumer, PredictionConsumer],
    exports: [RecommendationsService, RecommendationProducer, PredictionProducer],
})
export class AiModule { }
