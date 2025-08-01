import { Module } from '@nestjs/common';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { CloudinaryService } from '@/cloudinary/cloudinary.service';
import { CloudinaryModule } from '@/cloudinary/cloudinary.module';

@Module({
  imports: [CloudinaryModule],
  controllers: [MediaController],
  providers: [MediaService, CloudinaryService],
  exports: [CloudinaryService, MediaService], 
})
export class MediaModule {}
