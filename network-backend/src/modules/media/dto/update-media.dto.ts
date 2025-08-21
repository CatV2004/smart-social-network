import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, IsUUID } from "class-validator";
import { MediaType } from "../types/media.types";

export class UpdateMediaDto {
    @ApiPropertyOptional({ description: 'ID of existing media (if updating)' })
    @IsOptional()
    @IsUUID()
    id?: string;

    @ApiPropertyOptional({ description: 'Temporary key to map uploaded file' })
    @IsOptional()
    @IsString()
    key?: string;

    @ApiPropertyOptional({ description: 'Media file (multipart/form-data)' })
    @IsOptional()
    file?: Express.Multer.File;

    @ApiPropertyOptional({ enum: MediaType, description: 'Media type (for new media)' })
    @IsOptional()
    type?: MediaType;
}