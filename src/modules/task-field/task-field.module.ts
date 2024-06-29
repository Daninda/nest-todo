import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { ProjectModule } from '../project/project.module';
import { TaskFieldController } from './task-field.controller';
import { TaskField } from './task-field.model';
import { TaskFieldService } from './task-field.service';

@Module({
  controllers: [TaskFieldController],
  imports: [AuthModule, ProjectModule, TypeOrmModule.forFeature([TaskField])],
  exports: [TaskFieldService],
  providers: [TaskFieldService],
})
export class TaskFieldModule {}
