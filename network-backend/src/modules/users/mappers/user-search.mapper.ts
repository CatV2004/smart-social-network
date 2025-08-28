import { User } from '../entities/user.entity';
import { UserSearchDto } from '@/modules/search/dtos/user-search.dto';

export class UserSearchMapper {
    static toDto(user: User): UserSearchDto {
        return {
            id: user.id,
            username: user.username,
            fullName: `${user.firstName} ${user.lastName}`.trim(),
            email: user.email,
            avatar: user.profile?.avatar ?? undefined,
        };
    }

    static toDtos(users: User[]): UserSearchDto[] {
        return users.map(user => this.toDto(user));
    }

    // Optional: Method for partial mapping if needed
    static toPartialDto(user: Partial<User>): Partial<UserSearchDto> {
        const dto: Partial<UserSearchDto> = {};

        if (user.id !== undefined) dto.id = user.id;
        if (user.username !== undefined) dto.username = user.username;
        if (user.firstName !== undefined || user.lastName !== undefined) {
            dto.fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
        }
        if (user.email !== undefined) dto.email = user.email;
        if (user.profile?.avatar !== undefined) dto.avatar = user.profile.avatar;

        return dto;
    }
}