import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { BullModule } from '@nestjs/bull';
import { SEARCH_QUEUE } from './search.constants';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SearchProcessor } from './search.processor';

@Module({
  imports: [
    ConfigModule,
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        node: configService.get<string>('ELASTICSEARCH_NODE'),
      }),
    }),

    BullModule.registerQueue({
      name: SEARCH_QUEUE,
    }),
  ],
  providers: [SearchService, SearchProcessor],
  controllers: [SearchController],
  exports: [SearchService],
})
export class SearchModule { }
