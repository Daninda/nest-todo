import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, MinLength } from 'class-validator';
import { TaskFieldTypeEnum } from '../task-field.utils';

export class CreateTaskFieldDto {
  @ApiProperty({ description: 'Task field name', example: 'Task field name' })
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty({
    description: 'Task field type',
    enum: TaskFieldTypeEnum,
    example: 'number',
  })
  @IsEnum(TaskFieldTypeEnum)
  type: TaskFieldTypeEnum;
}
