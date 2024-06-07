import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MinLength } from 'class-validator';

export class RegistrationUserDto {
  @ApiProperty({ description: 'user name' })
  @MinLength(3)
  name: string;

  @ApiProperty({ description: 'user email' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'user password' })
  @MinLength(6)
  password: string;
}
