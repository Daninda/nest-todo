import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from 'src/project/project.model';
import { ProjectService } from 'src/project/project.service';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { TodoColumn } from './column.model';

@Injectable()
export class ColumnService {
  constructor(
    @InjectRepository(TodoColumn)
    private projectRepository: Repository<Project>,
    @InjectRepository(TodoColumn)
    private columnRepository: Repository<TodoColumn>,
    private projectService: ProjectService,
    private userService: UserService,
  ) {}

  async findOneByUserIdAndColumnId(userId: number, columnId: number) {
    const column = await this.columnRepository.findOne({
      where: { id: columnId },
      relations: {
        project: {
          user: true,
        },
      },
    });

    if (!column) {
      throw new BadRequestException('This column does not exist');
    }

    if (column.project.user.id !== userId) {
      throw new ForbiddenException('Unable to access the column');
    }

    delete column.project;

    return column;
  }
}
