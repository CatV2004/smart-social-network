import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, MinLength } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({ description: 'Email of user', example: 'new@email.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ description: 'First name of user', example: 'Jane' })
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional({ description: 'Last name of user', example: 'Smith' })
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional({ description: 'Password of user', example: 'NewP@ss123' })
  @MinLength(6)
  @IsOptional()
  password?: string;
}
