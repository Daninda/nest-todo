import { ApiProperty } from '@nestjs/swagger';
import { MinLength } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ description: 'user name' })
  @MinLength(3)
  name: string;
}
