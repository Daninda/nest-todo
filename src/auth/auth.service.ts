import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { User } from 'src/user/user.model';
import { UserService } from 'src/user/user.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegistrationUserDto } from './dto/registration-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    @Inject() private jwtService: JwtService,
  ) {}

  async login(userDto: LoginUserDto) {
    const user = await this.validateUser(userDto);

    const token = this.generateToken(user);
    return {
      user: user,
      token: token,
    };
  }

  async registration(userDto: RegistrationUserDto) {
    const hashPassword = await argon2.hash(userDto.password);
    const userWithHash: RegistrationUserDto = {
      ...userDto,
      password: hashPassword,
    };
    const user = await this.userService.createUser(userWithHash);
    const token = this.generateToken(user);
    return {
      user: user,
      token: token,
    };
  }

  private generateToken(user: User) {
    const payload = { id: user.id, email: user.email };
    const token = this.jwtService.sign(payload);
    return token;
  }

  private async validateUser(userDto: LoginUserDto) {
    const user = await this.userService.findOneByEmail(userDto.email);

    if (!user || !(await argon2.verify(user.password, userDto.password))) {
      throw new UnauthorizedException('Password are incorrect');
    }

    return user;
  }
}
