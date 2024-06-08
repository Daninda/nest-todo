import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { TodoColumn } from './column/column.model';
import { ColumnModule } from './column/column.module';
import { Project } from './project/project.model';
import { ProjectModule } from './project/project.module';
import { Task } from './task/task.model';
import { TaskModule } from './task/task.module';
import { User } from './user/user.model';
import { UserModule } from './user/user.module';

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
      entities: [User, Project, TodoColumn, Task],
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    ProjectModule,
    ColumnModule,
    TaskModule,
  ],
})
export class AppModule {}
