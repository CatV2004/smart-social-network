import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/modules/users/entities/user.entity';
import { Profile } from '@/modules/profiles/entities/profile.entity';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { Follow } from '../follows/entities/follow.entity';
import { Post } from '../posts/entities/post.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User, Profile, Follow, Post])],
    providers: [StatisticsService],
    controllers: [StatisticsController],
})
export class StatisticsModule { }
