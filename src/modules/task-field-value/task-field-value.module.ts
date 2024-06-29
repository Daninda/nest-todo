import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { TaskField } from '../task-field/task-field.model';
import { TaskFieldModule } from '../task-field/task-field.module';
import { Task } from '../task/task.model';
import { TaskModule } from '../task/task.module';
import { TaskFieldValueController } from './task-field-value.controller';
import { TaskFieldValueNumber } from './task-field-value.number.model';
import { TaskFieldValueService } from './task-field-value.service';
import { TaskFieldValueString } from './task-field-value.string.model';

@Module({
  providers: [TaskFieldValueService],
  imports: [
    TaskFieldModule,
    AuthModule,
    TaskModule,
    TypeOrmModule.forFeature([
      TaskFieldValueNumber,
      TaskFieldValueString,
      TaskField,
      Task,
    ]),
  ],
  controllers: [TaskFieldValueController],
})
export class TaskFieldValueModule {}
