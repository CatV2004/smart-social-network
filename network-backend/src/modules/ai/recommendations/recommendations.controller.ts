import { Controller, Get, Query, Param, Post, Delete } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags, ApiQuery, ApiParam } from '@nestjs/swagger';
import { RecommendationsService } from './recommendations.service';
import { AlgorithmsResponseDto } from '../dtos/recommendation.dto';
import { ActiveUser } from '@/common/decorators/active-user.decorator';
import { ActiveUserData } from '@/common/interfaces/active-user-data.interface';

@ApiTags('Recommendations')
@Controller('recommendations')
export class RecommendationsController {
    constructor(private readonly recommendationsService: RecommendationsService) { }

    // @Get('me')
    // @ApiOperation({ summary: 'Get recommendations for the active user' })
    // @ApiOkResponse({ type: [RecommendationResponseDto] })
    // @ApiQuery({ name: 'algorithm', required: true, description: 'Algorithm id' })
    // @ApiQuery({ name: 'top_n', required: false, description: 'Number of recommendations to return', example: 5 })
    // async getMyRecommendations(
    //     @ActiveUser() user: ActiveUserData,
    //     @Query('algorithm') algorithm: string,
    //     @Query('top_n') topN = 5,
    // ): Promise<RecommendationResponseDto[]> {
    //     return this.recommendationsService.getRecommendations(user.id, algorithm, topN);
    // }
    @Get('me')
    @ApiOperation({ summary: 'Get recommendations for the active user' })
    async getMyRecommendations(
        @ActiveUser() user: ActiveUserData,
    ) {
        return this.recommendationsService.getRecommendationsByUserId(user.id);
    }

    @Post(':userId/recommendations/sync')
    @ApiOperation({ summary: 'Fetch and store recommendations for a user' })
    async syncRecommendations(
        @Param('userId') userId: string,
        @Query('algorithm') algorithm = 'common_neighbors',
        @Query('top_n') topN = 5,
    ) {
        const recommendations = await this.recommendationsService.fetchAndStoreRecommendationsForUser(
            userId,
            algorithm,
            topN,
        );
        return recommendations;
    }

    @Get(':userId')
    @ApiOperation({ summary: 'Lấy danh sách gợi ý theo userId' })
    @ApiParam({ name: 'userId', type: String })
    async getRecommendations(@Param('userId') userId: string){
        return this.recommendationsService.getRecommendationsByUserId(userId);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Remove a recommendation by its id' })
    async removeRecommendation(@Param('id') recommendationId: string) {
        return this.recommendationsService.removeById(recommendationId);
    }

    @Get(':userId/algorithms')
    @ApiOperation({ summary: 'Get available recommendation algorithms' })
    @ApiOkResponse({ type: AlgorithmsResponseDto })
    async getAlgorithms(@Param('userId') userId: string): Promise<AlgorithmsResponseDto> {
        return this.recommendationsService.getAlgorithms(userId);
    }

}
