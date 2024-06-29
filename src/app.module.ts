import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { TodoColumn } from './modules/column/column.model';
import { ColumnModule } from './modules/column/column.module';
import { Project } from './modules/project/project.model';
import { ProjectModule } from './modules/project/project.module';
import { TaskFieldValueModule } from './modules/task-field-value/task-field-value.module';
import { TaskFieldValueNumber } from './modules/task-field-value/task-field-value.number.model';
import { TaskFieldValueString } from './modules/task-field-value/task-field-value.string.model';
import { TaskField } from './modules/task-field/task-field.model';
import { TaskFieldModule } from './modules/task-field/task-field.module';
import { Task } from './modules/task/task.model';
import { TaskModule } from './modules/task/task.module';
import { User } from './modules/user/user.model';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USERNAME,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      entities: [
        User,
        Project,
        TodoColumn,
        Task,
        TaskField,
        TaskFieldValueNumber,
        TaskFieldValueString,
      ],
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    ProjectModule,
    ColumnModule,
    TaskModule,
    TaskFieldModule,
    TaskFieldValueModule,
  ],
})
export class AppModule {}
