import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { PaginationMetaDto } from '../dtos/pagination-meta.dto';
import { IPaginated } from '../dtos/paginated.interface';

export async function paginate<T extends ObjectLiteral>(
    qb: SelectQueryBuilder<T>,
    page: number,
    limit: number,
    dtoClass: new (...args: any[]) => any,
): Promise<IPaginated<any>> {
    const total = await qb.getCount();
    const { entities, raw } = await qb
        .skip((page - 1) * limit)
        .take(limit)
        .getRawAndEntities();

    const items = entities.map((entity, index) => {
        const isReacted =
            raw[index].isReacted === true || raw[index].isReacted === 1;
        const isSaved =
            raw[index].isSaved === true || raw[index].isSaved === 1;
        return Object.assign(entity, { isReacted, isSaved });
    });

    const data = plainToInstance(dtoClass, items, {
        excludeExtraneousValues: true,
    });

    const meta: PaginationMetaDto = {
        total,
        page,
        limit,
        totalPages: Math.max(1, Math.ceil(total / limit)),
    };

    return { data, meta };
}
