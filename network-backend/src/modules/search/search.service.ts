import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { UserSearchDto } from './dto/user-search.dto';
import { PostSearchDto } from './dto/post-search.dto';
import { SEARCH_QUEUE } from './search.constants';

type SearchDoc = UserSearchDto | PostSearchDto;

@Injectable()
export class SearchService {
    private readonly USER_INDEX = 'users';
    private readonly POST_INDEX = 'posts';

    constructor(
        private readonly esService: ElasticsearchService,
        @InjectQueue(SEARCH_QUEUE) private readonly searchQueue: Queue,
    ) { }

    /** ---------------- USER ---------------- */
    async ensureUserIndexExists() {
        const exists = await this.esService.indices.exists({ index: this.USER_INDEX });
        if (!exists) {
            await this.esService.indices.create({
                index: this.USER_INDEX,
                mappings: {
                    properties: {
                        id: { type: 'keyword' },
                        username: {
                            type: 'text',
                            fields: {
                                keyword: {
                                    type: 'keyword',
                                    ignore_above: 256
                                }
                            }
                        },
                        fullName: {
                            type: 'text',
                            fields: {
                                keyword: {
                                    type: 'keyword',
                                    ignore_above: 256
                                }
                            }
                        },
                        email: { type: 'keyword' },
                        avatar: { type: 'keyword' },
                    },
                },
            });
        }
    }

    async addUser(user: UserSearchDto) {
        await this.ensureUserIndexExists();
        await this.searchQueue.add('add-user', user);
    }

    async updateUser(userId: string, partialUser: Partial<UserSearchDto>) {
        await this.searchQueue.add('update-user', { userId, partialUser });
    }

    async deleteUser(userId: string) {
        await this.searchQueue.add('delete-user', { userId });
    }

    /** ---------------- POST ---------------- */

    async ensurePostIndexExists() {
        const exists = await this.esService.indices.exists({ index: this.POST_INDEX });
        if (!exists) {
            await this.esService.indices.create({
                index: this.POST_INDEX,
                mappings: {
                    properties: {
                        id: { type: 'keyword' },
                        content: {
                            type: 'text',
                            analyzer: 'standard'
                        },
                        authorId: { type: 'keyword' },
                        createdAt: { type: 'date' },
                    },
                },
            });
        }
    }

    async addPost(post: PostSearchDto) {
        await this.searchQueue.add('add-post', post);
    }

    async updatePost(postId: string, partialPost: Partial<PostSearchDto>) {
        await this.searchQueue.add('update-post', { postId, partialPost });
    }

    async deletePost(postId: string) {
        await this.searchQueue.add('delete-post', { postId });
    }

    /** ---------------- SEARCH ---------------- */
    // phần search vẫn gọi trực tiếp ES (đây là query realtime, nên cần kết quả ngay)

    async searchAll(query: string) {
        await this.ensureUserIndexExists();
        await this.ensurePostIndexExists();
        return this.esService.search<SearchDoc>({
            index: [this.USER_INDEX, this.POST_INDEX],
            query: {
                multi_match: {
                    query,
                    fields: ['username', 'fullName', 'content'],
                    fuzziness: 'AUTO',
                },
            },
        });
    }

    async searchUsers(query: string) {
        return this.esService.search<UserSearchDto>({
            index: this.USER_INDEX,
            query: {
                multi_match: {
                    query,
                    fields: ['username', 'fullName'],
                    fuzziness: 'AUTO',
                },
            },
        });
    }

    async searchPosts(query: string, from = 0, size = 10) {
        return this.esService.search<PostSearchDto>({
            index: this.POST_INDEX,
            from,
            size,
            query: {
                match: {
                    content: {
                        query,
                        fuzziness: 'AUTO',
                    },
                },
            },
        });
    }


    /** ---------------- PRIVATE (cho worker gọi trực tiếp) ---------------- */
    async indexUser(user: UserSearchDto) {
        return this.esService.index<UserSearchDto>({
            index: this.USER_INDEX,
            id: user.id,
            document: user,
        });
    }

    async updateUserDoc(userId: string, partialUser: Partial<UserSearchDto>) {
        return this.esService.update<UserSearchDto>({
            index: this.USER_INDEX,
            id: userId,
            doc: partialUser,
        });
    }

    async deleteUserDoc(userId: string) {
        return this.esService.delete({
            index: this.USER_INDEX,
            id: userId,
        });
    }

    async indexPost(post: PostSearchDto) {
        return this.esService.index<PostSearchDto>({
            index: this.POST_INDEX,
            id: post.id,
            document: post,
        });
    }

    async updatePostDoc(postId: string, partialPost: Partial<PostSearchDto>) {
        return this.esService.update<PostSearchDto>({
            index: this.POST_INDEX,
            id: postId,
            doc: partialPost,
        });
    }

    async deletePostDoc(postId: string) {
        return this.esService.delete({
            index: this.POST_INDEX,
            id: postId,
        });
    }

    async bulkDeletePosts(ids: string[]) {
        if (!ids.length) return;
        const body = ids.flatMap((id) => [{ delete: { _index: this.POST_INDEX, _id: id } }]);
        await this.esService.bulk({ refresh: true, body });
    }

    async bulkIndexPosts(posts: PostSearchDto[]) {
        if (!posts.length) return;
        const body = posts.flatMap((p) => [
            { index: { _index: this.POST_INDEX, _id: p.id } },
            p,
        ]);
        await this.esService.bulk({ refresh: true, body });
    }
}
