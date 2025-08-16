import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

export class CommentAuthorDto {
  @ApiProperty({ description: 'Profile ID of the comment author' })
  @Expose()
  id: string;

  @ApiProperty({ description: 'Name of the comment author' })
  @Expose()
  @Transform(({ obj }) => {
    const first = obj.user?.firstName ?? '';
    const last = obj.user?.lastName ?? '';
    const full  = `${first} ${last}`.trim();
    return full || undefined;
  }, { toClassOnly: true })
  fullName?: string;

  @ApiProperty({ description: 'Avatar URL of the author' })
  @Expose()
  avatar?: string;
}
