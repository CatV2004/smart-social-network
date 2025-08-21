
export interface PostSearchDto {
    id: string;
    content: string;
    authorId: string;
}


export interface UserSearchDto {
    id: string;
    username: string;
    fullName: string;
    email: string;
    avatar?: string;
}

export interface SearchResultDto {
    id: string;
    type: 'user' | 'post';
    data: UserSearchDto | PostSearchDto;
}
