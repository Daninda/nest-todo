import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../project.model';

@Injectable()
export class ProjectAccessGuard implements CanActivate {
  constructor(
    @InjectRepository(Project) private projectRepository: Repository<Project>,
  ) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const userId = req.user.id;
    const projectId = req.params.id;

    const project = await this.projectRepository.findOne({
      where: { id: projectId },
      relations: {
        user: true,
      },
    });

    if (!project) {
      throw new BadRequestException('This project does not exist');
    }

    if (project.user.id !== userId) {
      throw new ForbiddenException('Unable to access the project');
    }

    return true;
  }
}
