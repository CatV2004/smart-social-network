import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Report, ReportStatus, ReportType } from './entities/report.entity';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { AIReportResponseDto } from './dto/ai-report-response.dto';
import { paginate } from '@/common/utils/pagination.util';
import { PaginationQueryDto } from '@/common/dtos/pagination-query.dto';
import { ReportDto } from './dto/report-response.dto';
import { plainToInstance } from 'class-transformer';
import { PostsService } from '../posts/posts.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ReportsService {
    readonly logger = new Logger(ReportsService.name)
    constructor(
        @InjectRepository(Report)
        private readonly reportRepository: Repository<Report>,
        private readonly postService: PostsService,
        private readonly notificationService: NotificationsService
    ) { }

    async createUserReport(createDto: CreateReportDto, reporterId: string): Promise<Report> {
        const report = this.reportRepository.create({
            ...createDto,
            reporter: { id: reporterId },
            post: createDto.postId ? { id: createDto.postId } : undefined,
            status: ReportStatus.PENDING
        });

        return await this.reportRepository.save(report);
    }

    async createAIReport(aiResponse: AIReportResponseDto): Promise<Report> {
        const report = this.reportRepository.create({
            post: { id: aiResponse.postId },
            reason: `Tự động phát hiện: ${aiResponse.predictions[0]?.label || 'nội dung đáng ngờ'}`,
            type: ReportType.POST,
            status: ReportStatus.PENDING
        });

        report.updateFromPrediction(aiResponse);

        return await this.reportRepository.save(report);
    }

    async updateReportWithAI(report: Report, aiResponse: AIReportResponseDto): Promise<Report> {
        report.updateFromPrediction(aiResponse);
        return await this.reportRepository.save(report);
    }

    async handleAIResult(postId: string, aiResult: AIReportResponseDto) {
        const isNonViolence = aiResult.mainLabel.toLowerCase() === "non-violence";

        if (isNonViolence) {
            return;
        }

        const existingReport = await this.findExistingReport(postId);

        if (existingReport) {
            await this.updateReportWithAI(existingReport, aiResult);
        } else {
            await this.createAIReport(aiResult);
        }
    }

    async findExistingReport(postId: string): Promise<Report | null> {
        const report = await this.reportRepository.findOne({
            where: {
                post: { id: postId },
                type: ReportType.POST,
            },
            relations: ['post'],
        });

        return report ?? null;
    }

    async findAllPaginated(
        query: PaginationQueryDto,
        status?: string,
        type?: string
    ) {
        const page = query.page || 1;
        const limit = query.limit || 20;
        const sortBy = query.sortBy || 'createdAt';
        const sortOrder = query.sortOrder || 'DESC';

        const qb: SelectQueryBuilder<Report> = this.reportRepository
            .createQueryBuilder('report')
            .leftJoinAndSelect('report.reporter', 'reporter')
            .leftJoinAndSelect('report.post', 'post')
            .leftJoinAndSelect('post.media', 'media');

        if (status) {
            qb.andWhere('report.status = :status', { status });
        }

        if (type) {
            qb.andWhere('report.type = :type', { type });
        }

        qb.orderBy(`report.${sortBy}`, sortOrder);

        return paginate<Report>(qb, page, limit, ReportDto);
    }


    async getReportDetail(reportId: string): Promise<ReportDto> {
        const report = await this.reportRepository.findOne({
            where: { id: reportId },
            relations: [
                'reporter',
                // 'reporter.profile',
                'post',
                'post.author',
                'post.author.user',
                'post.media',
            ],
        });

        if (!report) {
            throw new NotFoundException(`Report with id ${reportId} not found`);
        }

        return plainToInstance(ReportDto, report, {
            excludeExtraneousValues: true,
        });
    }

    findOne(id: string) {
        return this.reportRepository.findOne({
            where: { id },
            relations: ['reporter', 'post', 'post.media'],
        });
    }

    async update(id: string, updateReportDto: UpdateReportDto) {
        await this.reportRepository.update(id, updateReportDto);
        return this.findOne(id);
    }

    async updateStatus(id: string, status: ReportStatus) {
        return this.reportRepository.update(id, {
            status: status
        })
    }

    async approveReport(reportId: string) {
        const report = await this.reportRepository.findOne({
            where: { id: reportId },
            relations: ['post', 'post.author', 'post.author.user'],
        });
        console.log(JSON.stringify(report, null, 2));

        if (!report) {
            throw new NotFoundException(`Report ${reportId} not found`);
        }

        if (report.post) {
            await this.notificationService.notifyPostRemoved(
                report.post.author.id,
                report.post.id,
                report.reason || 'Nội dung vi phạm chuẩn mực cộng đồng',
            );
            return this.postService.hardDeletePost(report.post.id);
        }

        // report.status = ReportStatus.RESOLVED;
        // return this.reportRepository.save(report);
    }


    async rejectReport(reportId: string): Promise<Report> {
        const report = await this.reportRepository.findOne({ where: { id: reportId } });

        if (!report) {
            throw new NotFoundException(`Report ${reportId} not found`);
        }

        report.status = ReportStatus.REVIEWED;
        return this.reportRepository.save(report);
    }

    async remove(id: string) {
        const report = await this.findOne(id);
        return this.reportRepository.softRemove(report!);
    }
}
