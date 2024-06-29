import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class UpdateTaskDto {
  @ApiProperty({ description: 'Column task name', example: 'Task name' })
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty({
    description: 'Column task description',
    example: 'Task description',
  })
  @IsString()
  @MinLength(3)
  description: string;
}
