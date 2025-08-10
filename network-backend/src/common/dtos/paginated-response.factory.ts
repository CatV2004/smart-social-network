import { ApiProperty } from '@nestjs/swagger';
import { Type as ClassType } from '@nestjs/common';
import { PaginationMetaDto } from './pagination-meta.dto';

export function PaginatedResponseDto<T>(model: ClassType<T>) {
  class PaginatedDto {
    @ApiProperty({ isArray: true, type: model })
    data: T[];

    @ApiProperty({ type: PaginationMetaDto })
    meta: PaginationMetaDto;
  }
  return PaginatedDto;
}
