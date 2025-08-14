import { UserPublicDto } from '@/modules/users/dto/user-public.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class ProfilePublicDto {
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
    @Expose()
    followersCount: number;

    @ApiProperty()
    @Expose()
    followingCount: number;

    @ApiProperty()
    @Type(() => UserPublicDto)
    @Expose()
    user: UserPublicDto;
}
