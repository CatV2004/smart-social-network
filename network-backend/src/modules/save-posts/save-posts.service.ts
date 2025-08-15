import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SavePost } from '@/modules/save-posts/entities/save-post.entity';
import { ToggleSavePostDto } from './dto/toggle-save-post.dto';
import { ProfilesService } from '@/modules/profiles/profiles.service';
import { PostsService } from '@/modules/posts/posts.service';

@Injectable()
export class SavePostsService {
  constructor(
    @InjectRepository(SavePost)
    private readonly savePostRepo: Repository<SavePost>,
    private readonly profilesService: ProfilesService,
    private readonly postsService: PostsService,
  ) { }

  async toggleSave(userId: string, dto: ToggleSavePostDto) {
    const profile = await this.profilesService.findByUserId(userId);
    if (!profile) throw new NotFoundException('Profile not found');

    const post = await this.postsService.findByIdWithRelations(dto.postId);
    if (!post) throw new NotFoundException('Post not found');

    const existing = await this.savePostRepo.findOne({
      where: { profile: { id: profile.id }, post: { id: post.id } },
      relations: ['profile', 'post'],
    });

    if (dto.saved) {
      if (!existing) {
        const savePost = this.savePostRepo.create({ profile, post });
        await this.savePostRepo.save(savePost);
      }
      return { saved: true };
    } else {
      if (existing) {
        await this.savePostRepo.remove(existing);
      }
      return { saved: false };
    }
  }


  async getSavedPosts(userId: string) {
    const profile = await this.profilesService.findByUserId(userId);
    if (!profile) throw new NotFoundException('Profile not found');

    return this.savePostRepo.find({
      where: { profile: { id: profile.id } },
      relations: ['post', 'post.author', 'post.media'],
      order: { createdAt: 'DESC' },
    });
  }
}
