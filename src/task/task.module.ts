import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { ColumnModule } from 'src/column/column.module';
import { TaskController } from './task.controller';
import { Task } from './task.model';
import { TaskService } from './task.service';

@Module({
  controllers: [TaskController],
  imports: [AuthModule, ColumnModule, TypeOrmModule.forFeature([Task])],
  providers: [TaskService],
})
export class TaskModule {}
