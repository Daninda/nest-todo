import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { ProjectModule } from 'src/project/project.module';
import { UserModule } from 'src/user/user.module';
import { ColumnController } from './column.controller';
import { TodoColumn } from './column.model';
import { ColumnService } from './column.service';

@Module({
  providers: [ColumnService],
  controllers: [ColumnController],
  imports: [
    AuthModule,
    UserModule,
    ProjectModule,
    TypeOrmModule.forFeature([TodoColumn]),
  ],
  exports: [ColumnService],
})
export class ColumnModule {}
