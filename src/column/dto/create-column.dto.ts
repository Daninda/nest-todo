import { IsNumber, IsString, MinLength } from 'class-validator';

export class CreateColumnDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsNumber()
  projectId: number;
}
