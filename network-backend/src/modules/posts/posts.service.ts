import { BadRequestException, forwardRef, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { Post } from './entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfilesService } from '../profiles/profiles.service';

@Injectable()
export class PostsService {
  private readonly logger = new Logger(PostsService.name);
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,

    @Inject(forwardRef(() => ProfilesService))
    private readonly profilesService: ProfilesService,

  ) { }
  async create(dto: CreatePostDto, userId: string): Promise<Post> {
    const { content } = dto;

    const profile = await this.profilesService.findByUserId(userId);
    const post = this.postRepository.create({ content, author: profile });
    return this.postRepository.save(post);
  }

  async softDelete(id: string): Promise<void> {
    const post = await this.findByIdWithRelations(id);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    await this.postRepository.softDelete(id);
  }


  async restorePost(postId: string): Promise<Post | null> {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      withDeleted: true,
    })

    if (!post) {
      throw new NotFoundException("Post not found");
    }

    if (!post.deletedAt) {
      throw new BadRequestException("Post is not deleted");
    }

    await this.postRepository.restore(postId);
    return this.postRepository.findOneBy({ id: postId });
  }

  async hardDeletePost(postId: string): Promise<void> {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      withDeleted: true,
      relations: ['author'],
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    await this.postRepository.delete(postId);
  }

  async findByIdWithRelations(id: string, relations: string[] = []): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations,
    });

    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }

    return post;
  }


}
