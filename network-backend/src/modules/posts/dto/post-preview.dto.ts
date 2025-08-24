import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";

export class PostPreviewDto {
    @ApiProperty()
    @Expose() id: string;

    @ApiProperty({ required: false })
    @Expose() previewUrl?: string; 
}