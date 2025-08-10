import { UserPublicDto } from '@/modules/users/dto/user-public.dto';
import { Expose, Type } from 'class-transformer';

export class ProfilePublicDto {
    @Expose()
    id: string;

    @Expose()
    avatar?: string;

    @Expose()
    bio: string;

    @Type(() => UserPublicDto)
    @Expose()
    user: UserPublicDto;

}
