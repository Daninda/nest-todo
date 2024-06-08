import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegistrationUserDto } from 'src/auth/dto/registration-user.dto';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async createUser(userDto: RegistrationUserDto) {
    const exists = await this.userRepository.findOne({
      where: { email: userDto.email },
    });

    if (exists) {
      throw new BadRequestException('User with this email already exists');
    }

    const user = await this.userRepository.save(userDto);
    return user;
  }

  async findOneById(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new BadRequestException('This user does not exist');
    }

    return user;
  }

  async findOneByEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new BadRequestException('This user does not exist');
    }

    return user;
  }

  async updateById(id: number, userDto: UpdateUserDto) {
    const user = await this.findOneById(id);
    user.name = userDto.name;
    const updatedUser = await this.userRepository.save(user);
    return updatedUser;
  }

  async removeById(id: number) {
    const user = await this.findOneById(id);
    const removedUser = await this.userRepository.remove(user);
    return removedUser.id;
  }
}
