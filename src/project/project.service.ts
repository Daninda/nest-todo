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

  async findAll(userId: number) {
    const projects = await this.projectRepository.findBy({
      user: { id: userId },
    });

    return projects;
  }

  async findOneById(userId: number, id: number) {
    const project = await this.checkProjectAbility(userId, id);

    return project;
  }

  async create(userId: number, projectDto: CreateProjectDto) {
    const user = await this.userService.findOneById(userId);
    const { id } = await this.projectRepository.save({
      name: projectDto.name,
      description: projectDto.description,
      user: user,
    });
    return await this.projectRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        columns: {
          tasks: true,
        },
      },
    });
  }

  async updateById(userId: number, id: number, projectDto: CreateProjectDto) {
    const project = await this.checkProjectAbility(userId, id);

    const updatedProject = this.projectRepository.merge(project, {
      name: projectDto.name,
      description: projectDto.description,
    });

    await this.projectRepository.save(updatedProject);

    return updatedProject;
  }

  async removeById(userId: number, id: number) {
    const project = await this.checkProjectAbility(userId, id);

    await this.projectRepository.remove(project);

    return project.id;
  }

  async checkProjectAbility(userId: number, projectId: number) {
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
      order: {
        columns: {
          position: 'ASC',
          tasks: {
            position: 'ASC',
          },
        },
      },
      relations: {
        user: true,
        columns: {
          tasks: true,
        },
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
}
