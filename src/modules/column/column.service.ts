import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectService } from 'src/modules/project/project.service';
import { Repository } from 'typeorm';
import { TodoColumn } from './column.model';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';

@Injectable()
export class ColumnService {
  constructor(
    @InjectRepository(TodoColumn)
    private columnRepository: Repository<TodoColumn>,
    private projectService: ProjectService,
  ) {}

  async findAll(userId: number, projectId: number) {
    const project = await this.projectService.checkProjectAbility(
      userId,
      projectId,
    );

    return project.columns;
  }

  async findOneById(userId: number, projectId: number, columnId: number) {
    const column = await this.checkColumnAbility(userId, projectId, columnId);

    delete column.project;

    return column;
  }

  async create(userId: number, projectId: number, columnDto: CreateColumnDto) {
    const project = await this.projectService.checkProjectAbility(
      userId,
      projectId,
    );

    let position = 0;
    if (project.columns.length !== 0) {
      position = project.columns.at(-1).position + 1;
    }

    const column = await this.columnRepository.save({
      name: columnDto.name,
      position: position,
      project: {
        id: projectId,
      },
    });

    delete column.project;

    return column;
  }

  async updateById(
    userId: number,
    projectId,
    columnId: number,
    columnDto: UpdateColumnDto,
  ) {
    const column = await this.checkColumnAbility(userId, projectId, columnId);

    const updatedColumn = this.columnRepository.merge(column, {
      name: columnDto.name,
    });

    await this.columnRepository.save(updatedColumn);

    delete updatedColumn.project;

    return updatedColumn;
  }

  async removeById(userId: number, projectId: number, columnId: number) {
    await this.changePositionById(userId, projectId, columnId, -1);
    const column = await this.checkColumnAbility(userId, projectId, columnId);

    await this.columnRepository.remove(column);

    return { id: columnId };
  }

  async changePositionById(
    userId: number,
    projectId: number,
    columnId: number,
    newPosition: number,
  ) {
    const column = await this.checkColumnAbility(userId, projectId, columnId);
    const oldPosition = column.position;
    const project = await this.projectService.checkProjectAbility(
      userId,
      projectId,
    );
    const columns = project.columns;
    if (newPosition <= -1 || newPosition >= columns.length) {
      newPosition = columns.length - 1;
    }
    if (newPosition <= oldPosition) {
      for (let i = 0; i < columns.length; i++) {
        if (columns[i].id === columnId) {
          columns[i].position = newPosition;
        } else if (
          columns[i].position >= newPosition &&
          columns[i].position <= oldPosition
        ) {
          columns[i].position += 1;
        }
      }
    } else {
      for (let i = 0; i < columns.length; i++) {
        if (columns[i].id === columnId) {
          columns[i].position = newPosition;
        } else if (
          columns[i].position <= newPosition &&
          columns[i].position >= oldPosition
        ) {
          columns[i].position -= 1;
        }
      }
    }
    await this.columnRepository.save(columns);

    column.position = newPosition;

    delete column.project;

    return column;
  }

  async checkColumnAbility(
    userId: number,
    projectId: number,
    columnId: number,
  ) {
    const column = await this.columnRepository.findOne({
      where: { id: columnId },
      order: {
        position: 'ASC',
        tasks: {
          position: 'ASC',
        },
      },
      relations: {
        tasks: true,
        project: {
          user: true,
        },
      },
    });

    if (!column) {
      throw new BadRequestException('This column does not exist');
    }

    if (column.project.id !== projectId) {
      throw new ForbiddenException('Wrong project id');
    }

    if (column.project.user.id !== userId) {
      throw new ForbiddenException('Unable to access');
    }

    return column;
  }
}
