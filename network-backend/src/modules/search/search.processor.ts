import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { SearchService } from './search.service';
import { UserSearchDto } from './dto/user-search.dto';
import { PostSearchDto } from './dto/post-search.dto';
import { SEARCH_QUEUE } from './search.constants';
import { Logger } from '@nestjs/common';

@Processor(SEARCH_QUEUE)
export class SearchProcessor {
    private readonly logger = new Logger(SearchProcessor.name);

    constructor(private readonly searchService: SearchService) { }

    @Process('add-user')
    async handleAddUser(job: Job<UserSearchDto>) {
        this.logger.log(`Processing add-user job: ${job.id}`);
        try {
            await this.searchService.indexUser(job.data);
            this.logger.log(`Successfully indexed user: ${job.data.id}`);
        } catch (error) {
            this.logger.error(`Failed to index user: ${error.message}`, error.stack);
            throw error;
        }
    }

    @Process('update-user')
    async handleUpdateUser(job: Job<{ userId: string; partialUser: Partial<UserSearchDto> }>) {
        await this.searchService.updateUserDoc(job.data.userId, job.data.partialUser);
    }

    @Process('delete-user')
    async handleDeleteUser(job: Job<{ userId: string }>) {
        await this.searchService.deleteUserDoc(job.data.userId);
    }

    @Process('add-post')
    async handleAddPost(job: Job<PostSearchDto>) {
        await this.searchService.indexPost(job.data);
    }

    @Process('update-post')
    async handleUpdatePost(job: Job<{ postId: string; partialPost: Partial<PostSearchDto> }>) {
        await this.searchService.updatePostDoc(job.data.postId, job.data.partialPost);
    }

    @Process('delete-post')
    async handleDeletePost(job: Job<{ postId: string }>) {
        await this.searchService.deletePostDoc(job.data.postId);
    }
}
