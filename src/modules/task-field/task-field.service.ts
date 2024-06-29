import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectService } from '../project/project.service';
import { CreateTaskFieldDto } from './dto/create-task-field.dto';
import { UpdateTaskFieldDto } from './dto/update-task-field.dto';
import { TaskField } from './task-field.model';

@Injectable()
export class TaskFieldService {
  constructor(
    @InjectRepository(TaskField)
    private taskFieldRepository: Repository<TaskField>,
    private projectService: ProjectService,
  ) {}

  async findAll(userId: number, projectId: number) {
    await this.projectService.checkProjectAbility(userId, projectId);
    const taskFields = await this.taskFieldRepository.findBy({
      project: {
        id: projectId,
      },
    });
    return taskFields;
  }

  async findOneById(userId: number, projectId: number, taskFieldId: number) {
    const taskField = await this.checkTaskFieldAbility(
      userId,
      projectId,
      taskFieldId,
    );

    return taskField;
  }

  async create(
    userId: number,
    projectId: number,
    taskFieldDto: CreateTaskFieldDto,
  ) {
    await this.projectService.checkProjectAbility(userId, projectId);

    const taskField = await this.taskFieldRepository.save({
      name: taskFieldDto.name,
      type: taskFieldDto.type,
      project: {
        id: projectId,
      },
    });

    delete taskField.project;

    return taskField;
  }

  async updateById(
    userId: number,
    projectId: number,
    taskFieldId: number,
    taskFieldDto: UpdateTaskFieldDto,
  ) {
    const taskField = await this.checkTaskFieldAbility(
      userId,
      projectId,
      taskFieldId,
    );

    const updatedTaskField = this.taskFieldRepository.merge(taskField, {
      name: taskFieldDto.name,
    });

    await this.taskFieldRepository.save(updatedTaskField);

    return taskField;
  }

  async removeById(userId: number, projectId: number, taskFieldId: number) {
    const taskField = await this.checkTaskFieldAbility(
      userId,
      projectId,
      taskFieldId,
    );

    await this.taskFieldRepository.remove(taskField);

    return { id: taskFieldId };
  }

  async checkTaskFieldAbility(
    userId: number,
    projectId: number,
    taskFieldId: number,
  ) {
    const taskField = await this.taskFieldRepository.findOne({
      where: {
        id: taskFieldId,
      },
      relations: {
        project: {
          user: true,
        },
      },
    });

    if (!taskField) {
      throw new BadRequestException('This task field does not exist');
    }
    if (taskField.project.id !== projectId) {
      throw new BadRequestException('Wrong project id');
    }
    if (taskField.project.user.id !== userId) {
      throw new BadRequestException('Unable to access');
    }

    delete taskField.project;

    return taskField;
  }
}
