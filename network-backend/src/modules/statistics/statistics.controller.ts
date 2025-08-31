import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { ApiOkResponse } from '@nestjs/swagger';
import { PostStatisticsDto } from './dtos/post-statistics.dto';

@Controller('statistics')
@Roles(UserRole.ADMIN)
@UseGuards(RolesGuard)
export class StatisticsController {
    constructor(private readonly statsService: StatisticsService) { }

    @Get('users/total')
    getTotalUsers() {
        return this.statsService.getTotalUsers();
    }

    @Get('users/status')
    getUsersByStatus() {
        return this.statsService.getUsersByStatus();
    }

    @Get('users/verified')
    getVerifiedUsers() {
        return this.statsService.getVerifiedUsers();
    }

    @Get('profiles/gender')
    getGenderDistribution() {
        return this.statsService.getGenderDistribution();
    }

    @Get('profiles/age')
    getAgeDistribution() {
        return this.statsService.getAgeDistribution();
    }

    @Get('users/new')
    getNewUsersByPeriod(@Query('period') period: 'day' | 'week' | 'month' = 'day') {
        return this.statsService.getNewUsersByPeriod(period);
    }

    @Get('follows/top-followers')
    getTopFollowers(@Query('limit') limit?: number) {
        return this.statsService.getTopFollowers(limit ? Number(limit) : 10);
    }

    @Get('follows/top-following')
    getTopFollowing(@Query('limit') limit?: number) {
        return this.statsService.getTopFollowing(limit ? Number(limit) : 10);
    }

    @Get('follows/growth')
    getFollowerGrowth(@Query('period') period: 'day' | 'week' | 'month' = 'day') {
        return this.statsService.getFollowerGrowth(period);
    }

    @Get('follows/mutual-rate')
    getMutualFollowRate() {
        return this.statsService.getMutualFollowRate();
    }

    @Get('follows/status-distribution')
    getFollowStatusDistribution() {
        return this.statsService.getFollowStatusDistribution();
    }

    @Get('follows/rejected-rate')
    getRejectedFollowRate() {
        return this.statsService.getRejectedFollowRate();
    }

    /** 1. Tổng quan bài viết */
    @Get('post/overview')
    async getOverview() {
        return await this.statsService.getOverview();
    }

    /** 2. Thống kê bài viết theo ngày (7 ngày gần nhất) */
    @Get('post/by-day')
    async getPostsByLast7Days() {
        return await this.statsService.getPostsByLast7Days();
    }

    /** 3. Top 10 bài viết nhiều like nhất */
    @Get('post/top-liked')
    async getTopLiked(@Query('limit') limit?: string) {
        const take = limit ? parseInt(limit, 10) : 10;
        return await this.statsService.getTopLiked(take);
    }

    /** 4. Top 10 bài viết nhiều comment nhất */
    @Get('post/top-commented')
    async getTopCommented(@Query('limit') limit?: string) {
        const take = limit ? parseInt(limit, 10) : 10;
        return await this.statsService.getTopCommented(take);
    }

    /** 5. Top 10 bài viết được lưu nhiều nhất */
    @Get('post/most-saved')
    async getMostSaved(@Query('limit') limit?: string) {
        const take = limit ? parseInt(limit, 10) : 10;
        return await this.statsService.getMostSaved(take);
    }

    /** 6. Thống kê số bài viết theo giới tính tác giả */
    @Get('post/by-gender')
    async getPostsByGender() {
        return await this.statsService.getPostsByGender();
    }

    /** 7. Thống kê số bài viết theo nhóm tuổi */
    @Get('post/by-age-group')
    async getPostsByAgeGroup() {
        return await this.statsService.getPostsByAgeGroup();
    }
}
