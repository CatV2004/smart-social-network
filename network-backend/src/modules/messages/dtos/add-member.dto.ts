import { ApiProperty } from '@nestjs/swagger';

export class AddMemberDto {
    @ApiProperty({ description: 'UserId to add' })
    userId: string;

    @ApiProperty({ description: 'Role of the member', example: 'MEMBER' })
    role?: 'ADMIN' | 'MEMBER' = 'MEMBER';
}
