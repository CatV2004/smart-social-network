import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, IsUUID, IsArray, Validate } from 'class-validator';
import { IsMemberIdsValid } from '../validators/is-memberIds.validator';

export class CreateConversationDto {
    @ApiProperty({ description: 'Is this a group conversation?', example: false })
    @IsBoolean()
    isGroup: boolean;

    @ApiProperty({ description: 'Name of the conversation (for group chats)', required: false })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({ description: 'Avatar of the conversation (for group chats)', required: false })
    @IsOptional()
    @IsString()
    avatar?: string;

    @ApiProperty({ description: 'List of member userIds', type: [String] })
    @IsArray()
    @IsUUID('all', { each: true })
    @Validate(IsMemberIdsValid)
    memberIds: string[];
}
