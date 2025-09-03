import { ApiProperty } from '@nestjs/swagger';
export class AlgorithmInfoDto {
    @ApiProperty() id: string;
    @ApiProperty() name: string;
    @ApiProperty() description: string;
}

export class AlgorithmsResponseDto {
    @ApiProperty({ type: [AlgorithmInfoDto] })
    algorithms: AlgorithmInfoDto[];
}
