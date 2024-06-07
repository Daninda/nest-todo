import { Body, Controller, Delete, Get, Put, UseGuards } from '@nestjs/common';
import {
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
  OmitType,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserId } from 'src/decorators/user-id.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.model';
import { UserService } from './user.service';

@ApiTags('Users')
@ApiHeader({
  name: 'Authorization',
  description: 'Access token',
})
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOperation({ summary: 'Get user info' })
  @ApiResponse({
    status: 200,
    type: OmitType(User, ['password']),
  })
  @Get()
  @UseGuards(JwtAuthGuard)
  async getOne(@UserId() id: number) {
    const user = await this.userService.findOneById(id);
    delete user.password;
    return user;
  }

  @ApiOperation({ summary: 'Update user info' })
  @ApiResponse({
    status: 200,
    type: OmitType(User, ['password']),
  })
  @Put()
  @UseGuards(JwtAuthGuard)
  async update(@UserId() id: number, @Body() userDto: UpdateUserDto) {
    const user = await this.userService.updateById(id, userDto);
    delete user.password;
    return user;
  }

  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({
    status: 200,
    type: OmitType(User, ['password']),
  })
  @Delete()
  @UseGuards(JwtAuthGuard)
  async remove(@UserId() id: number) {
    const user = await this.userService.removeById(id);
    delete user.password;
    return user;
  }
}
