import { Expose } from 'class-transformer';

export class ProfilePublicDto {
    @Expose()
    id: string;

    @Expose()
    avatar?: string;
}
