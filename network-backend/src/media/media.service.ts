import { BadRequestException, Injectable } from '@nestjs/common';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { fileTypeFromBuffer, FileTypeResult } from 'file-type';

@Injectable()
export class MediaService {
  constructor(private cloudinary: CloudinaryService) { }

  async uploadAvatar(file: Express.Multer.File) {
    return this.cloudinary.uploadFile(file, 'avatars');
  }

  async uploadCover(file: Express.Multer.File) {
    return this.cloudinary.uploadFile(file, 'covers');
  }

  async uploadLogo(file: Express.Multer.File) {
    return this.cloudinary.uploadFile(file, 'logo');
  }

  async uploadPostMedia(
    file: Express.Multer.File,
    expectedType: 'image' | 'video' | 'audio' | 'other',
  ) {
    if (!file?.buffer) {
      throw new BadRequestException('File not provided or invalid.');
    }

    const detected = await fileTypeFromBuffer(file.buffer);
    if (!detected) {
      throw new BadRequestException('Unable to detect file type.');
    }

    const typeRegexMap: Record<string, RegExp> = {
      image: /^image\//,
      video: /^video\//,
      audio: /^audio\//,
    };

    if (expectedType !== 'other') {
      const regex = typeRegexMap[expectedType];
      if (!regex.test(detected.mime)) {
        throw new BadRequestException(
          `Expected ${expectedType}, but got ${detected.mime}`,
        );
      }
    }

    return this.cloudinary.uploadFile(file, `posts/${expectedType}`);
  }
}
