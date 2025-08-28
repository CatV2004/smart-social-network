import { ApiProperty } from "@nestjs/swagger";

export class MessageAttachmentResponseDto {
    @ApiProperty()
    url: string;

    @ApiProperty()
    type: string;

    @ApiProperty()
    publicId: string;
}