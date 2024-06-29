import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserId } from 'src/decorators/user-id.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateTaskFieldValueDto } from './dto/create-task-field-value.dto';
import { TaskFieldValueNumber } from './task-field-value.number.model';
import { TaskFieldValueService } from './task-field-value.service';

@ApiTags('Project task field values')
@ApiHeader({
  name: 'Authorization',
  description: 'Access token',
})
@Controller(
  'projects/:projectId/columns/:columnId/tasks/:taskId/task-field-values',
)
@UseGuards(JwtAuthGuard)
export class TaskFieldValueController {
  constructor(private taskFieldValueService: TaskFieldValueService) {}

  @ApiOperation({ summary: 'Get task field values ' })
  @ApiOkResponse({
    type: [TaskFieldValueNumber],
  })
  @Get()
  async getAll(
    @UserId() userId: number,
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('columnId', ParseIntPipe) columnId: number,
    @Param('taskId', ParseIntPipe) taskId: number,
  ) {
    const taskFieldValues = await this.taskFieldValueService.findAll(
      userId,
      projectId,
      columnId,
      taskId,
    );

    return taskFieldValues;
  }

  @ApiOperation({
    summary: 'Get task field value by task id and task field id',
  })
  @ApiOkResponse({
    type: TaskFieldValueNumber,
  })
  @Get(':taskFieldValueId')
  async getOneById(
    @UserId() userId: number,
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('columnId', ParseIntPipe) columnId: number,
    @Param('taskId', ParseIntPipe) taskId: number,
    @Param('taskFieldValueId', ParseIntPipe) taskFieldValueId: number,
  ) {
    const taskFieldValue = await this.taskFieldValueService.findOneById(
      userId,
      projectId,
      columnId,
      taskId,
      taskFieldValueId,
    );
    return taskFieldValue;
  }

  @ApiOperation({ summary: 'Create task field value' })
  @ApiOkResponse({
    type: TaskFieldValueNumber,
  })
  @Put(':taskFieldId')
  async createOrUpdateOne(
    @UserId() userId: number,
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('columnId', ParseIntPipe) columnId: number,
    @Param('taskId', ParseIntPipe) taskId: number,
    @Param('taskFieldId', ParseIntPipe) taskFieldId: number,
    @Body() createTaskFieldValueDto: CreateTaskFieldValueDto,
  ) {
    const task = await this.taskFieldValueService.createOrUpdateOne(
      userId,
      projectId,
      columnId,
      taskId,
      taskFieldId,
      createTaskFieldValueDto,
    );
    return task;
  }

  @ApiOperation({ summary: 'Remove task field value' })
  @ApiOkResponse({
    type: TaskFieldValueNumber,
  })
  @Delete(':taskFieldId')
  async removeOne(
    @UserId() userId: number,
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('columnId', ParseIntPipe) columnId: number,
    @Param('taskId', ParseIntPipe) taskId: number,
    @Param('taskFieldId', ParseIntPipe) taskFieldId: number,
  ) {
    const deletedId = await this.taskFieldValueService.removeOne(
      userId,
      projectId,
      columnId,
      taskId,
      taskFieldId,
    );
    return deletedId;
  }
}
