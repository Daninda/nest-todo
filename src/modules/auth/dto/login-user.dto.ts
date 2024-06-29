import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MinLength } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({ description: 'user email', example: 'email@email.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'user password', example: 'password' })
  @MinLength(6)
  password: string;
}
