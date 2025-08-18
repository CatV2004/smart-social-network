import { forwardRef, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Media } from './entities/media.entity';
import { CreateMediaDto } from './dto/create-media.dto';
import { CloudinaryService } from '@/cloudinary/cloudinary.service';
import { PostsService } from '../posts/posts.service';
import { MediaResponseDto } from './dto/response-media.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);
  constructor(
    @InjectRepository(Media) private mediaRepo: Repository<Media>,

    @Inject(forwardRef(() => PostsService))
    private readonly postsService: PostsService,
    
    private cloudinary: CloudinaryService,
  ) { }

  async uploadMultipleMedia(
    files: Express.Multer.File[],
    dto: CreateMediaDto
  ): Promise<MediaResponseDto[]> {
    const post = await this.postsService.findByIdWithRelations(dto.postId);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const folderPath = `posts/${dto.type}`;
    const mediaEntities: Media[] = [];

    for (const file of files) {
      const result = await this.cloudinary.uploadFile(file, folderPath);
      // this.logger.debug(`Cloudinary upload result: ${JSON.stringify(result, null, 2)}`);

      const media = this.mediaRepo.create({
        type: dto.type,
        url: result.secure_url,
        publicId: result.public_id,
        thumbnail: result.thumbnail_url ?? null,
        duration: result.duration ?? null,
        width: result.width ?? null,
        height: result.height ?? null,
        post: post,
      });

      mediaEntities.push(media);
    }
    const mediaSaved = await this.mediaRepo.save(mediaEntities);

    return plainToInstance(MediaResponseDto, mediaSaved, {
      excludeExtraneousValues: true,
    });
  }


  async getMediaByPost(postId: string): Promise<Media[]> {
    const post = await this.postsService.findByIdWithRelations(postId);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return this.mediaRepo.find({
      where: { post: { id: postId } },
      order: { createdAt: 'DESC' },
    });
  }

  async deleteMediaById(mediaId: string): Promise<void> {
    const media = await this.mediaRepo.findOne({ where: { id: mediaId } });
    if (!media) throw new NotFoundException('Media not found');

    // Xoá file trên Cloudinary
    await this.cloudinary.deleteFile(media.publicId);

    // Xoá trong DB
    await this.mediaRepo.remove(media);
  }

  async deleteMediaByPostId(postId: string): Promise<void> {
    const mediaList = await this.mediaRepo.find({ where: { post: { id: postId } } });
    for (const media of mediaList) {
      await this.cloudinary.deleteFile(media.publicId);
    }
    await this.mediaRepo.remove(mediaList);
  }

  async updateMedia(mediaId: string, newFile: Express.Multer.File): Promise<MediaResponseDto> {
    const media = await this.mediaRepo.findOne({ where: { id: mediaId } });
    if (!media) throw new NotFoundException('Media not found');

    // Xoá trên Cloudinary
    await this.cloudinary.deleteFile(media.publicId);

    // Upload file mới
    const result = await this.cloudinary.uploadFile(newFile, `posts/${media.type}`);

    media.url = result.secure_url;
    media.publicId = result.public_id;
    media.width = result.width;
    media.height = result.height;
    media.thumbnail = result.thumbnail_url ?? null;
    media.duration = result.duration ?? null;

    await this.mediaRepo.save(media);

    return plainToInstance(MediaResponseDto, media, { excludeExtraneousValues: true });
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
