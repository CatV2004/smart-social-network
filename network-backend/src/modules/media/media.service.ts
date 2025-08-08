import { forwardRef, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Media } from './entities/media.entity';
import { CreateMediaDto } from './dto/create-media.dto';
import { CloudinaryService } from '@/cloudinary/cloudinary.service';
import { PostsService } from '../posts/posts.service';

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);
  constructor(
    @InjectRepository(Media) private mediaRepo: Repository<Media>,
    private readonly postsService: PostsService,
    private cloudinary: CloudinaryService,
  ) { }

  async uploadMultipleMedia(
    files: Express.Multer.File[],
    dto: CreateMediaDto
  ): Promise<Media[]> {
    const post = await this.postsService.findById(dto.postId);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const folderPath = `posts/${dto.type}`;
    const mediaEntities: Media[] = [];

    for (const file of files) {
      const result = await this.cloudinary.uploadFile(file, folderPath);
      this.logger.debug(`Cloudinary upload result: ${JSON.stringify(result, null, 2)}`);

      const media = this.mediaRepo.create({
        type: dto.type,
        url: result.secure_url,
        thumbnail: result.thumbnail_url ?? null,
        duration: result.duration ?? null,
        width: result.width ?? null,
        height: result.height ?? null,
        post: post,
      });

      mediaEntities.push(media);
    }

    return await this.mediaRepo.save(mediaEntities); 
  }


  async getMediaByPost(postId: string): Promise<Media[]> {
    const post = await this.postsService.findById(postId);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return this.mediaRepo.find({
      where: { post: { id: postId } },
      order: { createdAt: 'DESC' },
    });
  }

  // Upload avatar, cover, logo
  async uploadAvatar(file: Express.Multer.File) {
    return this.cloudinary.uploadFile(file, 'avatars');
  }

  async uploadCover(file: Express.Multer.File) {
    return this.cloudinary.uploadFile(file, 'covers');
  }

  async uploadLogo(file: Express.Multer.File) {
    return this.cloudinary.uploadFile(file, 'logo');
  }
}
