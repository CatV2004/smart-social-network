import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'Email of user', example: 'atest@email.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'First name of user', example: 'John' })
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ description: 'Last name of user', example: 'Doe' })
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ description: 'Password of user', example: 'P@ssw0rd' })
  @MinLength(6)
  password: string;
}
