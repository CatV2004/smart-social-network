import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { AlgorithmsResponseDto } from '../dtos/recommendation.dto';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRecommendation } from '../entities/user-recommention.entity';
import { Repository } from 'typeorm';
import { UsersService } from '@/modules/users/users.service';
import { firstValueFrom } from 'rxjs';
import { Follow, FollowStatus } from '@/modules/follows/entities/follow.entity';
import { ProfilesService } from '@/modules/profiles/profiles.service';

@Injectable()
export class RecommendationsService {
    private readonly baseUrl: string;
    private readonly logger = new Logger(RecommendationsService.name)

    constructor(
        private readonly http: HttpService,
        private readonly configService: ConfigService,
        @InjectRepository(UserRecommendation)
        private readonly recommendationRepo: Repository<UserRecommendation>,
        private readonly usersService: UsersService,
        private readonly profilesSerice: ProfilesService,
    ) {
        this.baseUrl = this.configService.get<string>('AI_API_BASE_URL', 'http://127.0.0.1:8000/api');
    }

    // async getRecommendations(userId: string, algorithm: string, topN: number) {
    //     const url = `${this.baseUrl}/recommendations/${userId}?algorithm=${algorithm}&top_n=${topN}`;
    //     const { data } = await this.http.axiosRef.get(url);
    //     return data;
    // }

    async getAlgorithms(userId: string): Promise<AlgorithmsResponseDto> {
        const url = `${this.baseUrl}/recommendations/${userId}/algorithms`;
        const { data } = await this.http.axiosRef.get(url);
        return data;
    }

    /**
     * Gọi API gợi ý cho một user và lưu xuống DB
     */
    async fetchAndStoreRecommendationsForUser(
        userId: string,
        algorithm = 'common_neighbors',
        topN = 5,
    ) {
        try {
            const url = `${this.baseUrl}/recommendations/${userId}`;
            this.logger.debug(`Calling: ${url} with algorithm=${algorithm}, topN=${topN}`);

            const response = await firstValueFrom(
                this.http.get(url, { params: { algorithm, top_n: topN } }),
            );

            const recommendations = response.data;

            // Xoá cũ -> lưu mới
            await this.recommendationRepo.delete({ user: { id: userId } });

            const user = await this.usersService.findById(userId);

            const entities = await Promise.all(
                recommendations.map(async (rec) => {
                    const candidate = await this.usersService.findById(rec.user_id);

                    return this.recommendationRepo.create({
                        user,
                        candidate,
                        commonFeatures: rec.common_features,
                    });
                }),
            );

            const saved = await this.recommendationRepo.save(entities);

            this.logger.log(`Stored ${saved.length} recommendations for user ${userId}`);

            return this.getRecommendationsByUserId(userId);
        } catch (error) {
            this.logger.error(
                `Failed to fetch recommendations for user ${userId}: ${error.message}`,
                error.stack,
            );
            if (error.response) {
                this.logger.error(
                    `AI Service response: ${JSON.stringify(error.response.data)}`,
                );
            }
            throw error;
        }
    }



    /**
     * Lấy tất cả user active và fetch gợi ý
     */
    async fetchAndStoreForAllUsers(): Promise<void> {
        const users = await this.usersService.findAllActiveNotAdmin();
        for (const u of users) {
            await this.fetchAndStoreRecommendationsForUser(u.id);
        }
    }

    // /**
    //  * Nhận recommendations từ AI (qua RabbitMQ RPC) và lưu xuống DB
    //  */
    // async storeRecommendations(
    //     userId: string,
    //     recommendations: any[],
    // ): Promise<void> {
    //     try {
    //         await this.recommendationRepo.delete({ user: { id: userId } });

    //         const user = await this.usersService.findById(userId);

    //         const entities = await Promise.all(
    //             recommendations.map(async (rec) => {
    //                 const candidate = await this.usersService.findById(rec.user_id);

    //                 return this.recommendationRepo.create({
    //                     user,
    //                     candidate,
    //                     commonFeatures: rec.common_features ?? {},
    //                 });
    //             }),
    //         );

    //         await this.recommendationRepo.save(entities);

    //         this.logger.log(
    //             `Stored ${entities.length} recommendations for user ${userId}`,
    //         );
    //     } catch (error) {
    //         this.logger.error(
    //             `Failed to store recommendations for user ${userId}: ${error.message}`,
    //             error.stack,
    //         );
    //         throw error;
    //     }
    // }

    /**
     * Lấy danh sách recommendation đã lưu trong DB
     */
    async getRecommendationsByUserId(userId: string) {
        const profile = await this.profilesSerice.findByUserId(userId);
        if (!profile) {
            throw new NotFoundException(`Không tìm thấy profile của userId: ${userId}`);
        }
        const profileId = profile.id;

        const recommendations = await this.recommendationRepo
            .createQueryBuilder('r')
            .innerJoinAndSelect('r.candidate', 'c')
            .innerJoinAndSelect('c.profile', 'cp')
            .leftJoin(Follow, 'f', 'f.follower_id = :profileId AND f.following_id = cp.id', { profileId })
            .where('r.user_id = :userId', { userId })
            .select([
                'r.id',
                'r.commonFeatures',
                'c.id',
                'c.firstName',
                'c.lastName',
                'c.username',
                'cp.avatar',
                'f.status',
            ])
            .distinctOn(['r.candidate_id'])
            .orderBy('r.candidate_id')
            .getRawMany();

        return recommendations.map(rec => ({
            id: rec.r_id,
            candidate: {
                id: rec.c_id,
                username: rec.c_username,
                firstName: rec.c_firstName,
                lastName: rec.c_lastName,
                avatar: rec.cp_avatar,
            },
            commonFeatures: rec.r_commonFeatures,
            isSendFollow: rec.f_status != null && rec.f_status !== FollowStatus.REJECTED,
        }));
    }


    async removeById(recommendationId: string): Promise<{ message: string }> {
        const recommendation = await this.recommendationRepo.findOne({ where: { id: recommendationId } });

        if (!recommendation) {
            throw new NotFoundException(`Recommendation with id ${recommendationId} not found`);
        }

        await this.recommendationRepo.remove(recommendation);

        return { message: 'Recommendation removed successfully' };
    }
}
