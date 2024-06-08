import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/user.model';

export class AuthResponseType {
  @ApiProperty({ type: User })
  user: User;

  @ApiProperty({ description: 'Auth access token', example: 'Bearer token' })
  token: string;
}
