import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegistrationUserDto } from './dto/registration-user.dto';
import { AuthResponseType } from './utils/auth-response.type';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({
    status: 201,
    type: AuthResponseType,
  })
  @Post('login')
  async login(@Body() userDto: LoginUserDto) {
    const res = await this.authService.login(userDto);
    delete res.user.password;
    return res;
  }

  @ApiOperation({ summary: 'Registration user' })
  @ApiResponse({
    status: 201,
    type: AuthResponseType,
  })
  @Post('registration')
  async registration(@Body() userDto: RegistrationUserDto) {
    return this.authService.registration(userDto);
  }
}
