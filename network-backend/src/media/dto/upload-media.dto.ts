import { IsIn, IsNotEmpty } from 'class-validator';

export class UploadMediaDto {
  @IsNotEmpty()
  @IsIn(['image', 'video', 'audio'], {
    message: 'Type must be one of: image, video, audio',
  })
  type: 'image' | 'video' | 'audio';
}
