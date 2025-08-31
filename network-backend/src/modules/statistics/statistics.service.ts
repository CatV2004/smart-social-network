import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Raw, Repository } from 'typeorm';
import { User } from '@/modules/users/entities/user.entity';
import { Profile } from '@/modules/profiles/entities/profile.entity';
import { Follow, FollowStatus } from '../follows/entities/follow.entity';
import { PostStatisticsDto } from './dtos/post-statistics.dto';
import { Post } from '../posts/entities/post.entity';
import dayjs from 'dayjs';

@Injectable()
export class StatisticsService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        @InjectRepository(Profile)
        private readonly profileRepo: Repository<Profile>,
        @InjectRepository(Follow)
        private readonly followRepo: Repository<Follow>,
        @InjectRepository(Post)
        private readonly postRepo: Repository<Post>,
    ) { }

    /** Tổng số user */
    async getTotalUsers() {
        return this.userRepo.count();
    }

    /** Số user theo trạng thái (ACTIVE, PENDING, BANNED…) */
    async getUsersByStatus() {
        return this.userRepo
            .createQueryBuilder('user')
            .select('user.status', 'status')
            .addSelect('COUNT(*)', 'count')
            .groupBy('user.status')
            .getRawMany();
    }

    /** Tỉ lệ user đã xác minh email */
    async getVerifiedUsers() {
        const total = await this.userRepo.count();
        const verified = await this.userRepo.count({ where: { isVerified: true } });

        return {
            total,
            verified,
            percentage: total > 0 ? (verified / total) * 100 : 0,
        };
    }

    /** Phân bố giới tính */
    async getGenderDistribution() {
        return this.profileRepo
            .createQueryBuilder('profile')
            .select('profile.gender', 'gender')
            .addSelect('COUNT(*)', 'count')
            .where('profile.gender IS NOT NULL')
            .groupBy('profile.gender')
            .getRawMany();
    }

    /** Phân bố theo độ tuổi */
    async getAgeDistribution() {
        return this.profileRepo
            .createQueryBuilder('profile')
            .select(`
      CASE
        WHEN EXTRACT(YEAR FROM AGE(profile.dateOfBirth)) BETWEEN 13 AND 17 THEN '13-17'
        WHEN EXTRACT(YEAR FROM AGE(profile.dateOfBirth)) BETWEEN 18 AND 24 THEN '18-24'
        WHEN EXTRACT(YEAR FROM AGE(profile.dateOfBirth)) BETWEEN 25 AND 34 THEN '25-34'
        WHEN EXTRACT(YEAR FROM AGE(profile.dateOfBirth)) BETWEEN 35 AND 44 THEN '35-44'
        WHEN EXTRACT(YEAR FROM AGE(profile.dateOfBirth)) BETWEEN 45 AND 54 THEN '45-54'
        WHEN EXTRACT(YEAR FROM AGE(profile.dateOfBirth)) >= 55 THEN '55+'
        ELSE 'Unknown'
      END
    `, 'ageGroup')
            .addSelect('COUNT(*)', 'count')
            .where('profile.dateOfBirth IS NOT NULL')
            .groupBy('"ageGroup"')
            .getRawMany();
    }


    /** Người dùng mới theo ngày/tuần/tháng */
    async getNewUsersByPeriod(period: 'day' | 'week' | 'month' = 'day') {
        let format = 'YYYY-MM-DD';
        if (period === 'week') format = 'IYYY-IW'; // ISO week
        if (period === 'month') format = 'YYYY-MM';

        return this.userRepo
            .createQueryBuilder('user')
            .select(`TO_CHAR(user.created_at, '${format}')`, 'period')
            .addSelect('COUNT(*)', 'count')
            .groupBy('period')
            .orderBy('period', 'ASC')
            .getRawMany();
    }

    async getTopFollowers(limit = 10) {
        return this.followRepo
            .createQueryBuilder('follow')
            .innerJoin('follow.following', 'profile')
            .innerJoin('profile.user', 'usr')
            .select('follow.following_id', 'profileId')
            .addSelect('COUNT(follow.follower_id)', 'followers_count')
            .addSelect('usr.username', 'username')
            .addSelect(`usr."firstName" || ' ' || usr."lastName"`, 'fullname')
            .addSelect('profile.avatar', 'avatar')
            .where('follow.status = :status', { status: FollowStatus.ACCEPTED })
            .groupBy('follow.following_id')
            .addGroupBy('usr.username')
            .addGroupBy('usr."firstName"')
            .addGroupBy('usr."lastName"')
            .addGroupBy('profile.avatar')
            .orderBy('followers_count', 'DESC')
            .limit(limit)
            .getRawMany();
    }


    async getTopFollowing(limit = 10) {
        return this.followRepo
            .createQueryBuilder('follow')
            .innerJoin('follow.follower', 'profile')
            .innerJoin('profile.user', 'usr')
            .select('follow.follower_id', 'profileId')
            .addSelect('COUNT(follow.following_id)', 'following_count')
            .addSelect('usr.username', 'username')
            .addSelect(`usr."firstName" || ' ' || usr."lastName"`, 'fullname')
            .addSelect('profile.avatar', 'avatar')
            .where('follow.status = :status', { status: FollowStatus.ACCEPTED })
            .groupBy('follow.follower_id')
            .addGroupBy('usr.username')
            .addGroupBy('usr."firstName"')
            .addGroupBy('usr."lastName"')
            .addGroupBy('profile.avatar')
            .orderBy('following_count', 'DESC')
            .limit(limit)
            .getRawMany();
    }

    async getFollowerGrowth(period: 'day' | 'week' | 'month' = 'day') {
        let format: string;
        switch (period) {
            case 'week':
                format = `to_char(follow.created_at, 'IYYY-IW')`;
                break;
            case 'month':
                format = `to_char(follow.created_at, 'YYYY-MM')`;
                break;
            default:
                format = `to_char(follow.created_at, 'YYYY-MM-DD')`;
        }

        return this.followRepo
            .createQueryBuilder('follow')
            .select(`${format}`, 'period')
            .addSelect('COUNT(*)', 'count')
            .where('follow.status = :status', { status: FollowStatus.ACCEPTED })
            .groupBy('period')
            .orderBy('period', 'ASC')
            .getRawMany();
    }

    /** 4. Tỉ lệ follow chéo (mutual follows) */
    async getMutualFollowRate() {
        const totalFollows = await this.followRepo.count({
            where: { status: FollowStatus.ACCEPTED },
        });

        if (totalFollows === 0) return { totalFollows: 0, mutualFollows: 0, rate: 0 };

        const mutualFollows = await this.followRepo
            .createQueryBuilder('f1')
            .innerJoin(
                Follow,
                'f2',
                'f1.follower_id = f2.following_id AND f1.following_id = f2.follower_id AND f2.status = :status',
                { status: FollowStatus.ACCEPTED },
            )
            .where('f1.status = :status', { status: FollowStatus.ACCEPTED })
            .getCount();

        // vì join ra 2 bản ghi cho mỗi cặp mutual nên chia 2
        const uniqueMutual = mutualFollows / 2;

        return {
            totalFollows,
            mutualFollows: uniqueMutual,
            rate: uniqueMutual / totalFollows,
        };
    }

    /** 5. % follow ở từng trạng thái */
    async getFollowStatusDistribution() {
        const result = await this.followRepo
            .createQueryBuilder('follow')
            .select('follow.status', 'status')
            .addSelect('COUNT(*)', 'count')
            .groupBy('follow.status')
            .getRawMany();

        const total = result.reduce((sum, r) => sum + Number(r.count), 0);

        return result.map(r => ({
            status: r.status,
            count: Number(r.count),
            percentage: total ? Number(r.count) / total : 0,
        }));
    }

    /** 6. Tỉ lệ follow bị từ chối */
    async getRejectedFollowRate() {
        const total = await this.followRepo.count();
        const rejected = await this.followRepo.count({
            where: { status: FollowStatus.REJECTED },
        });

        return {
            total,
            rejected,
            rate: total ? rejected / total : 0,
        };
    }

    /** 1. Tổng quan */
    async getOverview() {
        const totalPosts = await this.postRepo.count();
        const totalDeleted = await this.postRepo.count({
            where: { deletedAt: Raw(alias => `${alias} IS NOT NULL`) },
        });

        return { totalPosts, totalDeleted };
    }

    /** 2. Thống kê theo ngày (7 ngày gần nhất) */
    async getPostsByLast7Days() {
        return this.postRepo
            .createQueryBuilder('post')
            .select("DATE(post.created_at)", "date")
            .addSelect("COUNT(*)", "count")
            .where("post.created_at >= :date", { date: dayjs().subtract(7, 'day').toDate() })
            .groupBy('date')
            .orderBy('date', 'ASC')
            .getRawMany();
    }

    /** 3. Top 10 bài viết nhiều like nhất */
    async getTopLiked(limit = 10) {
        const posts = await this.postRepo.find({
            order: { likesCount: 'DESC' },
            take: limit,
            relations: ['media'],
            select: ['id', 'content', 'likesCount'],
        });

        return posts.map(p => ({
            id: p.id,
            content: p.content,
            likes: p.likesCount,
            media: p.media?.[0]?.url || null,
        }));
    }

    /** 4. Top 10 bài viết nhiều comment nhất */
    async getTopCommented(limit = 10) {
        const posts = await this.postRepo.find({
            order: { commentsCount: 'DESC' },
            take: limit,
            relations: ['media'],
            select: ['id', 'content', 'commentsCount'],
        });

        return posts.map(p => ({
            id: p.id,
            content: p.content,
            comments: p.commentsCount,
            media: p.media?.[0]?.url || null,
        }));
    }

    /** 5. Top 10 bài viết được lưu nhiều nhất */
    async getMostSaved(limit = 10) {
        const posts = await this.postRepo
            .createQueryBuilder('post')
            .leftJoin('post.savedBy', 'savePost')
            .leftJoin('post.media', 'media')
            .select('post.id', 'id')
            .addSelect('post.content', 'content')
            .addSelect('COUNT(savePost.id)', 'saves')
            .addSelect('MAX(media.url)', 'media') // lấy media đầu tiên
            .where('post.deletedAt IS NULL')
            .groupBy('post.id')
            .orderBy('saves', 'DESC')
            .limit(limit)
            .getRawMany();

        return posts.map(p => ({
            id: p.id,
            content: p.content,
            saves: Number(p.saves),
            media: p.media || null,
        }));
    }


    /** 6. Thống kê số bài viết theo giới tính tác giả */
    async getPostsByGender() {
        return this.postRepo
            .createQueryBuilder('post')
            .leftJoin('post.author', 'profile')
            .select('profile.gender', 'gender')
            .addSelect('COUNT(post.id)', 'count')
            .groupBy('profile.gender')
            .getRawMany();
    }

    /** 7. Thống kê số bài viết theo nhóm tuổi */
    async getPostsByAgeGroup() {
        const profiles = await this.profileRepo.find({ select: ['id', 'dateOfBirth'] });
        const ageGroups: Record<string, number> = { '18-24': 0, '25-34': 0, '35-44': 0, '45+': 0 };

        for (const p of profiles) {
            if (!p.dateOfBirth) continue;
            const age = dayjs().diff(p.dateOfBirth, 'year');
            if (age >= 18 && age <= 24) ageGroups['18-24']++;
            else if (age >= 25 && age <= 34) ageGroups['25-34']++;
            else if (age >= 35 && age <= 44) ageGroups['35-44']++;
            else if (age >= 45) ageGroups['45+']++;
        }

        return Object.entries(ageGroups).map(([ageGroup, count]) => ({ ageGroup, count }));
    }
}
