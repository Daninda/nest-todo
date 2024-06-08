import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ColumnService } from 'src/column/column.service';
import { Repository } from 'typeorm';
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

  async findOneById(userId: number, id: number) {
    const task = await this.checkTaskAbility(userId, id);

    delete task.column;

    return task;
  }

  async create(userId: number, taskDto: CreateTaskDto) {
    const column = await this.columnService.checkColumnAbility(
      userId,
      taskDto.columnId,
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
        id: taskDto.columnId,
      },
    });

    delete task.column;

    return task;
  }

  async updateById(userId: number, id: number, taskDto: UpdateTaskDto) {
    const task = await this.checkTaskAbility(userId, id);

    const updatedTask = this.taskRepository.merge(task, {
      name: taskDto.name,
      description: taskDto.description,
    });

    await this.taskRepository.save(updatedTask);

    delete updatedTask.column;

    return updatedTask;
  }

  async removeById(userId: number, id: number) {
    await this.changePositionById(userId, id, -1);
    const task = await this.checkTaskAbility(userId, id);

    await this.taskRepository.remove(task);

    return id;
  }

  async changePositionById(
    userId: number,
    id: number,
    newPosition: number,
    newColumnId?: number,
  ) {
    const task = await this.checkTaskAbility(userId, id);
    const column = await this.columnService.checkColumnAbility(
      userId,
      task.column.id,
    );

    if (!newColumnId || column.id === newColumnId) {
      const oldPosition = task.position;
      const tasks = column.tasks;
      if (newPosition <= -1 || newPosition > tasks.length) {
        newPosition = tasks.length;
      }

      if (newPosition <= oldPosition) {
        for (let i = 0; i < tasks.length; i++) {
          if (tasks[i].id === task.id) {
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
          if (tasks[i].id === task.id) {
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
        newColumnId,
      );

      if (column.project.id !== newColumn.project.id) {
        throw new BadRequestException(
          'Unable to change position to another project',
        );
      }

      if (newPosition <= -1 || newPosition > newColumn.tasks.length) {
        newPosition = newColumn.tasks.length;
      }

      await this.changePositionById(userId, id, -1);
      task.position = column.tasks.length;
      const changedTask = await this.taskRepository.save({
        ...task,
        column: {
          id: newColumnId,
        },
      });
      return await this.changePositionById(userId, changedTask.id, newPosition);
    }
  }

  async checkTaskAbility(userId: number, taskId: number) {
    const task = await this.taskRepository.findOne({
      where: {
        id: taskId,
      },
      order: {
        position: 'ASC',
      },
      relations: {
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

    if (task.column.project.user.id !== userId) {
      throw new ForbiddenException('Unable to access the task');
    }

    return task;
  }
}
