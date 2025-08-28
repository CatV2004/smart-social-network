import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchHit } from '@elastic/elasticsearch/lib/api/types';
import { UserSearchDto } from './dtos/user-search.dto';
import { PostSearchDto } from './dtos/post-search.dto';
import { SearchResultDto } from './dtos/search-result.dto';
import { IPaginated } from '@/common/dtos/paginated.interface'; 
import { PaginationMetaDto } from '@/common/dtos/pagination-meta.dto'; 

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) { }

  @Get()
  async search(@Query('q') q: string): Promise<SearchResultDto[]> {
    const results = await this.searchService.searchAll(q);

    return results.hits.hits.map(
      (hit: SearchHit<UserSearchDto | PostSearchDto>) => {
        const type = hit._index === 'users' ? 'user' : 'post';
        return new SearchResultDto(hit._id as string, type, hit._source);
      },
    );
  }

  @Get('posts')
  async searchPosts(
    @Query('q') q: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<IPaginated<SearchResultDto>> {
    const from = (page - 1) * limit;

    const results = await this.searchService.searchPosts(q, from, limit);

    const items = results.hits.hits.map(
      (hit: SearchHit<PostSearchDto>) =>
        new SearchResultDto(hit._id as string, 'post', hit._source),
    );

    const total = typeof results.hits.total === 'number'
      ? results.hits.total
      : (results.hits.total as any).value; 

    const meta: PaginationMetaDto = {
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    };

    return { data: items, meta };
  }
}
