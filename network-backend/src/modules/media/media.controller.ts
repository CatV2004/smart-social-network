import {
  Controller,
  Get,
  Post as HttpPost,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  Post,
  UseInterceptors,
  UploadedFile,
  ValidationPipe,
  UploadedFiles,
} from '@nestjs/common';
import { MediaService } from './media.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { Media } from './entities/media.entity';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiQuery,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { Public } from '@/common/decorators/public.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';

@ApiTags('Media')
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @ApiOperation({ summary: 'Upload media file (image/video)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        postId: {
          type: 'string',
        },
        type: {
          type: 'string',
          enum: ['IMAGE', 'VIDEO'],
        },
      },
      required: ['file', 'postId', 'type'],
    },
  })
  @ApiCreatedResponse({ type: Media })
  @HttpPost('upload')
  @UseInterceptors(FilesInterceptor('files', 10))
  async uploadMedia(
    @UploadedFiles() files: Express.Multer.File[],
    @Body(new ValidationPipe({ transform: true })) createMediaDto: CreateMediaDto,
  ): Promise<Media[]> {
    return this.mediaService.uploadMultipleMedia(files, createMediaDto);
  }

  @ApiOperation({ summary: 'Get media files by post ID' })
  @ApiQuery({ name: 'postId', type: 'string' })
  @Get()
  async getMediaByPost(@Query('postId') postId: string): Promise<Media[]> {
    return this.mediaService.getMediaByPost(postId);
  }
}

