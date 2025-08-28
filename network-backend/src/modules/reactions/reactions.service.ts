import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReactionPost } from './entities/reaction-post.entity';
import { PostsService } from '../posts/posts.service';
import { ProfilesService } from '../profiles/profiles.service';
import { ToggleReactionPostDto } from '@/modules/reactions/dtos/toggle-reaction-post.dto';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ReactionsService {
  private readonly logger = new Logger(ReactionPost.name)
  constructor(
    @InjectRepository(ReactionPost)
    private readonly reactionPostRepository: Repository<ReactionPost>,

    private readonly profilesService: ProfilesService,
    private readonly postsService: PostsService,
    private readonly notificationsService: NotificationsService,
  ) { }

  async togglePostReaction(userId: string, dto: ToggleReactionPostDto) {
    const profile = await this.profilesService.findByUserId(userId);
    const post = await this.postsService.findByIdWithRelations(dto.postId, ['author']);

    const isOwnPost = post.author.id === profile.id;

    if (dto.liked) {
      const exists = await this.reactionPostRepository.exists({
        where: { post: { id: dto.postId }, profile: { id: profile.id } },
      });

      if (!exists) {
        const reaction = this.reactionPostRepository.create({
          post,
          profile,
        });
        const savedReaction = await this.reactionPostRepository.save(reaction);
        await this.postsService.incrementLikesCount(dto.postId)

        if (!isOwnPost) {
          try {
            await this.notificationsService.notifyLikePost(
              profile.id,
              post.author.id,
              dto.postId        
            );
          } catch (error) {
            console.error('Failed to send notification:', error);
          }
        }
      } else {
      }
      return { message: 'Reaction added' };
    }

    const deleteResult = await this.reactionPostRepository.delete({
      post: { id: dto.postId },
      profile: { id: profile.id },
    });
    await this.postsService.decrementLikesCount(dto.postId)

    return { message: 'Reaction removed' };
  }


}
