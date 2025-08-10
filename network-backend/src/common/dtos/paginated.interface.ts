import { PaginationMetaDto } from './pagination-meta.dto';

export interface IPaginated<T> {
  data: T[];
  meta: PaginationMetaDto;
}
