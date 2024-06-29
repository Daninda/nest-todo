import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ColumnService } from '../column/column.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './task.model';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    private columnService: ColumnService,
  ) {}

  async findAll(userId: number, projectId: number, columnId: number) {
    const column = await this.columnService.checkColumnAbility(
      userId,
      projectId,
      columnId,
    );

    return column.tasks;
  }

  async findOneById(
    userId: number,
    projectId: number,
    columnId: number,
    taskId: number,
  ) {
    const task = await this.checkTaskAbility(
      userId,
      projectId,
      columnId,
      taskId,
    );

    delete task.column;

    return task;
  }

  async create(
    userId: number,
    projectId: number,
    columnId: number,
    taskDto: CreateTaskDto,
  ) {
    const column = await this.columnService.checkColumnAbility(
      userId,
      projectId,
      columnId,
    );

    let position = 0;
    if (column.tasks.length !== 0) {
      position = column.tasks.at(-1).position + 1;
    }

    const task = await this.taskRepository.save({
      name: taskDto.name,
      description: taskDto.description,
      position: position,
      column: {
        id: columnId,
      },
    });

    delete task.column;

    return task;
  }

  async updateById(
    userId: number,
    projectId: number,
    columnId: number,
    taskId: number,
    taskDto: UpdateTaskDto,
  ) {
    const task = await this.checkTaskAbility(
      userId,
      projectId,
      columnId,
      taskId,
    );

    const updatedTask = this.taskRepository.merge(task, {
      name: taskDto.name,
      description: taskDto.description,
    });

    await this.taskRepository.save(updatedTask);

    delete updatedTask.column;

    return updatedTask;
  }

  async removeById(
    userId: number,
    projectId: number,
    columnId: number,
    taskId: number,
  ) {
    await this.changePositionById(userId, projectId, columnId, taskId, -1);
    const task = await this.checkTaskAbility(
      userId,
      projectId,
      columnId,
      taskId,
    );

    await this.taskRepository.remove(task);

    return { id: taskId };
  }

  async changePositionById(
    userId: number,
    projectId: number,
    columnId: number,
    taskId: number,
    newPosition: number,
    newColumnId?: number,
  ) {
    const task = await this.checkTaskAbility(
      userId,
      projectId,
      columnId,
      taskId,
    );
    const column = await this.columnService.checkColumnAbility(
      userId,
      projectId,
      columnId,
    );

    if (!newColumnId || columnId === newColumnId) {
      const oldPosition = task.position;
      const tasks = column.tasks;
      if (newPosition <= -1 || newPosition >= tasks.length) {
        newPosition = tasks.length - 1;
      }

      if (newPosition <= oldPosition) {
        for (let i = 0; i < tasks.length; i++) {
          if (tasks[i].id === taskId) {
            tasks[i].position = newPosition;
          } else if (
            tasks[i].position >= newPosition &&
            tasks[i].position <= oldPosition
          ) {
            tasks[i].position += 1;
          }
        }
      } else {
        for (let i = 0; i < tasks.length; i++) {
          if (tasks[i].id === taskId) {
            tasks[i].position = newPosition;
          } else if (
            tasks[i].position <= newPosition &&
            tasks[i].position >= oldPosition
          ) {
            tasks[i].position -= 1;
          }
        }
      }
      await this.taskRepository.save(tasks);

      task.position = newPosition;
      delete task.column;

      return task;
    } else {
      const newColumn = await this.columnService.checkColumnAbility(
        userId,
        projectId,
        newColumnId,
      );

      if (newPosition <= -1 || newPosition > newColumn.tasks.length) {
        newPosition = newColumn.tasks.length;
      }

      await this.changePositionById(userId, projectId, columnId, taskId, -1);
      task.position = column.tasks.length;
      const changedTask = await this.taskRepository.save({
        ...task,
        column: {
          id: newColumnId,
        },
      });
      return await this.changePositionById(
        userId,
        projectId,
        newColumnId,
        changedTask.id,
        newPosition,
      );
    }
  }

  async checkTaskAbility(
    userId: number,
    projectId: number,
    columnId: number,
    taskId: number,
  ) {
    const task = await this.taskRepository.findOne({
      where: {
        id: taskId,
      },
      order: {
        position: 'ASC',
      },
      relations: {
        taskFieldValueNumbers: {
          taskField: true,
        },
        taskFieldValueStrings: {
          taskField: true,
        },
        column: {
          project: {
            user: true,
          },
        },
      },
    });

    if (!task) {
      throw new BadRequestException('This task does not exist');
    }

    if (task.column.id !== columnId) {
      throw new ForbiddenException('Wrong column id');
    }

    if (task.column.project.id !== projectId) {
      throw new ForbiddenException('Wrong project id');
    }

    if (task.column.project.user.id !== userId) {
      throw new ForbiddenException('Unable to access');
    }

    return task;
  }
}
