import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CleanupService } from './cleanup.service';
import { ResyncService } from './resync.service';
import { PostsModule } from '../posts/posts.module';
import { SearchModule } from '../search/search.module';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [
        ScheduleModule.forRoot(), 
        PostsModule,
        SearchModule,
        UsersModule,
    ],
    providers: [CleanupService, ResyncService],
})
export class SyncModule { }
