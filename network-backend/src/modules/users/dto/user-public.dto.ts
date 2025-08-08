import { ProfilePublicDto } from '@/modules/profiles/dto/profile-public.dto';
import { Expose, Type } from 'class-transformer';

export class UserPublicDto {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Type(() => ProfilePublicDto)
  @Expose()
  profile: ProfilePublicDto;
}
