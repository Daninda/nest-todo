import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class UpdateColumnDto {
  @ApiProperty({ description: 'Column name', example: 'Column name' })
  @IsString()
  @MinLength(3)
  name: string;
}
