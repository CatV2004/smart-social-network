import { PostPreviewDto } from "@/modules/posts/dto/post-preview.dto";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";

export class CommentPreviewDto {
    @ApiProperty()
    @Expose() id: string;

    @ApiProperty()
    @Expose() content: string;

    @ApiProperty({ type: () => PostPreviewDto })
    @Expose()
    @Type(() => PostPreviewDto)
    post: PostPreviewDto;
}