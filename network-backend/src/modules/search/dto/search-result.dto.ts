import { PostSearchDto } from "./post-search.dto";
import { UserSearchDto } from "./user-search.dto";

export class SearchResultDto {
    id: string;
    type: 'user' | 'post';
    data: UserSearchDto | PostSearchDto;

    constructor(id: string, type: 'user' | 'post', data: any) {
        this.id = id;
        this.type = type;
        this.data = data;
    }
}
