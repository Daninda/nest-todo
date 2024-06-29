import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskField } from '../task-field/task-field.model';
import { TaskFieldService } from '../task-field/task-field.service';
import { TaskFieldTypeEnum } from '../task-field/task-field.utils';
import { TaskService } from '../task/task.service';
import { CreateTaskFieldValueDto } from './dto/create-task-field-value.dto';
import { TaskFieldValueNumber } from './task-field-value.number.model';
import { TaskFieldValueString } from './task-field-value.string.model';

@Injectable()
export class TaskFieldValueService {
  constructor(
    @InjectRepository(TaskFieldValueNumber)
    private taskFieldValueNumberRepository: Repository<TaskFieldValueNumber>,
    @InjectRepository(TaskFieldValueString)
    private taskFieldValueStringRepository: Repository<TaskFieldValueString>,
    @InjectRepository(TaskField)
    private taskFieldRepository: Repository<TaskField>,
    private taskFieldService: TaskFieldService,
    private taskService: TaskService,
  ) {}

  async findAll(
    userId: number,
    projectId: number,
    columnId: number,
    taskId: number,
  ) {
    await this.taskService.checkTaskAbility(
      userId,
      projectId,
      columnId,
      taskId,
    );

    const numbers = await this.taskFieldRepository.query(`
      select 
        task_field.id as "taskFieldId",
        task_field_value_number."value",
        task_field_value_number."createAt",
        task_field_value_number."updateAt" from task_field
      left join task_field_value_number
        on task_field.id = task_field_value_number."taskFieldId" 
      left join task
        on task.id = ${taskId}
      where task_field."projectId" = ${projectId} 
        and task_field.type = 'number'`);

    const strings = await this.taskFieldRepository.query(`
      select 
        task_field.id as "taskFieldId",
        task_field_value_string."value",
        task_field_value_string."createAt",
        task_field_value_string."updateAt" from task_field
      left join task_field_value_string
        on task_field.id = task_field_value_string."taskFieldId" 
      left join task
        on task.id = ${taskId}
      where task_field."projectId" = ${projectId} 
        and task_field.type = 'string'`);

    return [...numbers, ...strings];
  }

  async findOneById(
    userId: number,
    projectId: number,
    columnId: number,
    taskId: number,
    taskFieldId: number,
  ) {
    const taskFieldValue = await this.checkTaskFieldValueAbility(
      userId,
      projectId,
      columnId,
      taskId,
      taskFieldId,
    );

    return taskFieldValue;
  }

  async createOrUpdateOne(
    userId: number,
    projectId: number,
    columnId: number,
    taskId: number,
    taskFieldId: number,
    taskFieldValueDto: CreateTaskFieldValueDto,
  ) {
    await this.taskService.checkTaskAbility(
      userId,
      projectId,
      columnId,
      taskId,
    );
    const taskField = await this.taskFieldService.findOneById(
      userId,
      projectId,
      taskFieldId,
    );

    if (taskField.type === TaskFieldTypeEnum.NUMBER) {
      if (typeof taskFieldValueDto.value !== 'number') {
        throw new BadRequestException('Value must be a number');
      }
      await this.taskFieldValueNumberRepository.save({
        task: {
          id: taskId,
        },
        taskField: {
          id: taskFieldId,
        },
        value: taskFieldValueDto.value,
      });

      return await this.taskFieldValueNumberRepository.findOne({
        where: {
          task: {
            id: taskId,
          },
          taskField: {
            id: taskFieldId,
          },
        },
      });
    } else {
      if (typeof taskFieldValueDto.value !== 'string') {
        throw new BadRequestException('Value must be a string');
      }
      await this.taskFieldValueStringRepository.save({
        taskId: taskId,
        taskFieldId: taskFieldId,
        value: taskFieldValueDto.value,
      });

      return await this.taskFieldValueStringRepository.findOne({
        where: {
          task: {
            id: taskId,
          },
          taskField: {
            id: taskFieldId,
          },
        },
      });
    }
  }

  async removeOne(
    userId: number,
    projectId: number,
    columnId: number,
    taskId: number,
    taskFieldId: number,
  ) {
    const taskFieldValue = await this.checkTaskFieldValueAbility(
      userId,
      projectId,
      columnId,
      taskId,
      taskFieldId,
    );

    if (taskFieldValue.taskField.type === 'number') {
      await this.taskFieldValueNumberRepository.remove(
        taskFieldValue as TaskFieldValueNumber,
      );
    } else {
      await this.taskFieldValueNumberRepository.remove(
        taskFieldValue as TaskFieldValueNumber,
      );
    }

    return {
      taskId: taskId,
      taskFieldId: taskFieldId,
    };
  }

  async checkTaskFieldValueAbility(
    userId: number,
    projectId: number,
    columnId: number,
    taskId: number,
    taskFieldId: number,
  ) {
    const taskField = await this.taskFieldService.findOneById(
      userId,
      projectId,
      taskFieldId,
    );

    let taskFieldValue: TaskFieldValueNumber | TaskFieldValueString;

    if (taskField.type === TaskFieldTypeEnum.NUMBER) {
      taskFieldValue = await this.taskFieldValueNumberRepository.findOne({
        where: {
          task: {
            id: taskId,
          },
          taskField: {
            id: taskFieldId,
          },
        },
        relations: {
          taskField: true,
          task: {
            column: {
              project: {
                user: true,
              },
            },
          },
        },
      });
    } else {
      taskFieldValue = await this.taskFieldValueStringRepository.findOne({
        where: {
          task: {
            id: taskId,
          },
          taskField: {
            id: taskFieldId,
          },
        },
        relations: {
          taskField: true,
          task: {
            column: {
              project: {
                user: true,
              },
            },
          },
        },
      });
    }

    if (!taskFieldValue) {
      throw new BadRequestException('This field has not value');
    }
    if (taskFieldValue.task.column.id !== columnId) {
      throw new BadRequestException('Wrong column id');
    }
    if (taskFieldValue.task.column.project.id !== projectId) {
      throw new BadRequestException('Wrong project id');
    }
    if (taskFieldValue.task.column.project.user.id !== userId) {
      throw new BadRequestException('Unable to access');
    }

    delete taskFieldValue.task;

    return taskFieldValue;
  }
}
