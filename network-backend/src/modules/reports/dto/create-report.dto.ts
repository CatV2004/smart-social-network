import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { ReportType } from '../entities/report.entity';

export class CreateReportDto {
    @IsUUID()
    @IsOptional()
    postId?: string; 

    @IsEnum(ReportType)
    type: ReportType;

    @IsString()
    @IsNotEmpty()
    reason: string;
}