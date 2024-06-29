import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class ChangeColumnPositionDto {
  @ApiProperty({ description: 'New column position', example: 4 })
  @IsNumber()
  @Min(0)
  newPosition: number;
}
