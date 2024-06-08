import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, MinLength } from 'class-validator';

export class CreateTaskDto {
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

  @ApiProperty({ description: 'Task column id', example: 3 })
  @IsNumber()
  columnId: number;
}
