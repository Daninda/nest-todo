import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class UpdateTaskFieldDto {
  @ApiProperty({ description: 'Task field name', example: 'Task field name' })
  @IsString()
  @MinLength(3)
  name: string;
}
