import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { ProjectService } from 'src/project/project.service';
import { UserService } from 'src/user/user.service';
import { ColumnController } from './column.controller';
import { TodoColumn } from './column.model';
import { ColumnService } from './column.service';

@Module({
  providers: [ColumnService],
  controllers: [ColumnController],
  imports: [
    AuthService,
    UserService,
    ProjectService,
    TypeOrmModule.forFeature([TodoColumn]),
  ],
})
export class ColumnModule {}
