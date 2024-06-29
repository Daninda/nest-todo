import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserId } from 'src/decorators/user-id.decorator';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { ChangeTaskPositionDto } from './dto/change-task-position.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './task.model';
import { TaskService } from './task.service';

@ApiTags('Tasks')
@ApiHeader({
  name: 'Authorization',
  description: 'Access token',
})
@Controller('projects/:projectId/columns/:columnId/tasks')
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(private taskService: TaskService) {}

  @ApiOperation({ summary: 'Get all column tasks' })
  @ApiOkResponse({
    type: [Task],
  })
  @Get()
  async getAll(
    @UserId() userId: number,
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('columnId', ParseIntPipe) columnId: number,
  ) {
    const tasks = await this.taskService.findAll(userId, projectId, columnId);
    return tasks;
  }

  @ApiOperation({ summary: 'Get column task by id' })
  @ApiOkResponse({
    type: Task,
  })
  @Get(':taskId')
  async getOneById(
    @UserId() userId: number,
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('columnId', ParseIntPipe) columnId: number,
    @Param('taskId', ParseIntPipe) taskId: number,
  ) {
    const task = await this.taskService.findOneById(
      userId,
      projectId,
      columnId,
      taskId,
    );
    return task;
  }

  @ApiOperation({ summary: 'Create column task' })
  @ApiCreatedResponse({
    type: Task,
  })
  @Post()
  async create(
    @UserId() userId: number,
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('columnId', ParseIntPipe) columnId: number,
    @Body() taskDto: CreateTaskDto,
  ) {
    const task = await this.taskService.create(
      userId,
      projectId,
      columnId,
      taskDto,
    );
    return task;
  }

  @ApiOperation({ summary: 'Update column task by id' })
  @ApiOkResponse({
    type: Task,
  })
  @Put(':taskId')
  async updateById(
    @UserId() userId: number,
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('columnId', ParseIntPipe) columnId: number,
    @Param('taskId', ParseIntPipe) taskId: number,
    @Body() taskDto: UpdateTaskDto,
  ) {
    const task = await this.taskService.updateById(
      userId,
      projectId,
      columnId,
      taskId,
      taskDto,
    );
    return task;
  }

  @ApiOperation({ summary: 'Remove column task by id' })
  @ApiOkResponse({
    type: Number,
  })
  @Delete(':taskId')
  async removeById(
    @UserId() userId: number,
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('columnId', ParseIntPipe) columnId: number,
    @Param('taskId', ParseIntPipe) taskId: number,
  ) {
    const deletedId = await this.taskService.removeById(
      userId,
      projectId,
      columnId,
      taskId,
    );
    return deletedId;
  }

  @ApiOperation({ summary: 'Change task position by id' })
  @ApiOkResponse({
    type: Task,
  })
  @Patch(':taskId')
  async changePositionById(
    @UserId() userId: number,
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('columnId', ParseIntPipe) columnId: number,
    @Param('taskId', ParseIntPipe) taskId: number,
    @Body() changePositionDto: ChangeTaskPositionDto,
  ) {
    const task = await this.taskService.changePositionById(
      userId,
      projectId,
      columnId,
      taskId,
      changePositionDto.newPosition,
      changePositionDto.newColumnId,
    );
    return task;
  }
}
