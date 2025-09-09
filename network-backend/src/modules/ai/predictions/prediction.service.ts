import { AIReportResponseDto } from "@/modules/reports/dto/ai-report-response.dto";
import { HttpService } from "@nestjs/axios";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { firstValueFrom } from "rxjs";

@Injectable()
export class PredictionsService {
    private readonly baseUrl: string;
    private readonly logger = new Logger(PredictionsService.name);

    constructor(
        private readonly configService: ConfigService,
        private readonly http: HttpService,
    ) {
        this.baseUrl = this.configService.get<string>(
            "AI_API_BASE_URL",
            "http://127.0.0.1:8000/api",
        );
    }

    async analyzePost(postId: string): Promise<{ violence: AIReportResponseDto; hate: AIReportResponseDto }> {
        const endpoints = [
            { key: 'violence', url: `${this.baseUrl}/post/violence-report/${postId}` },
            { key: 'hate', url: `${this.baseUrl}/post/hate-report/${postId}` },
        ];

        // Gọi đồng thời cả 2 endpoint
        const results = await Promise.all(
            endpoints.map(async (ep) => {
                try {
                    this.logger.log(`Sending request to AI service: ${ep.url}`);
                    const response = await firstValueFrom(this.http.get<AIReportResponseDto>(ep.url));
                    return { key: ep.key, data: response.data };
                } catch (error: any) {
                    this.logger.error(`AI service call failed for ${ep.key} report, post ${postId}: ${error.message}`);
                    return { key: ep.key, data: null }; // Hoặc ném lỗi nếu muốn fail toàn bộ
                }
            }),
        );

        // Gộp kết quả theo key
        const aggregated: any = {};
        results.forEach((res) => {
            aggregated[res.key] = res.data;
        });

        return aggregated;
    }

    async getViolenceReport(postId: string): Promise<AIReportResponseDto> {
        const url = `${this.baseUrl}/post/violence-report/${postId}`;
        this.logger.log(`Sending request to AI service (violence): ${url}`);

        try {
            const response = await firstValueFrom(this.http.get<AIReportResponseDto>(url));
            return response.data;
        } catch (error: any) {
            this.logger.error(`Violence report failed for post ${postId}: ${error.message}`);
            throw new Error(`Violence report call failed: ${error.message}`);
        }
    }

    async getHateReport(postId: string): Promise<AIReportResponseDto> {
        const url = `${this.baseUrl}/post/hate-report/${postId}`;
        this.logger.log(`Sending request to AI service (hate): ${url}`);

        try {
            const response = await firstValueFrom(this.http.get<AIReportResponseDto>(url));
            return response.data;
        } catch (error: any) {
            this.logger.error(`Hate report failed for post ${postId}: ${error.message}`);
            throw new Error(`Hate report call failed: ${error.message}`);
        }
    }
}
