import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({ description: 'project name' })
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty({ description: 'project description' })
  @IsString()
  @MinLength(3)
  description: string;
}
