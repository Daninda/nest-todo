import { ApiProperty, OmitType } from '@nestjs/swagger';
import { User } from 'src/user/user.model';

export class AuthResponseType {
  @ApiProperty({ type: () => OmitType(User, ['password']) })
  user: User;

  @ApiProperty({ description: 'Auth access token' })
  token: string;
}
