import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReactionPost } from './entities/reaction-post.entity';
import { PostsService } from '../posts/posts.service';
import { ProfilesService } from '../profiles/profiles.service';
import { ToggleReactionPostDto } from '@/modules/reactions/dto/toggle-reaction-post.dto';

@Injectable()
export class ReactionsService {
  private readonly logger = new Logger(ReactionPost.name)
  constructor(
    @InjectRepository(ReactionPost)
    private readonly reactionPostRepository: Repository<ReactionPost>,

    private readonly profilesService: ProfilesService,
    private readonly postsService: PostsService,
  ) { }

  async togglePostReaction(userId: string, dto: ToggleReactionPostDto) {
    const profile = await this.profilesService.findByUserId(userId);
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    const post = await this.postsService.findByIdWithRelations(dto.postId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

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
