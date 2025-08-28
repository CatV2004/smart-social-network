import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';

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

  @ApiProperty({
    description: 'Unique username (only letters, numbers, underscore, dot)',
    example: 'haophan1102',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  @Matches(/^[a-zA-Z0-9._]+$/, {
    message: 'Username chỉ được chứa chữ cái, số, dấu chấm và gạch dưới',
  })
  username: string;
}
