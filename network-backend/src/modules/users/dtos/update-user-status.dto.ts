import { ApiProperty } from "@nestjs/swagger";
import { UserStatus } from "../types/UserStatus";
import { IsEnum } from "class-validator";

export class UpdateUserStatusDto {
    @ApiProperty({ enum: UserStatus, example: UserStatus.BANNED })
    @IsEnum(UserStatus, { message: 'Status must be one of ACTIVE, BANNED, SUSPENDED, PENDING' })
    status: UserStatus;
}