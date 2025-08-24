import { ObjectLiteral, SelectQueryBuilder } from "typeorm";
import { IPaginated } from "../dtos/paginated.interface";
import { PaginationMetaDto } from "../dtos/pagination-meta.dto";

/**
 * Paginate và map entity -> DTO qua custom mapper
 */
export async function paginateWithMapper<T extends ObjectLiteral, R>(
    qb: SelectQueryBuilder<T>,
    page: number,
    limit: number,
    mapper: (entity: T) => R,
): Promise<IPaginated<R>> {
    const total = await qb.getCount();

    const entities = await qb
        .skip((page - 1) * limit)
        .take(limit)
        .getMany();

    const data = entities.map(mapper);

    const meta: PaginationMetaDto = {
        total,
        page,
        limit,
        totalPages: Math.max(1, Math.ceil(total / limit)),
    };

    return { data, meta };
}
