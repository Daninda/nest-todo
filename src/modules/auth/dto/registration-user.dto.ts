import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MinLength } from 'class-validator';

export class RegistrationUserDto {
  @ApiProperty({ description: 'user name', example: 'username' })
  @MinLength(3)
  name: string;

  @ApiProperty({ description: 'user email', example: 'email@email.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'user password', example: 'password' })
  @MinLength(6)
  password: string;
}
