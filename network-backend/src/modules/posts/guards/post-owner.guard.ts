
import { CanActivate, ExecutionContext, ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ActiveUserData } from '@/common/interfaces/active-user-data.interface';
import { ProfilesService } from '@/modules/profiles/profiles.service';

@Injectable()
export class PostOwnerGuard implements CanActivate {
    private readonly logger = new Logger(PostOwnerGuard.name)
    constructor(
        private readonly profilesService: ProfilesService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user: ActiveUserData = request.user;
        const profile = await this.profilesService.findByUserId(user.id)

        const postId = request.params.id;
        const author = await this.profilesService.findByPostId(postId);
        this.logger.debug(author)
        if (!author)
            throw new NotFoundException("Author not found")

        if (author.id !== profile.id) {
            throw new ForbiddenException('You do not have permission to delete this post');
        }

        return true;
    }
}
