import { ActiveUserData } from "@/common/interfaces/active-user-data.interface";
import { ProfilesService } from "@/modules/profiles/profiles.service";
import { CanActivate, ExecutionContext, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";

// Guard cho restore
@Injectable()
export class PostOwnerGuardForHardDeleteAndRestore implements CanActivate {
    constructor(private profilesService: ProfilesService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user: ActiveUserData = request.user;
        const postId = request.params.id;

        const profile = await this.profilesService.findByUserId(user.id);
        const author = await this.profilesService.findByPostId(postId, true);

        if (!author) throw new NotFoundException("Author not found");
        if (author.id !== profile.id) throw new ForbiddenException('You cannot restore this post');

        return true;
    }
}
