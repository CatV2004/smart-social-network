import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiErrorResponse } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { UploadApiResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
    constructor(private configService: ConfigService) {
        cloudinary.config({
            cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
            api_key: this.configService.get('CLOUDINARY_API_KEY'),
            api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
        });
    }

    async uploadFile(
        file: Express.Multer.File,
        folder: string,
    ): Promise<UploadApiResponse> {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { 
                    folder,
                    resource_type: 'auto', 
                },
                (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
                    if (error || !result) return reject(error || new Error('Upload failed'));
                    resolve(result);
                },
            );
            uploadStream.end(file.buffer);
        });
    }
}
