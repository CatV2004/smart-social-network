import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
    Body,
    ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaService } from './media.service';
import { UploadMediaDto } from './dto/upload-media.dto';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Public } from '@/common/decorators/public.decorator';

@ApiTags('Media')
@Controller('media')
export class MediaController {
    constructor(private mediaService: MediaService) { }

    @Post('upload/avatar')
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @Public()
    @UseInterceptors(FileInterceptor('file'))
    uploadAvatar(@UploadedFile() file: Express.Multer.File) {
        return this.mediaService.uploadAvatar(file);
    }

    @Post('upload/cover')
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @Public()
    @UseInterceptors(FileInterceptor('file'))
    uploadCover(@UploadedFile() file: Express.Multer.File) {
        return this.mediaService.uploadCover(file);
    }

    @Post('upload/logo')
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @Public()
    @UseInterceptors(FileInterceptor('file'))
    uploadLogo(@UploadedFile() file: Express.Multer.File) {
        return this.mediaService.uploadLogo(file);
    }

    @Post('upload/post-media')
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
                type: {
                    type: 'string',
                    enum: ['image', 'video', 'audio', 'other'],
                    example: 'image',
                },
            },
            required: ['file', 'type'],
        },
    })
    @Public()
    @UseInterceptors(FileInterceptor('file'))
    async uploadPostMedia(
        @UploadedFile() file: Express.Multer.File,
        @Body(ValidationPipe) body: UploadMediaDto,
    ) {
        return this.mediaService.uploadPostMedia(file, body.type);
    }
}
