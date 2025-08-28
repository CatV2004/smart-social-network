import { UserPublicDto } from '@/modules/users/dtos/user-public.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class ProfilePublicMsgDto {
    @ApiProperty()
    @Expose()
    id: string;

    @ApiProperty()
    @Expose()
    avatar?: string;

    @ApiProperty()
    @Expose()
    bio: string;

    @ApiProperty()
    @Type(() => UserPublicDto)
    @Expose()
    user: UserPublicDto;
}
