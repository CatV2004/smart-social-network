import { IsArray, IsNumber, IsObject, IsString, ValidateNested } from 'class-validator';

class PredictionDto {
    @IsNumber()
    id: number;

    @IsString()
    label: string;

    @IsNumber()
    probability: number;
}

export class AIReportResponseDto {
    @IsString()
    postId: string;

    @IsString()
    content: string;

    @IsString()
    type: string;

    @IsString()
    status: string;

    @IsString()
    mainLabel: string;
    
    @IsNumber()
    mainProbability: number;

    @IsArray()
    @ValidateNested({ each: true })
    predictions: PredictionDto[];
}