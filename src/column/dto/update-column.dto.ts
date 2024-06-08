import { IsString, MinLength } from 'class-validator';

export class UpdateColumnDto {
  @IsString()
  @MinLength(3)
  name: string;
}
