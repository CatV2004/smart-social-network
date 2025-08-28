import { ObjectLiteral, SelectQueryBuilder } from "typeorm";
import { IPaginated } from "../dtos/paginated.interface";
import { PaginationMetaDto } from "../dtos/pagination-meta.dto";

/**
 * Paginate nhưng mapper xử lý cả list entities cùng lúc
 * → phù hợp cho batch query (tránh N+1)
 */
export async function paginateWithBatchMapper<T extends ObjectLiteral, R>(
    qb: SelectQueryBuilder<T>,
    page: number,
    limit: number,
    mapper: (entities: T[]) => Promise<R[]>, 
): Promise<IPaginated<R>> {
    const total = await qb.getCount();

    const entities = await qb
        .skip((page - 1) * limit)
        .take(limit)
        .getMany();

    const data = await mapper(entities);

    const meta: PaginationMetaDto = {
        total,
        page,
        limit,
        totalPages: Math.max(1, Math.ceil(total / limit)),
    };

    return { data, meta };
}
