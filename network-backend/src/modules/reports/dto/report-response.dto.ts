import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ReportStatus, ReportType } from '../entities/report.entity';
import { UserPublicDto } from '@/modules/users/dtos/user-public.dto';
import { PostResponseDto } from '@/modules/posts/dtos/response-post.dto';

export class AIAnalysisPredictionDto {
  @ApiProperty({ description: 'Label predicted by AI' })
  @Expose()
  label: string;

  @ApiProperty({ description: 'Probability of prediction' })
  @Expose()
  probability: number;
}

export class AIAnalysisDto {
  @ApiProperty({ type: [AIAnalysisPredictionDto] })
  @Expose()
  @Type(() => AIAnalysisPredictionDto)
  predictions: AIAnalysisPredictionDto[];

  @ApiProperty({ description: 'Time AI reviewed the post', type: String })
  @Expose()
  reviewedAt: Date;

  @ApiProperty({ description: 'Model version' })
  @Expose()
  modelVersion: string;
}

export class ReportDto {
  @ApiProperty({ description: 'Report ID' })
  @Expose()
  id: string;

  @ApiProperty({ description: 'Reason of report' })
  @Expose()
  reason: string;

  @ApiProperty({ enum: ReportStatus })
  @Expose()
  status: ReportStatus;

  @ApiProperty({ enum: ReportType })
  @Expose()
  type: ReportType;

  @ApiProperty({ type: UserPublicDto, description: 'Reporter information', nullable: true })
  @Expose()
  @Type(() => UserPublicDto)
  reporter?: UserPublicDto;

  @ApiProperty({ type: PostResponseDto, description: 'Post information', nullable: true })
  @Expose()
  @Type(() => PostResponseDto)
  post?: PostResponseDto;

  @ApiProperty({ type: AIAnalysisDto, description: 'AI analysis result', nullable: true })
  @Expose()
  @Type(() => AIAnalysisDto)
  aiAnalysis?: AIAnalysisDto;

  @ApiProperty({ description: 'Created at', type: String })
  @Expose()
  createdAt: Date;

  @ApiProperty({ description: 'Updated at', type: String })
  @Expose()
  updatedAt: Date;
}
