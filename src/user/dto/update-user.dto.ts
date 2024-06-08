import { ApiProperty } from '@nestjs/swagger';
import { MinLength } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ description: 'User name', example: 'username' })
  @MinLength(3)
  name: string;
}
