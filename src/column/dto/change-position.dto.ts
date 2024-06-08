import { IsNumber, Min } from 'class-validator';

export class ChangePositionDto {
  @IsNumber()
  @Min(0)
  newPosition: number;
}
