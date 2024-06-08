import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, MinLength } from 'class-validator';

export class CreateColumnDto {
  @ApiProperty({ description: 'Column name', example: 'Column name' })
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty({ description: 'Column project id', example: 7 })
  @IsNumber()
  projectId: number;
}
