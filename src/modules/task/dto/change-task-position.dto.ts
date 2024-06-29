import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class ChangeTaskPositionDto {
  @ApiProperty({ description: 'New task position', example: 4 })
  @IsNumber()
  @Min(0)
  newPosition: number;

  @ApiProperty({ description: 'Column id', example: 2 })
  @IsOptional()
  @IsNumber()
  newColumnId: number;
}
