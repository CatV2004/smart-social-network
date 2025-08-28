import { UserPublicDto } from '@/modules/users/dtos/user-public.dto';
import { ConversationMemberResponseDto } from '../dtos/conversation-member-response.dto';
import { ConversationMember } from '../entities/conversation-member.entity';
import { ProfilePublicMsgDto } from '@/modules/profiles/dtos/profile-public-msg.dto';

export class ConversationMemberMapper {
    static toResponseDto(entity: ConversationMember): ConversationMemberResponseDto {
        const user = entity.user;

        const profile: ProfilePublicMsgDto = {
            id: user.profile?.id ?? '',
            avatar: user.profile?.avatar ?? undefined,
            bio: user.profile?.bio ?? '',
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
            } as UserPublicDto,
        };
        return {
            id: entity.id,
            role: entity.role,
            profile: profile,
        };
    }
}
