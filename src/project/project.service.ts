import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { Project } from './project.model';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project) private projectRepository: Repository<Project>,
    private userService: UserService,
  ) {}

  async findAllByUserId(id: number) {
    const projects = await this.projectRepository.findBy({ user: { id: id } });

    return projects;
  }

  async findOneByIdAndUserId(userId: number, id: number) {
    const project = await this.projectRepository.findOne({
      where: { id: id },
      relations: {
        user: true,
        columns: { tasks: true },
      },
    });

    if (!project) {
      throw new BadRequestException('This project does not exist');
    }

    if (project.user.id !== userId) {
      throw new ForbiddenException('Unable to access the project');
    }

    delete project.user;

    return project;
  }

  async createByUserId(userId: number, projectDto: CreateProjectDto) {
    const user = await this.userService.findOneById(userId);
    const project = await this.projectRepository.save({
      name: projectDto.name,
      description: projectDto.description,
      user: user,
    });
    delete project.user;
    return project;
  }

  async updateOneByIdAndUserId(
    userId: number,
    id: number,
    projectDto: CreateProjectDto,
  ) {
    const exists = await this.projectRepository.findOne({
      where: { id: id },
      relations: { user: true },
    });

    if (!exists) {
      throw new BadRequestException('This project does not exist');
    }

    if (exists.user.id !== userId) {
      throw new ForbiddenException('Unable to access the project');
    }

    const updatedProject = this.projectRepository.merge(exists, {
      name: projectDto.name,
      description: projectDto.description,
    });

    await this.projectRepository.save(updatedProject);

    delete updatedProject.user;

    return updatedProject;
  }

  async removeOneByIdAndUserId(userId: number, id: number) {
    const exists = await this.projectRepository.findOne({
      where: { id: id },
      relations: { user: true },
    });

    if (!exists) {
      throw new BadRequestException('This project does not exist');
    }

    if (exists.user.id !== userId) {
      throw new ForbiddenException('Unable to access the project');
    }

    const removedProject = await this.projectRepository.remove(exists);

    return removedProject;
  }
}
