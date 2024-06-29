import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
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
import { CreateTaskFieldDto } from './dto/create-task-field.dto';
import { UpdateTaskFieldDto } from './dto/update-task-field.dto';
import { TaskField } from './task-field.model';
import { TaskFieldService } from './task-field.service';

@ApiTags('Project task fields')
@ApiHeader({
  name: 'Authorization',
  description: 'Access token',
})
@Controller('projects/:projectId/task-fields')
@UseGuards(JwtAuthGuard)
export class TaskFieldController {
  constructor(private taskFieldService: TaskFieldService) {}

  @ApiOperation({ summary: 'Get project task fields ' })
  @ApiOkResponse({
    type: [TaskField],
  })
  @Get()
  async getAll(
    @UserId() userId: number,
    @Param('projectId', ParseIntPipe) projectId: number,
  ) {
    const taskFields = await this.taskFieldService.findAll(userId, projectId);

    return taskFields;
  }

  @ApiOperation({ summary: 'Get task field by id' })
  @ApiOkResponse({
    type: TaskField,
  })
  @Get(':taskFieldId')
  async getOneById(
    @UserId() userId: number,
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('taskFieldId', ParseIntPipe) taskFieldId: number,
  ) {
    const taskField = await this.taskFieldService.findOneById(
      userId,
      projectId,
      taskFieldId,
    );

    return taskField;
  }

  @ApiOperation({ summary: 'Create task field' })
  @ApiOkResponse({
    type: TaskField,
  })
  @Post()
  async create(
    @UserId() userId: number,
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() taskFieldDto: CreateTaskFieldDto,
  ) {
    const taskField = await this.taskFieldService.create(
      userId,
      projectId,
      taskFieldDto,
    );

    return taskField;
  }

  @ApiOperation({ summary: 'Update task field by id' })
  @ApiOkResponse({
    type: TaskField,
  })
  @Put(':taskFieldId')
  async updateById(
    @UserId() userId: number,
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('taskFieldId', ParseIntPipe) taskFieldId: number,
    @Body() taskFieldDto: UpdateTaskFieldDto,
  ) {
    const taskField = await this.taskFieldService.updateById(
      userId,
      projectId,
      taskFieldId,
      taskFieldDto,
    );

    return taskField;
  }

  @ApiOperation({ summary: 'Delete task field by id' })
  @ApiOkResponse({
    type: Number,
  })
  @Delete(':taskFieldId')
  async removeById(
    @UserId() userId: number,
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('taskFieldId', ParseIntPipe) taskFieldId: number,
  ) {
    const deletedId = await this.taskFieldService.removeById(
      userId,
      projectId,
      taskFieldId,
    );

    return deletedId;
  }
}
