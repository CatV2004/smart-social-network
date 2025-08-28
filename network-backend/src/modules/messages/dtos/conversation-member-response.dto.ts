import { ProfilePublicMsgDto } from "@/modules/profiles/dtos/profile-public-msg.dto";
import { ApiProperty } from "@nestjs/swagger";

export class ConversationMemberResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty({ enum: ['ADMIN', 'MEMBER'] })
    role: string;

    @ApiProperty({ type: () => ProfilePublicMsgDto })
    profile: ProfilePublicMsgDto;
}